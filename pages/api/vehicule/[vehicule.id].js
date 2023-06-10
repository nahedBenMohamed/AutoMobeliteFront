import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;
        try {
            const voiture = await prisma.voiture.findUnique({ where: { id: Number(id) } });
            res.status(200).json(voiture);
        } catch (error) {
            res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération du véhicule' });
        }
    } else if (req.method === "PUT") {
        const { id } = req.query;
        try {
            const updatedVoiture = await prisma.voiture.update({ where: { id: Number(id) }, data: req.body });
            res.status(200).json(updatedVoiture);
        } catch (error) {
            res.status(500).json({ error: 'Une erreur s\'est produite lors de la mise à jour du véhicule' });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.query;
        try {
            const deletedVoiture = await prisma.voiture.delete({ where: { id: Number(id) } });
            res.status(200).json(deletedVoiture);
        } catch (error) {
            res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression du véhicule' });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée" });
    }
}
