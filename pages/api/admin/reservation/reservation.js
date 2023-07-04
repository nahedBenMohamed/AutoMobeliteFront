import { parseISO, setHours, setMinutes, startOfDay, isAfter, addDays } from 'date-fns';
import prisma from "@/lib/prisma";
import {parseCookies} from "nookies";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

    const { token } = parseCookies({ req });

    let payload;
    try {
        // Verify the token
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        if (req.method === 'POST') {

            const {
                id,
                email,
                startDate,
                endDate,
                startTime,
                endTime,
                total,
                status,
            } = req.body;

            const carId = parseInt(id);
            const parsedStartDate = parseISO(startDate);
            const parsedEndDate = parseISO(endDate);
            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);
            const parsedStartTime = setHours(setMinutes(parsedStartDate, startMinute), startHour);
            let parsedEndTime = setHours(setMinutes(parsedEndDate, endMinute), endHour);

            // Normalize start and end dates to beginning of day and 18:00 respectively
            const startDateNormalized = setHours(setMinutes(parsedStartDate, 0), 0);
            let endDateNormalized = setHours(setMinutes(parsedEndDate, 0), 18);

            // If end time is after 18:00, extend the rental to the next day and set the end time to 18:00
            if (isAfter(parsedEndTime, endDateNormalized)) {
                parsedEndTime = endDateNormalized;
                endDateNormalized = addDays(endDateNormalized, 1);
            }

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

            // Create a new rental in the database
            const rental = await prisma.rental.create({
                data: {
                    carId,
                    clientId,
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    startTime: parsedStartTime,
                    endTime: parsedEndTime,
                    total: parseFloat(total),
                    status: status,
                },
            });

            // Find all availability records for the car within the rental period
            const availabilities = await prisma.availability.findMany({
                where: {
                    carId: carId,
                    date: {
                        gte: startDateNormalized,
                        lte: endDateNormalized,
                    },
                },
            });

            // Delete all found availability records
            await prisma.availability.deleteMany({
                where: {
                    id: {
                        in: availabilities.map(a => a.id)
                    }
                }
            });

            res.status(201).json(rental);
        }

        if (req.method === 'GET') {
            // Extraire le clientId du token
            const { clientId } = payload;

            // Valider l'ID
            if (!clientId) {
                return res.status(400).json({ error: 'L\'ID du client est requis' });
            }

            // Récupérer les réservations pour le client spécifié
            const rentals = await prisma.rental.findMany({
                where: {
                    clientId: clientId,
                },
                include: { car: true }
            });

            // Si aucune réservation n'a été trouvée, retourner une erreur
            if (!rentals.length) {
                return res.status(404).json({ error: 'Aucune réservation trouvée pour ce client' });
            }

            // Sinon, retourner les réservations
            return res.status(200).json(rentals);
        }

    } catch (error) {
        res.status(405).json({ error: 'Method not allowed. Use GET or POST methods.' });
    }
}
