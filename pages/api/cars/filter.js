import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { brand, year, price } = req.query;

    // Construisez votre requête Prisma en fonction des critères de filtrage
    const cars = await prisma.car.findMany({
        where: {
            brand: brand || undefined, // Vérifiez si le critère de filtrage est défini
            year: year ? parseInt(year) : undefined,
            price: price ? parseFloat(price) : undefined,
        },
    });

    res.json(cars);
}
