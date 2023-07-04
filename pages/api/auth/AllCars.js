import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { method } = req;

    // Handle GET request
    if (method === 'GET') {
        // If an ID query parameter exists, get car data for that ID
        if (req.query?.id) {
            const carId = req.query.id;
            const car = await prisma.car.findUnique({
                where: { id: Number(carId) },
                include: {
                    Agency: true,
                    parking: true,
                    availability: true,
                },
            });

            // Send the car data as a response
            res.json(car);
        }else {
            // Retrieve all cars from the database
            const cars = await prisma.car.findMany({
                include: {Agency: true, availability: true,parking: true}, // Include the Agency and parking details
            });

            // Send the queried cars as a response
            res.json(cars);
        }

    }
}