import {addDays, parseISO, setHours, setMinutes, startOfDay} from 'date-fns';
import prisma from "@/lib/prisma";
import { getSession } from 'next-auth/react';
import nodemailer from "nodemailer";
import { format } from 'date-fns';

function getDatesBetweenDates(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    const adjustedEndDate = addDays(new Date(endDate), 1); // on ajoute un jour à la date de fin

    while (currentDate < adjustedEndDate) { // on utilise maintenant "<" au lieu de "<="
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

export default async function handler(req, res) {
    const session = await getSession({ req });
    const { id } = req.query;
    try {
        if (req.method === 'POST') {
            const {
                carId,
                email,
                startDate,
                endDate,
                startTime,
                endTime,
                total,
                status,
            } = req.body;

            const parseCarId = parseInt(carId);
            const parsedStartDate = parseISO(startDate);
            const parsedEndDate = parseISO(endDate);
            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);
            const parsedStartTime = setHours(setMinutes(parsedStartDate, startMinute), startHour);
            const parsedEndTime = setHours(setMinutes(parsedEndDate, endMinute), endHour);


             // Inside your code:

            const formattedStartDate = format(parsedStartDate, 'dd/MM/yyyy');
            const formattedEndDate = format(parsedEndDate, 'dd/MM/yyyy');



            // Recherche du client à partir de l'email
            const client = await prisma.client.findFirst({
                where: {
                    email: email,
                },
            });

            if (!client) {
                return res.status(404).json({ error: 'Client non trouvé.' });
            }
            const clientId = client.id;

            const car = await prisma.car.findUnique({
                where: { id: parseCarId },
                include: { Agency: true },
            });

            if (!car) {
                return res.status(404).json({ error: 'Voiture non trouvée.' });
            }

            const agencyId = car.agencyId;

            // Create a new rental in the database
            const rental = await prisma.rental.create({
                data: {
                    carId:parseCarId,
                    clientId,
                    startDate:parsedStartDate,
                    endDate:parsedEndDate,
                    startTime: parsedStartTime,
                    endTime: parsedEndTime,
                    total: parseFloat(total),
                    status: status,
                },
            });

            // Find all availability records for the car within the rental period
            const availabilities = await prisma.availability.findMany({
                where: {
                    carId: parseCarId,
                    date: {
                        gte: startOfDay(parsedStartDate),
                        lt: startOfDay(addDays(parsedEndDate, 1)), // End date now includes the day of end date
                    },
                },
            });

            // Delete all found availability records
            await prisma.availability.deleteMany({
                where: {
                    id: {
                        in: availabilities.map((a) => a.id),
                    },
                },
            });

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });

            let imageUrl;
            if (process.env.NODE_ENV === 'development') {
                imageUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNMUztOoMBnPAYvVulW_GF0189vAJRr3AQEngvD0lpkg&s`;
            }

            // Définir les options pour l'email
            let mailOptions = {
                from: process.env.EMAIL, // Expéditeur
                to: email, // Destinataire
                subject: 'Confirmation de réservation', // Sujet
                html: `
    <div style="width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 15px; font-family: Roboto, serif;">
    <header style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #444;">Confirmation de réservation</h1>
    </header>
    <div style="text-align: center;">
        <img src="${imageUrl}" alt="Logo de l'agence" style="width: 150px; height: auto; margin-bottom: 30px;">
    </div>
    <p>Bonjour <span style="font-weight:bold;text-transform:uppercase;">${client.name} ${client.firstname}</span>,</p>
    <p>Merci d'avoir réservé à notre agence <span style="font-weight:bold;text-transform:uppercase;">${car.Agency.name}</span>!</p>
    <p>Votre réservation a été confirmée avec succès! Voici les détails de votre réservation :</p>
    <table style="width: 100%; margin-bottom: 30px; text-align:center;">
         <tr>
                <th style="text-align: left;">Date de début</th>
                <td style="text-align: left;">${formattedStartDate}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Date de fin</th>
                <td style="text-align: left;">${formattedEndDate}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Heure de début</th>
                <td style="text-align: left;">${startTime}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Heure de fin</th>
                <td style="text-align: left;">${endTime}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Voiture réservée</th>
                <td style="text-align: left;">${car.brand} ${car.model}</td>
            </tr>
    </table>
    <h2 style="text-align:center;">Total de la réservation : ${total}DT</h2>
    <p>Pour toute information supplémentaire, veuillez contacter l'agence <span style="font-weight:bold;text-transform:uppercase;">${car.Agency.name}</span> au numéro <span style="font-weight:bold;text-transform:uppercase;">${car.Agency.telephone}</span> ou à l'adresse ${car.Agency.email}.</p>
    <p>Merci pour votre réservation!</p>
    <p>Cordialement,</p>
    <p>L'équipe Automobelite</p>
    <footer style="text-align: center; margin-top: 50px;">
        <p style="color: #777;">&copy; ${new Date().getFullYear()} - Automobelite</p>
    </footer>
</div>

    ` // Corps de l'e-mail
            };

            // Envoyer l'email
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email envoyé: ' + info.response);
                }
            });

            // Ajoutez l'ID de la réservation à l'objet JSON
            const rentalWithId = { ...rental, agencyId, id: rental.id };

            res.status(201).json(rentalWithId);
        }

        if (req.method === 'PUT') {
            const {
                carId,
                email,
                oldStartDate,
                oldEndDate,
                startDate,
                endDate,
                startTime,
                endTime,
                total,
                status,
            } = req.body;

            const parsedCarId = parseInt(carId);
            const parsedStartDate = parseISO(startDate);
            const parsedEndDate = parseISO(endDate);
            const parsedOldStartDate = parseISO(oldStartDate);
            const parsedOldEndDate = parseISO(oldEndDate);
            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);
            const parsedStartTime = setHours(setMinutes(parsedStartDate, startMinute), startHour);
            const parsedEndTime = setHours(setMinutes(parsedEndDate, endMinute), endHour);
            const formattedStartDate = format(parsedStartDate, 'dd/MM/yyyy');
            const formattedEndDate = format(parsedEndDate, 'dd/MM/yyyy');

            const rentalId = await prisma.rental.findUnique({
                where: { id: parseInt(id) },
                include: { car: true, client: true },
            });

            const client = await prisma.client.findFirst({
                where: {
                    email: email,
                },
            });

            if (!client) {
                return res.status(404).json({ error: 'Client non trouvé.' });
            }
            const clientId = client.id;

            const car = await prisma.car.findUnique({
                where: { id: carId },
                include: { Agency: true },
            });
            const agencyId = car.agencyId;

            const rental = await prisma.rental.update({
                where: { id: parseInt(id) },
                data: {
                    clientId,
                    carId: parsedCarId,
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    startTime: parsedStartTime,
                    endTime: parsedEndTime,
                    total: parseFloat(total),
                    status: status,
                },
            });

            const newAvailabilities = await prisma.availability.findMany({
                where: {
                    carId: carId,
                    date: {
                        gte: startOfDay(parsedStartDate),
                        lt: startOfDay(addDays(parsedEndDate, 1)),
                    },
                },
            });

            await prisma.availability.deleteMany({
                where: {
                    id: {
                        in: newAvailabilities.map((a) => a.id),
                    },
                },
            });

            const oldDates = getDatesBetweenDates(parsedOldStartDate, parsedOldEndDate);
            console.log(oldDates);

            for (const date of oldDates) {
                const newAvailability = await prisma.availability.create({
                    data: {
                        carId: parsedCarId,
                        date: startOfDay(date),
                    },
                });
                console.log(newAvailability);
            }

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });

            let imageUrl;
            if (process.env.NODE_ENV === 'development') {
                imageUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNMUztOoMBnPAYvVulW_GF0189vAJRr3AQEngvD0lpkg&s`;
            }

            // Définir les options pour l'email
            let mailOptions = {
                from: process.env.EMAIL, // Expéditeur
                to: email, // Destinataire
                subject: 'Modification de votre réservation',
                html: `
<div style="width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 15px; font-family: Roboto, serif;">
    <header style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #444;">Modification de votre réservation</h1>
    </header>
    <div style="text-align: center;">
        <img src="${imageUrl}" alt="Logo de l'agence" style="width: 150px; height: auto; margin-bottom: 30px;">
    </div>
    <p>Bonjour <span style="font-weight:bold;text-transform:uppercase;">${client.name} ${client.firstname}</span>,</p>
    <p>Votre réservation à notre agence <span style="font-weight:bold;text-transform:uppercase;">${car.Agency.name}</span> a été modifiée avec succès! Voici les détails de votre nouvelle réservation :</p>
    <table style="width: 100%; margin-bottom: 30px; text-align:center;">
         <tr>
                <th style="text-align: left;">Date de début</th>
                <td style="text-align: left;">${formattedStartDate}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Date de fin</th>
                <td style="text-align: left;">${formattedEndDate}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Heure de début</th>
                <td style="text-align: left;">${startTime}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Heure de fin</th>
                <td style="text-align: left;">${endTime}</td>
            </tr>
            <tr>
                <th style="text-align: left;">Voiture réservée</th>
                <td style="text-align: left;">${car.brand} ${car.model}</td>
            </tr>
    </table>
   <h2 style="text-align:center;">Total de la réservation : ${total}DT</h2>
    <p>Pour toute information supplémentaire, veuillez contacter l'agence <span style="font-weight:bold;text-transform:uppercase;">${car.Agency.name}</span> au numéro <span style="font-weight:bold;text-transform:uppercase;">${car.Agency.telephone}</span> ou à l'adresse ${car.Agency.email}.</p>
    <p>Merci pour votre confiance!</p>
    <p>Cordialement,</p>
    <p>L'équipe Automobelite</p>
        <footer style="text-align: center; margin-top: 50px;">
            <p style="color: #777;">&copy; ${new Date().getFullYear()} - Automobelite</p>
        </footer>
</div>

    ` // Corps de l'e-mail
            };

            // Envoyer l'email
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email envoyé: ' + info.response);
                }
            });


            const rentalWithId = { ...rental, agencyId, id: rental.id };
            res.status(201).json(rentalWithId);
        }

        if (req.method === 'GET') {
            const clientId = session?.user?.id;

            if (!clientId) {
                return res.status(401).json({ error: 'Client ID not found in session' });
            }

            try {
                // If an ID query parameter exists, get rental data for that ID
                if (req.query?.id) {
                    const rentalId = req.query.id;
                    const rental = await prisma.rental.findUnique({
                        where: {
                            id: Number(rentalId),
                        },
                        include: {
                            car: {
                                include: {
                                    Agency: true,
                                    availability: true,
                                },
                            },
                        },
                    });
                    res.json(rental);
                } else {
                    const rentals = await prisma.rental.findMany({
                        where: {
                            clientId: parseInt(clientId),
                            status: 'reserved'
                        },
                        include: { car: true },
                    });

                    return res.status(200).json(rentals);
                }
            } catch (error) {
                res.status(500).json({ error: 'Error retrieving rental data' });
            }
        }

        if (req.method === 'DELETE') {
            const clientId = session?.user?.id;
            const clientEmail = session?.user?.email;
            if (!clientId) {
                return res.status(401).json({ error: 'Client ID not found in session' });
            }

            try {
                // If an ID query parameter exists, get rental data for that ID
                if (req.query?.id) {
                    const rentalId = req.query.id;
                    const rental = await prisma.rental.findUnique({
                        where: {
                            id: Number(rentalId),
                        },
                        include: {
                            client: true, // Include client data
                            car: {
                                include: {
                                    Agency: true,
                                    availability: true,
                                },
                            },
                        },
                    });

                    // Get the dates between the start and end dates of the rental
                    const datesToDelete = getDatesBetweenDates(rental.startDate, rental.endDate);

                    // For each date in the range, create a new availability
                    for (const date of datesToDelete) {
                        await prisma.availability.create({
                            data: {
                                carId: rental.carId,
                                date: startOfDay(date),
                            },
                        });
                    }

                    // Update the rental status
                    await prisma.rental.update({
                        where: {
                            id: Number(rentalId),
                        },
                        data: {
                            status: 'cancelled', // Replace 'updatedStatus' with the desired status
                        },
                    });

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD,
                        },
                    });

                    let imageUrl;
                    if (process.env.NODE_ENV === 'development') {
                        imageUrl = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNMUztOoMBnPAYvVulW_GF0189vAJRr3AQEngvD0lpkg&s`;
                    }

                    // Définir les options pour l'email
                    let mailOptions = {
                        from: process.env.EMAIL, // Expéditeur
                        to: clientEmail, // Destinataire
                        subject: 'Annulation de votre réservation',
                        html: `
                <div style="width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 15px; font-family: Roboto, serif;">
<header style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #444;">Annulation de votre réservation</h1>
</header>
<div style="text-align: center;">
    <img src="${imageUrl}" alt="Logo de l'agence" style="width: 150px; height: auto; margin-bottom: 30px;">
</div>
<p>Bonjour <span style="font-weight:bold;text-transform:uppercase;">${rental.client.name} ${rental.client.firstname}</span>,</p>
<p>Nous sommes désolés d'apprendre que vous avez dû annuler votre réservation à notre agence <span style="font-weight:bold;text-transform:uppercase;">${rental.car.Agency.name}</span>. Nous espérons que vous choisirez à nouveau notre agence pour vos futures réservations.</p>
<p>Si vous avez des questions ou si vous avez besoin d'aide pour une future réservation, n'hésitez pas à contacter l'agence <span style="font-weight:bold;text-transform:uppercase;">${rental.car.Agency.name}</span> au numéro <span style="font-weight:bold;text-transform:uppercase;">${rental.car.Agency.telephone}</span> ou à l'adresse ${rental.car.Agency.email}.</p>
<p>Merci pour votre compréhension,</p>
<p>Cordialement,</p>
<p>L'équipe Automobelite</p>
<footer style="text-align: center; margin-top: 50px;">
    <p style="color: #777;">&copy; ${new Date().getFullYear()} - Automobelite</p>
</footer>
</div>
                ` // Corps de l'e-mail
                    };

                    // Envoyer l'email
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email envoyé: ' + info.response);
                        }
                    });

                    res.status(200).json({ message: 'Rental successfully deleted' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Error retrieving rental data' });
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
