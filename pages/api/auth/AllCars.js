import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { method } = req;

    // Handle GET request
    if (method === 'GET') {
        // Retrieve all cars from the database
        const voitures = await prisma.car.findMany();

        // Send the queried cars as a response
        res.json(voitures);
    }
}