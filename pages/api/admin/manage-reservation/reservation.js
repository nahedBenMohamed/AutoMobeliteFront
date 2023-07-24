import prisma from "@/lib/prisma";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import {addDays, startOfDay} from "date-fns";
import nodemailer from "nodemailer";

const getAgencyNameFromToken = (req) => {
    // Extract the JWT token from the request's cookie
    if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;

        try {
            // Verify and decode the JWT token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // Return the agency name from the decoded token
            return decodedToken.agency;
        } catch (error) {
            // Error handling for invalid tokens
            throw new Error("Invalid token.");
        }
    } else {
        // Error handling if no cookies are found
        throw new Error("No cookie found.");
    }
};

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
    // Extract the agency name from the JWT token
    let agency;
    try {
        agency = getAgencyNameFromToken(req);
    } catch (error) {
        // Handle error if unable to extract agency name from token
        return res.status(401).json({message: error.message});
    }

    if (req.method === "PUT") {
        // Extract variables from the request body
        const {id, email, rentalStatus} = req.body;

        // Recherche du client à partir de l'email
        const client = await prisma.client.findFirst({
            where: {
                email: email,
            },
        });

        if (!client) {
            return res.status(404).json({error: "Client non trouvé."});
        }

        const rentalId = parseInt(id);

        // Get rental data for the specified ID
        const rental = await prisma.rental.findUnique({
            where: {
                id: Number(rentalId),
            },
            include: {
                client: true,
                car: {
                    include: {
                        Agency: true,
                    },
                },
            },
        });

        // Vérifier si la réservation existe et si l'agence est autorisée à y accéder
        if (!rental || rental.car.Agency.name !== agency) {
            return res
                .status(403)
                .json({message: "You are not authorized to view this rental."});
        }

        // Update the rental data
        const updatedRental = await prisma.rental.update({
            where: {id: Number(rentalId)},
            data: {
                client: {update: {id: client.id}},
                status: rentalStatus,
            },
            include: {
                car: {
                    include: {
                        Agency: true
                    }
                },
                client: true
            },
        });


        if (updatedRental.status === "completed") {
            // Create a transporter
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

            let mailOptions = {
                from: process.env.EMAIL, // replace this with your email
                to: client.email,
                subject: 'Your reservation is completed',
                html: `
<div style="width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 15px; font-family: Roboto, serif;">
<header style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #444;">Confirmation de réservation</h1>
</header>
<div style="text-align: center;">
    <img src="${imageUrl}" alt="Logo de l'agence" style="width: 150px; height: auto; margin-bottom: 30px;">
</div>
<p>Bonjour <span style="font-weight:bold;text-transform:uppercase;">${client.name} ${client.firstname}</span>,</p>
<p>Nous tenons à vous remercier sincèrement d'avoir choisi notre agence pour vos besoins de location de voiture. Votre confiance et votre soutien sont très appréciés. Merci de nous avoir 
donné l'occasion de vous servir. Nous sommes impatients de vous accueillir à nouveau dans notre agence.</p>
<p>Merci pour votre réservation!</p>
<p>Cordialement,</p>
<p>L'équipe <span style="font-weight:bold;text-transform:uppercase;">${updatedRental.car.Agency.name}</span></p>
<footer style="text-align: center; margin-top: 50px;">
    <p style="color: #777;">&copy; ${new Date().getFullYear()} - Automobelite</p>
</footer>
</div>
` // Corps de l'e-mail
            };

// Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        }

        // Send the updated rental and car data as a response
        res.json({rental: updatedRental});
    }

    if (req.method === "GET") {
        // If an ID query parameter exists, get rental data for that ID
        if (req.query?.id) {
            const rentalId = req.query.id;
            const rental = await prisma.rental.findUnique({
                where: {
                    id: Number(rentalId),
                },
                include: {
                    client: true,
                    car: {
                        include: {
                            Agency: true,
                            availability: true,
                            maintenances: true
                        },
                    },
                },
            });

            // Vérifier si la réservation existe et si l'agence est autorisée à y accéder
            if (!rental || rental.car.Agency.name !== agency) {
                return res
                    .status(403)
                    .json({message: "You are not authorized to view this rental."});
            }

            res.json(rental);
        } else {
            const rentals = await prisma.rental.findMany({
                where: {
                    status: 'reserved',
                    car: {
                        Agency: {
                            name: agency,
                        },
                    },
                },
                include: {
                    client: true,
                    car: true,
                },
            });
            res.status(200).json(rentals);
        }
    }

    if (req.method === 'DELETE') {

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


                res.status(200).json({message: 'Rental successfully deleted'});
            }
        } catch (error) {
            res.status(500).json({error: 'Error retrieving rental data'});
        }
    }
}
