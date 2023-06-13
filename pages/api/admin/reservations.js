import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    if (req.method === "GET") {
        try {
            const reservations = await prisma.location.findMany({
                include: {
                    client: true,
                    voiture: true,
                },
            });

            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des réservations." });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée. Utilisez la méthode GET." });
    }
}
