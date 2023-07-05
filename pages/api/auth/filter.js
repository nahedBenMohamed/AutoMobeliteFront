import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const { departDate, returnDate } = req.query;

    try {
        // Vérifier les dates de début et de fin
        if (!departDate || !returnDate) {
            return res.status(400).json({ error: 'Les dates de début et de fin sont requises.' });
        }

        const start = new Date(departDate);
        const end = new Date(returnDate);

        if (start >= end) {
            return res.status(400).json({ error: 'La date de début doit être antérieure à la date de fin.' });
        }

        // Utilisez Prisma pour rechercher les voitures appartenant à cette agence qui sont disponibles pendant la période demandée
        const cars = await prisma.car.findMany({
            where: {
                // Rechercher des voitures qui n'ont pas de locations ou de maintenances pendant la période demandée
                rentals: {
                    none: {
                        OR: [
                            {
                                startDate: { lt: start },
                                endDate: { lt: start }
                            },
                            {
                                startDate: { gt: end },
                                endDate: { gt: end }
                            }
                        ]
                    }
                },
                maintenances: {
                    none: {
                        OR: [
                            {
                                startDate: { lt: start },
                                endDate: { lt: start }
                            },
                            {
                                startDate: { gt: end },
                                endDate: { gt: end }
                            }
                        ]
                    }
                }
            },
            include: {
                rentals: true,
                maintenances: true,
                availability: true
            }
        });

        // Renvoyer les voitures et les parkings en réponse
        res.status(200).json({ cars });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la recherche des voitures.' });
    }
}
