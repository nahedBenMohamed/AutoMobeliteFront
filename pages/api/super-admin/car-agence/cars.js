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

    try {
        // Extract the agency id from the token or query parameters
        let agencyId;
        try {
            agencyId = await getAgencyIdFromToken(req);
        } catch (error) {
            // Return an error response if agency id extraction fails
            return res.status(401).json({ message: error.message });
        }

        const include = { Agency: true, availability: true };

        if (method === "POST") {
            // Handle POST method
            const {
                agencyName,
                parkingName,
                brand,
                model,
                year,
                mileage,
                price,
                registration,
                image,
                description,
                door,
                fuel,
                gearBox,
            } = req.body;

            // Convert variables to the appropriate types
            const yearInt = parseInt(year);
            const mileageInt = parseInt(mileage);
            const priceFloat = parseFloat(price);
            const doorInt = parseInt(door);

            let parking = null;

            // If agencyName is provided, find the corresponding agency id
            const agency = await prisma.agency.findUnique({
                where: { name: agencyName },
            });

            if (!agency) {
                throw new Error("Invalid Agency name.");
            }

            // Check if parkingName is provided
            if (parkingName) {
                // Find the parking by name
                parking = await prisma.parking.findFirst({
                    where: {
                        name: parkingName,
                        agencyId: agency.id, // Check if the parking belongs to the right agency
                    },
                });

                // If parking is not found, return an error
                if (!parking) {
                    return res.status(400).json({ error: "Invalid Parking name." });
                }
            }


            // Create a new car with the provided data
            const newCar = await prisma.car.create({
                data: {
                    brand,
                    model,
                    registration,
                    description,
                    image,
                    fuel,
                    gearBox,
                    year: yearInt,
                    mileage: mileageInt,
                    price: priceFloat,
                    door: doorInt,
                    Agency: {
                        connect: {
                            id: agency.id,
                        },
                    },
                    parking: parking
                        ? {
                            connect: {
                                id: parking.id,
                            },
                        }
                        : undefined,

                },
                include,
            });

            // Generate availability dates for the next 365 days
            const currentDate = new Date();
            const availabilityDates = [];
            for (let i = 0; i < 5; i++) {
                const date = new Date();
                date.setDate(currentDate.getDate() + i);
                availabilityDates.push(date);
            }

            // Insert availability records for the new car
            const availabilityRecords = availabilityDates.map((date) => {
                return {
                    carId: newCar.id,
                    date,
                };
            });

            await prisma.availability.createMany({
                data: availabilityRecords,
            });

            // Send the new car data with availability as a response
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
                image,
                description,
                door,
                fuel,
                gearBox,
                startDate,
                endDate,
            } = req.body;

            // Convert variables to the appropriate types
            const yearInt = parseInt(year);
            const mileageInt = parseInt(mileage);
            const priceFloat = parseFloat(price);
            const doorInt = parseInt(door);

            let parking = null;

            // If agencyName is provided, find the corresponding agency id
            const agency = await prisma.agency.findUnique({
                where: { name: agencyName },
            });

            if (!agency) {
                throw new Error("Invalid Agency name.");
            }

                // Check if parkingName is provided
                if (parkingName) {
                    // Find the parking by name
                    parking = await prisma.parking.findFirst({
                        where: {
                            name: parkingName,
                            agencyId: agency.id, // Check if the parking belongs to the right agency
                        },
                    });

                    // If parking is not found, return an error
                    if (!parking) {
                        return res.status(400).json({ error: "Invalid Parking name." });
                    }
                }

            // Update the car with the provided data
            const updatedCar = await prisma.car.update({
                where: { id: Number(id) },
                data: {
                    brand,
                    model,
                    registration,
                    description,
                    image,
                    fuel,
                    gearBox,
                    year: yearInt,
                    mileage: mileageInt,
                    price: priceFloat,
                    door: doorInt,
                    Agency: {
                        connect: {
                            id: agency.id,
                        },
                    },
                    parking: parking
                        ? {
                            connect: {
                                id: parking.id,
                            },
                        }
                        : {
                            disconnect: true,
                        },
                },
                include,
            });

            // Delete existing availability records for the car only if new dates are provided
            if (startDate && endDate) {
                await prisma.availability.deleteMany({
                    where: { carId: Number(id) },
                });
            }

            // Generate availability dates for the new range
            let availabilityDates = [];

            if (startDate && endDate) {
                const startDateObj = new Date(startDate);
                const endDateObj = new Date(endDate);
                const currentDate = new Date(startDateObj); // Start from the specified start date

                while (currentDate <= endDateObj) {
                    availabilityDates.push(new Date(currentDate)); // Add a new date instance to the list
                    currentDate.setDate(currentDate.getDate() + 1); // Advance by one day
                }
            }

            // Insert new availability records for the car if dates are available
            if (availabilityDates.length > 0) {
                const availabilityRecords = availabilityDates.map((date) => {
                    return {
                        carId: updatedCar.id,
                        date,
                    };
                });

                await prisma.availability.createMany({
                    data: availabilityRecords,
                });
            }
            // Send the updated car data as a response
            res.json(updatedCar);
        }

        if (method === "GET") {
            // Handle GET method
            if (req.query?.id) {
                // Retrieve car by ID
                const carId = req.query.id;
                let car = await prisma.car.findUnique({
                    where: { id: Number(carId) },
                    include: { Agency: true, parking: true , availability: true}, // Include the Agency and parking details
                });
                const availability = await prisma.availability.findMany({
                    where: { carId: Number(carId) },
                });

                const rentals = await prisma.rental.findMany({
                    where: { carId: Number(carId) },
                });

                const maintenances = await prisma.maintenance.findMany({
                    where: { carId: Number(carId) },
                });

                // Merge car data, availability data and rental data
                car = { ...car, availability, maintenances ,rentals };

                res.json(car);
            }
            else {
                // Retrieve all cars belonging to the agency
                const cars = await prisma.car.findMany({
                    where: { Agency: { id: agencyId } },
                    include: { Agency: true, parking: true, availability: true }, // Include the Agency and parking details
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

                // Check if the car is reserved
                const isCarReserved = await prisma.rental.findFirst({
                    where: { carId: Number(carId) },
                });

                // If the car is reserved, send an error response
                if (isCarReserved) {
                    return res.status(403).json({ message: "The car is reserved and cannot be deleted." });
                }

                // Delete the car's availability records
                await prisma.availability.deleteMany({
                    where: { carId: Number(carId) },
                });

                res.json(
                    await prisma.car.delete({
                        where: { id: Number(carId) },
                        include: { Agency: true, parking: true }, // Include the Agency and parking details
                    })
                );
            }
        }
    } catch (error) {
        // Handle errors that occur during database interactions
        res.status(500).json({ message: "An error occurred when interacting with the database.", error: error.message });
    }
}