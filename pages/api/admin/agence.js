import prisma from '@/lib/prisma';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

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

export default async function handle(req, res) {
    const { method } = req;

    // Extract the agency name from the JWT token
    let agencyName;
    try {
        agencyName = getAgencyNameFromToken(req);
    } catch (error) {
        // Handle error if unable to extract agency name from token
        return res.status(401).json({ message: error.message });
    }

    try {
        if (method === 'GET') {
            // Handle GET method
            const { id } = req.query;

            if (id) {
                // Retrieve a specific agency by its ID
                const agency = await prisma.agency.findUnique({
                    where: { id: parseInt(id) },
                    include: { AgencyUser: true, Cars: true },
                });

                if (!agency) {
                    return res.status(404).json({ message: 'Agency not found.' });
                }

                // Check if the agency name matches the extracted agency name from the token
                if (agency.name !== agencyName) {
                    return res
                        .status(403)
                        .json({ message: 'You are not authorized to access this agency.' });
                }

                const totalParkings = await prisma.parking.count({
                    where: { agencyId: agency.id },
                });

                return res.json({ ...agency, totalParkings });
            } else {
                // Retrieve all agencies for the specific agency name
                const agencies = await prisma.agency.findMany({
                    where: { name: agencyName },
                    include: { AgencyUser: true },
                });

                const agenciesWithCarCount = await Promise.all(
                    agencies.map(async (agency) => {
                        const totalCars = await prisma.car.count({
                            where: { agencyId: agency.id },
                        });
                        const totalParkings = await prisma.parking.count({
                            where: { agencyId: agency.id },
                        });
                        const totalReservations = await prisma.rental.count({
                            where: { car: { agencyId: agency.id } },
                        });

                        return {
                            ...agency,
                            totalCars,
                            totalParkings,
                            totalReservations,
                        };
                    })
                );

                return res.json(agenciesWithCarCount);
            }
        } else {
            return res.status(405).json({ message: 'Method not allowed.' });
        }
    } catch (error) {
        // Handle errors that occur during database interactions
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
}
