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

            /*// Vérifier si une maintenance existe déjà pour la voiture spécifiée
            const existingMaintenance = await prisma.maintenance.findFirst({
                where: {
                    carId: carId,
                },
            });

            if (existingMaintenance) {
                // Si une maintenance existe déjà, retourner une erreur
                return res.status(400).json({ error: 'La voiture est déjà en maintenance.' });
            }
            A demander avant d'implementer la solution pour la voiture spécifiée
            */

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
            res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout de la maintenance pour la voiture.' });
        }
    } else {
        res.status(405).json({ error: 'Méthode non autorisée. Utilisez la méthode POST.' });
    }
}