import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { method } = req;

    // Handle GET request
    if (method === 'GET') {
        // Retrieve all cars from the database
        const cars = await prisma.car.findMany({
            include: {Agency: true, parking: true}, // Include the Agency and parking details
        });

        // Send the queried cars as a response
        res.json(cars);
    }
}