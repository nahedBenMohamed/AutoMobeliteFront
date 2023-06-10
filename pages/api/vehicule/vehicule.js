import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
    const { marque, modele, annee, kilometrage, prixParJour, images, etat, agenceNom } = req.body;

    const newVoiture = await prisma.voiture.create({
        data: {
            marque,
            modele,
            annee,
            kilometrage,
            prixParJour,
            images,
            etat,
            agence: {
                connect: {
                    nom: agenceNom
                }
            }
        }
    });

    res.json(newVoiture);
}
