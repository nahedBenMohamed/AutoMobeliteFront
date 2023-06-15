import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { marque, annee, prix } = req.query;

    // Construisez votre requête Prisma en fonction des critères de filtrage
    const voitures = await prisma.voiture.findMany({
        where: {
            marque: marque || undefined, // Vérifiez si le critère de filtrage est défini
            annee: annee ? parseInt(annee) : undefined,
            prix: prix ? parseFloat(prix) : undefined,
        },
    });

    res.json(voitures);
}
