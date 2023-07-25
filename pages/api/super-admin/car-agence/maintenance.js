import prisma from "@/lib/prisma";
import {endOfDay, parseISO, startOfDay} from "date-fns";

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
            const parsedStartDate = startOfDay(parseISO(startDate));
            const parsedEndDate = endOfDay(parseISO(endDate));
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
                        gte: parsedStartDate,
                        lte: parsedEndDate,
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