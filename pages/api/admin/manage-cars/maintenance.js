import prisma from "@/lib/prisma";
import {addDays, parseISO, startOfDay} from "date-fns";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {
                id,
                startDate,
                endDate,
                price,
                description,
            } = req.body;

            const carId = parseInt(id);
            const parsedStartDate = parseISO(startDate);
            const parsedEndDate = parseISO(endDate);
            const priceFloat = parseFloat(price);

            // Créer une nouvelle maintenance dans la base de données
            const maintenance = await prisma.maintenance.create({
                data: {
                    carId,
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    cost: priceFloat,
                    description,
                },
            });

            // Supprimer toutes les disponibilités pour la voiture pendant la période de maintenance
            await prisma.availability.deleteMany({
                where: {
                    carId: carId,
                    date: {
                        gte: startOfDay(parsedStartDate),
                        lt: startOfDay(addDays(parsedEndDate, 1)), // End date now includes the day of end date
                    },
                },
            });

            res.status(201).json(maintenance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding maintenance for the car.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed. Use POST method.' });
    }
}