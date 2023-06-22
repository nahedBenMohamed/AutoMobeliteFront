import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { marque, annee, prix } = req.query;

    // Build Prisma query based on the filtering criteria
    const voitures = await prisma.car.findMany({
        where: {
            brand: marque || undefined, // Check if the filtering criteria is defined
            year: annee ? parseInt(annee) : undefined,
            price: prix ? parseFloat(prix) : undefined,
        },
    });

    res.json(voitures);
}
