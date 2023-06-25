import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { brand, year, price } = req.query;

    // Build your Prisma query based on the filtering criteria
    const cars = await prisma.car.findMany({
        where: {
            brand: brand || undefined, // Check if the filtering criterion is defined
            year: year ? parseInt(year) : undefined,
            price: price ? parseFloat(price) : undefined,
        },
    });

    // Send the queried cars as a response
    res.json(cars);
}
