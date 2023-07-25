import { parseISO, setHours, setMinutes, startOfDay, addDays } from 'date-fns';
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
            const parsedEndTime = setHours(setMinutes(parsedEndDate, endMinute), endHour);


            // Recherche du client à partir de l'email
            const client = await prisma.client.findFirst({
                where: {
                    email: email,
                },
            });

            if (!client) {
                return res.status(404).json({error: "Client not found."});
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

            res.status(201).json(rental);
        }

        if (req.method === 'GET') {
            // Extraire le clientId du token
            const { clientId } = payload;

            // Valider l'ID
            if (!clientId) {
                return res.status(400).json({ error: 'Client ID is required' });
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
                return res.status(404).json({ error: 'No reservations found for this client' });
            }

            // Sinon, retourner les réservations
            return res.status(200).json(rentals);
        }

    } catch (error) {
        res.status(405).json({ error: 'Method not allowed. Use GET or POST methods.' });
    }
}
