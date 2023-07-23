import prisma from "@/lib/prisma";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import {addDays, parseISO, startOfDay} from "date-fns";

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

export default async function handler(req, res) {
    // Extract the agency name from the JWT token
    let agency;
    try {
        agency = getAgencyNameFromToken(req);
    } catch (error) {
        // Handle error if unable to extract agency name from token
        return res.status(401).json({ message: error.message });
    }

    if (req.method === "PUT") {
        // Extract variables from the request body
        const {
            id,
            carId,
            description,
            price,
            startDate,
            endDate,
            oldStartDate,
            oldEndDate,
        } = req.body;

        const maintenanceId = parseInt(id);
        const maintenance = await prisma.maintenance.findUnique({
            where: {
                id: Number(maintenanceId),
            },
            include: {
                car: {
                    include: {
                        Agency: true,
                    },
                },
            },
        });

        // Vérifier si la réservation existe et si l'agence est autorisée à y accéder
        if (!maintenance || maintenance.car.Agency.name !== agency) {
            return res
                .status(403)
                .json({ message: "You are not authorized to view this maintenance." });
        }

        // Définir les nouvelles valeurs des dates
        const parsedStartDate = startDate ? parseISO(startDate) : maintenance.startDate;
        const parsedEndDate = endDate ? parseISO(endDate) : maintenance.endDate;
        const parsedOldStartDate = parseISO(oldStartDate);
        const parsedOldEndDate = parseISO(oldEndDate);

        // Update the rental data
        const updatedMaintenance = await prisma.maintenance.update({
            where: { id: Number(maintenanceId) },
            data: {
                carId,
                description,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                cost: parseFloat(price),
            },
            include: { car: true },
        });

        // Supprimer toutes les disponibilités pour la voiture pendant la période de maintenance
        const newAvailabilities = await prisma.availability.findMany({
            where: {
                carId: carId,
                date: {
                    gte: startOfDay(parsedStartDate),
                    lt: startOfDay(addDays(parsedEndDate, 1)),
                },
            },
        });

        await prisma.availability.deleteMany({
            where: {
                id: {
                    in: newAvailabilities.map((a) => a.id),
                },
            },
        });

        const oldDates = getDatesBetweenDates(parsedOldStartDate, parsedOldEndDate);


        for (const date of oldDates) {
            const newAvailability = await prisma.availability.create({
                data: {
                    carId: carId,
                    date: startOfDay(date),
                },
            });
            console.log(newAvailability);
        }

        // Send the updated rental and car data as a response
        res.status(201).json({ maintenance: updatedMaintenance });
    }

    else if (req.method === "GET") {
        // If an ID query parameter exists, get rental data for that ID
        if (req.query?.id) {
            const maintenanceId = req.query.id;
            const maintenance = await prisma.maintenance.findUnique({
                where: {
                    id: Number(maintenanceId),
                },
                    include: {
                        car: {
                            include: {
                                Agency:true,
                                availability: true,
                                rentals: true
                            },
                        },
                    },
        });

            // Vérifier si la réservation existe et si l'agence est autorisée à y accéder
            if (!maintenance || maintenance.car.Agency.name !== agency) {
                return res
                    .status(403)
                    .json({ message: "You are not authorized to view this rental." });
            }

            res.json(maintenance);
        } else {
            const maintenance = await prisma.maintenance.findMany({
                where: {
                    car: {
                        Agency: {
                            name: agency,
                        },
                    },
                },
                include: {
                    car: {
                        include: {
                            availability: true,
                            rentals: true,
                        },
                    },
                },
            });
            res.status(200).json(maintenance);
        }
    } else {
        res
            .status(405)
            .json({ error: "Méthode non autorisée. Utilisez la méthode GET." });
    }
}
