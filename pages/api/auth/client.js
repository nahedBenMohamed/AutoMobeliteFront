import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { method } = req;

    if (method === 'GET') {
        // Handle GET request
        if (req.query?.id) {
            // If an ID is provided in the query parameters
            const userId = req.query.id;

            // Retrieve a specific client by ID from the database
            res.json(await prisma.client.findUnique({ where: { id: Number(userId) } }));
        } else {
            // If no ID is provided, retrieve all clients from the database
            res.json(await prisma.client.findMany());
        }
    }
}