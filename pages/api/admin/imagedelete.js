import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import fs from "fs";
import path from 'path';

// Function to extract the agency name from the JWT token
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

export default async function handle(req, res) {
    const { method } = req;

    // Extract the agency name from the JWT token
    let agency;
    try {
        agency = getAgencyNameFromToken(req);
    } catch (error) {
        // Handle error if unable to extract agency name from token
        return res.status(401).json({ message: error.message });
    }

    if (method === "DELETE") {
        try {
            // If an ID query parameter exists, delete the car with that ID
            if (req.query?.id) {
                const carId = req.query.id;
                const car = await prisma.car.findUnique({
                    where: {id: Number(carId)},
                    include: {Agency: true}, // Include the Agency
                });

                if (!car) {
                    return res.status(404).json({message: "Car not found."});
                }

                // If the agency does not have access to the car, send an error
                if (car.Agency.name !== agency) {
                    return res.status(403).json({message: "You are not authorized to delete this car."});
                }

                if (car.image) {
                    const imagePath = path.join(process.cwd(), '/public', car.image);
                    fs.unlinkSync(imagePath);
                }

                // Delete the car and send the deleted car data as a response
                res.json(
                    await prisma.car.update({
                        where: {id: Number(carId)},
                        data: {image: null},
                    })
                );
            }

        } catch (error) {
            res.status(500).json({message: "Error deleting image.", error: error.message});
        }
    }
}
