import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const {method} = req;
    if (method === 'POST') {
        let { agenceName, marque, annee, kilometrage, modele, prix, matricule,etat,images } = req.body
        annee = parseInt(annee);
        kilometrage = parseInt(kilometrage);
        prix = parseFloat(prix);

        const newVoiture = await prisma.voiture.create({
            data: {
                marque,
                modele,
                annee,
                kilometrage,
                prix,
                etat,
                matricule,
                images: { set: images },
                Agence: {
                    connect: {
                        name: agenceName
                    }
                }
            }
        });
        res.json(newVoiture);
    }

    if (method === 'GET') {
        if (req.query?.id) {
            const voitureId = req.query.id; // Récupérer l'ID de la requête
            res.json(await prisma.voiture.findUnique({ where: { id: Number(voitureId) } }));
        } else {
            res.json(await prisma.voiture.findMany());
        }
    }

    if (req.method === "PUT") {
        let { agenceName, marque, modele, annee, kilometrage, prix, etat,matricule,images, id } = req.body;
        annee = parseInt(annee);
        kilometrage = parseInt(kilometrage);
        prix = parseFloat(prix);
        
        // Effectuer la mise à jour de la voiture en utilisant l'ID
        const updatedCar = await prisma.voiture.update({
            where: { id: Number(id) },
            data: {
                agenceName,
                marque,
                modele,
                annee,
                kilometrage,
                prix,
                etat,
                matricule,
                images: { set: images },
            },
        });

        res.json(updatedCar);
    }


    if(method === 'DELETE'){
        if(req.query?.id){
            const voitureId = req.query.id;
            res.json(await prisma.voiture.delete({ where: { id: Number(voitureId) } }));
        }
    }

}
