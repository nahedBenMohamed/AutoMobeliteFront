import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

// Function to extract the agency ID from the token or query parameters
const getAgencyIdFromToken = async (req) => {
    // Extract the JWT token from the request's cookie
    if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies?.token;

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            return decodedToken.agencyId;
        } catch (error) {
            throw new Error("Invalid token.");
        }
    } else if (req.query.agencyId) {
        // If agencyId is provided in query parameters
        return req.query.agencyId;
    } else if (req.query.agencyName) {
        // If agencyName is provided in query parameters
        const agency = await prisma.agency.findUnique({
            where: { name: req.query.agencyName },
        });

        if (agency) {
            return agency.id;
        } else {
            throw new Error("Invalid agency name.");
        }
    } else {
        throw new Error("No agency ID or name provided.");
    }
};

export default async function handle(req, res) {
    const { method } = req;

    // Extract the agency id from the token or query parameters
    let agencyId;
    try {
        agencyId = await getAgencyIdFromToken(req);
    } catch (error) {
        // Return an error response if agency id extraction fails
        return res.status(401).json({ message: error.message });
    }

    const include = { Agency: true };

    try {
        if (method === "POST") {
            // Handle POST method
            const {
                agencyName,
                parkingName,
                brand,
                year,
                mileage,
                model,
                price,
                registration,
                status,
                image,
            } = req.body;

            const parsedYear = parseInt(year);
            const parsedMileage = parseInt(mileage);
            const parsedPrice = parseFloat(price);

            // If agencyName is provided, find the corresponding agency id
            const agency = await prisma.agency.findUnique({
                where: { name: agencyName },
            });

            if (!agency) {
                throw new Error("Invalid agency name.");
            }

            // Create a new car with the provided data
            const newCar = await prisma.car.create({
                data: {
                    brand,
                    model,
                    year: parsedYear,
                    mileage: parsedMileage,
                    price: parsedPrice,
                    status,
                    registration,
                    image,
                    Agency: {
                        connect: {
                            id: agency.id,
                        },
                    },
                    parking: {
                        connect: {
                            name: parkingName,
                        },
                    },
                },
                include,
            });

            res.json(newCar);
        }

        if (method === "PUT") {
            // Handle PUT method
            const {
                id,
                agencyName,
                parkingName,
                brand,
                model,
                year,
                mileage,
                price,
                registration,
                status,
                image,
            } = req.body;

            const parsedYear = parseInt(year);
            const parsedMileage = parseInt(mileage);
            const parsedPrice = parseFloat(price);

            // If agencyName is provided, find the corresponding agency id
            const agency = await prisma.agency.findUnique({
                where: { name: agencyName },
            });

            if (!agency) {
                throw new Error("Invalid agency name.");
            }

            // Update the car with the provided data
            const updatedCar = await prisma.car.update({
                where: { id: Number(id) },
                data: {
                    brand,
                    model,
                    year: parsedYear,
                    mileage: parsedMileage,
                    price: parsedPrice,
                    status,
                    registration,
                    image,
                    Agency: {
                        connect: {
                            id: agency.id,
                        },
                    },
                    parking: {
                        connect: {
                            name: parkingName,
                        },
                    },
                },
                include,
            });

            res.json(updatedCar);
        }

        if (method === "GET") {
            // Handle GET method
            if (req.query?.id) {
                // Retrieve car by ID
                const carId = req.query.id;
                const car = await prisma.car.findUnique({
                    where: { id: Number(carId) },
                    include: {Agency: true, parking: true}, // Include the Agency and parking details
                });
                res.json(car);
            } else {
                // Retrieve all cars belonging to the agency
                const cars = await prisma.car.findMany({
                    where: { Agency: { id: agencyId } },
                    include: {Agency: true, parking: true}, // Include the Agency and parking details
                });
                res.json(cars);
            }
        }

        if (method === "DELETE") {
            // Handle DELETE method
            if (req.query?.id) {
                const carId = req.query.id;
                const car = await prisma.car.findUnique({
                    where: { id: Number(carId) },
                    include,
                });

                res.json(
                    await prisma.car.delete({
                        where: { id: Number(carId) },
                        include: {Agency: true, parking: true}, // Include the Agency and parking details
                    })
                );
            }
        }
    } catch (error) {
        // Handle errors that occur during database interactions
        return res
            .status(500)
            .json({ message: "An error occurred when interacting with the database.", error: error.message });
    }
}
