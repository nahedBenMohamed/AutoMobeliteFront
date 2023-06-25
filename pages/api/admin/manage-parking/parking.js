import prisma from '@/lib/prisma';
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

// Function to extract the agency name from the JWT token in the request's cookie
const getAgencyNameFromToken = (req) => {
    // Extract the JWT token from the request's cookie
    if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            return decodedToken.agency;
        } catch (error) {
            throw new Error("Invalid token.");
        }
    } else {
        throw new Error("No cookie found.");
    }
};

export default async function handle(req, res) {
    const { method } = req;

    // Extract the agency name from the token
    let agencyName;
    try {
        agencyName = getAgencyNameFromToken(req);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }

    try {
        if (method === 'POST') {
            // Handle POST request to create a new parking
            const { name, city, address } = req.body;
            const agency = await prisma.agency.findUnique({ where: { name: agencyName } });

            if (!agency) {
                return res.status(400).json({ message: 'No agency matching this name.' });
            }

            // Check if the parking already exists
            const existingParking = await prisma.parking.findUnique({ where: { name: name } });

            if (existingParking) {
                return res.status(400).json({ message: 'The parking already exists.' });
            }

            const newParking = await prisma.parking.create({
                data: {
                    name: name,
                    city: city,
                    address: address,
                    agencyId: agency.id,
                },
                include: { Agency: true }, // Include Agency object in the response
            });

            // Send a success response
            return res.status(200).json({ message: 'Parking added successfully.', parking: newParking });
        }

        if (method === 'GET') {
            // Handle GET request to retrieve parking information
            const { id } = req.query;

            if (id) {
                // Fetch a parking by its ID
                const parking = await prisma.parking.findUnique({
                    where: { id: parseInt(id) },
                    include: { Agency: true },
                });

                if (!parking || parking.Agency.name !== agencyName) {
                    return res.status(403).json({ message: "You are not authorized to see this parking." });
                }

                return res.json(parking);
            } else {
                // Fetch all parkings
                const parkings = await prisma.parking.findMany({
                    where: { Agency: { name: agencyName } },
                    include: { Agency: true },
                });

                return res.json(parkings);
            }
        }

        if (method === 'PUT') {
            // Handle PUT request to update a parking
            const { id, name, city, image,address } = req.body;
            const agency = await prisma.agency.findUnique({ where: { name: agencyName } });

            if (!agency) {
                return res.status(400).json({ message: 'No agency matching this name.' });
            }

            const updatedParking = await prisma.parking.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    city,
                    address,
                    image,
                    agencyId: agency.id
                },
                include: { Agency: true },
            });

            return res.json(updatedParking);
        }

        if (method === 'DELETE') {
            // Handle DELETE request to delete a parking
            if (req.query?.id) {
                const parkingId = req.query.id;
                const parking = await prisma.parking.findUnique({
                    where: { id: Number(parkingId) },
                    include: { Agency: true },
                });

                if (!parking || parking.Agency.name !== agencyName) {
                    return res.status(403).json({ message: "You are not authorized to delete this parking." });
                }

                res.json(await prisma.parking.delete({
                    where: { id: Number(parkingId) },
                    include: { Agency: true }, // Include Agency object in the response
                }));
            }
        }
    } catch (error) {
        // Handle any errors that occur during the execution of the code
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
}
