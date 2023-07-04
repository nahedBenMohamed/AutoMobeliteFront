import { parseISO, setHours, setMinutes, startOfDay } from 'date-fns';
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
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

            // Normalize start and end dates to beginning of day
            const startDateNormalized = startOfDay(parsedStartDate);
            const endDateNormalized = startOfDay(parsedEndDate);

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
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while creating the rental.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed. Use GET or POST methods.' });
    }
}
