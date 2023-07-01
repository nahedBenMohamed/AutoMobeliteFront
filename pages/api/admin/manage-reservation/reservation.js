import prisma from "@/lib/prisma";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

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

    if (req.method === 'GET') {
        // If an ID query parameter exists, get rental data for that ID
        if (req.query?.id) {
            const rentalId = req.query.id;
            const rental = await prisma.rental.findUnique({
                where: {
                    id: Number(rentalId),
                },
                include: {
                    client: true,
                    car: {
                        include: {
                            Agency: true
                        }
                    }
                },
            });

            // Vérifier si la réservation existe et si l'agence est autorisée à y accéder
            if (!rental || rental.car.Agency.name !== agency) {
                return res.status(403).json({ message: "You are not authorized to view this rental." });
            }

            res.json(rental);
        } else {
            const rentals = await prisma.rental.findMany({
                where: {
                    car: {
                        Agency: {
                            name: agency
                        }
                    }
                },
                include: {
                    client: true,
                    car: true
                },
            });

            res.status(200).json(rentals);
        }
    } else {
        res.status(405).json({ error: 'Méthode non autorisée. Utilisez la méthode GET.' });
    }
}
