import { parseISO, setHours, setMinutes } from 'date-fns';
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const reservations = await prisma.rental.findMany({
                include: {
                    car: true,
                    client: true,
                },
            });

            res.status(200).json(reservations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching the reservations.' });
        }
    }else if (req.method === 'POST') {
        try {
            const {
                carId,
                startDate,
                endDate,
                startTime,
                endTime,
                total,
                status,
                clientId,
            } = req.body;

            const parsedStartDate = parseISO(startDate);
            const parsedEndDate = parseISO(endDate);

            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);
            const parsedStartTime = setHours(setMinutes(parsedStartDate, startMinute), startHour);
            const parsedEndTime = setHours(setMinutes(parsedEndDate, endMinute), endHour);

            // Create a new rental in the database
            const rental = await prisma.rental.create({
                data: {
                    car: {
                        connect: {
                            id: parseInt(carId),
                        },
                    },
                    startDate: parsedStartDate,
                    endDate: parsedEndDate,
                    startTime: parsedStartTime,
                    endTime: parsedEndTime,
                    total: parseFloat(total),
                    status: status,
                    client: {
                        connect: {
                            id: clientId, // Assuming clientId is correct
                        },
                    },
                },
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
