import prisma from "@/lib/prisma";
import { parseISO, setHours, setMinutes } from 'date-fns';
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

            // Convertir les valeurs de startTime et endTime en objets Date
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
                return res.status(404).json({ error: 'Client non trouvé.' });
            }
            const clientId = client.id;

            // Créer une nouvelle location dans la base de données
            const rental = await prisma.rental.create({
                data: {
                    clientId,
                    carId,
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    startTime: parsedStartTime,
                    endTime: parsedEndTime,
                    total,
                    status,
                },
            });

            res.status(201).json(rental);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création de la location.' });
        }
    } else {
        res.status(405).json({ error: 'Méthode non autorisée. Utilisez la méthode POST.' });
    }
}
