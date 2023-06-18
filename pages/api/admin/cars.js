import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

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

    try {
        // Handling different methods (POST, GET, PUT, DELETE)
        if (method === "POST") {
            // Extract variables from the request body
            const {
                parkingName,
                brand,
                model,
                year,
                mileage,
                price,
                registration,
                status,
                images,
            } = req.body;

            // Convert variables to the appropriate types
            const yearInt = parseInt(year);
            const mileageInt = parseInt(mileage);
            const priceFloat = parseFloat(price);

            // Create a new car for the agency extracted from the JWT token
            const newCar = await prisma.car.create({
                data: {
                    brand,
                    model,
                    year: yearInt,
                    mileage: mileageInt,
                    price: priceFloat,
                    registration,
                    status,
                    images: { set: images },
                    Agency: {
                        connect: {
                            name: agency,
                        },
                    },
                    parking: {
                        connect: {
                            name: parkingName,
                        },
                    },
                },
                include: { Agency: true }, // Include the Agency object in the response
            });

            // Send the new car data as a response
            res.json(newCar);
        }

        if (method === "GET") {
            // If an ID query parameter exists, get car data for that ID
            if (req.query?.id) {
                const carId = req.query.id;
                const car = await prisma.car.findUnique({
                    where: { id: Number(carId) },
                    include: {Agency: true, parking: true}, // Include the Agency and parking details
                });

                // If car does not exist or the agency does not have access to the car, send an error
                if (!car || car.Agency.name !== agency) {
                    return res.status(403).json({ message: "You are not authorized to view this car." });
                }

                // Send the car data as a response
                res.json(car);
            } else {
                // If no ID query parameter exists, get all car data for the agency
                const cars = await prisma.car.findMany({
                    where: { Agency: { name: agency } },
                    include: {Agency: true, parking: true}, // Include the Agency and parking details
                });

                // Send the car data as a response
                res.json(cars);
            }
        }

        if (method === "PUT") {
            // Extract variables from the request body
            const {
                parkingName,
                brand,
                model,
                year,
                mileage,
                price,
                registration,
                status,
                images,
                id,
            } = req.body;

            // Convert variables to the appropriate types
            const yearInt = parseInt(year);
            const mileageInt = parseInt(mileage);
            const priceFloat = parseFloat(price);

            // Get car data for the specified ID
            const car = await prisma.car.findUnique({
                where: { id: Number(id) },
                include: {Agency: true, parking: true}, // Include the Agency and parking details
            });

            // If the agency does not have access to the car, send an error
            if (car.Agency.name !== agency) {
                return res.status(403).json({ message: "You are not authorized to modify this car." });
            }

            // Update the car data
            const updatedCar = await prisma.car.update({
                where: { id: Number(id) },
                data: {
                    brand,
                    model,
                    year: yearInt,
                    mileage: mileageInt,
                    price: priceFloat,
                    registration,
                    status,
                    images: { set: images },
                    parking: {
                        connect: {
                            name: parkingName,
                        },
                    },
                },
                include: {Agency: true, parking: true}, // Include the Agency and parking details
            });

            // Send the updated car data as a response
            res.json(updatedCar);
        }

        if (method === "DELETE") {
            // If an ID query parameter exists, delete the car with that ID
            if (req.query?.id) {
                const carId = req.query.id;
                const car = await prisma.car.findUnique({
                    where: { id: Number(carId) },
                    include: {Agency: true, parking: true}, // Include the Agency and parking details
                });

                // If the agency does not have access to the car, send an error
                if (car.Agency.name !== agency) {
                    return res.status(403).json({ message: "You are not authorized to delete this car." });
                }

                // Delete the car and send the deleted car data as a response
                res.json(
                    await prisma.car.delete({
                        where: { id: Number(carId) },
                        include: {Agency: true, parking: true}, // Include the Agency and parking details
                    })
                );
            }
        }
    } catch (error) {
        // Handle error if something goes wrong during database operations
        return res.status(500).json({
            message: "An error occurred while interacting with the database.",
            error: error.message,
        });
    }
}