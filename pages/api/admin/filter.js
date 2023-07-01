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
            throw new Error('Invalid token.');
        }
    } else {
        // Error handling if no cookies are found
        throw new Error('No cookie found.');
    }
};
export default async function handler(req, res) {

    // Utilisez votre fonction pour obtenir le nom de l'agence du token JWT
    const agencyName = getAgencyNameFromToken(req);

    try {
        // Utilisez Prisma pour rechercher les voitures appartenant à cette agence
        const cars = await prisma.car.findMany({
            where: {
                agency: {
                    name: agencyName
                }
            },
            include: {
                availability: {
                    where: {
                        date: { // Assurez-vous que la date est correctement configurée
                            gte: new Date(req.query.startDate),
                            lte: new Date(req.query.endDate)
                        }
                    }
                },
                maintenances: true,
                rentals: {
                    where: {
                        client: {
                            name: req.query.email
                        }
                    }
                }
            }
        });

        // Utilisez Prisma pour rechercher les parkings appartenant à cette agence
        const parkings = await prisma.parking.findMany({
            where: {
                agency: {
                    name: agencyName
                }
            }
        });

        // Renvoyer les voitures et les parkings en réponse
        res.status(200).json({ cars, parkings });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la recherche des voitures et des parkings.' });
    }
}