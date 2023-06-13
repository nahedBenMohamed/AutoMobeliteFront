import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import * as cookie from "cookie";

export default async function handle(req, res) {
    const {method} = req;

    // Extraire le token JWT du cookie de la requête
    let decodedToken;
    if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;

        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({error: 'Token non valide.'});
        }
    } else {
        return res.status(401).json({error: 'Aucun cookie trouvé.'});
    }

    // Extraire le nom de l'agence du token
    const agenceName = decodedToken.agenceName;

    // Vérifier que l'utilisateur a le droit de voir les voitures de cette agence
    if (!agenceName) {
        return res.status(403).json({error: 'Vous n\'êtes pas autorisé à voir les voitures de cette agence.'});
    }


        if (method === 'POST') {
            let {
                agenceName: postAgenceName,
                marque,
                annee,
                kilometrage,
                modele,
                prix,
                matricule,
                etat,
                images
            } = req.body
            annee = parseInt(annee);
            kilometrage = parseInt(kilometrage);
            prix = parseFloat(prix);

            // Vérifier que l'utilisateur a le droit de créer une voiture pour cette agence
            if (agenceName !== postAgenceName) {
                return res.status(403).json({error: 'Vous n\'êtes pas autorisé à créer une voiture pour cette agence.'});
            }

            const newVoiture = await prisma.voiture.create({
                data: {
                    marque,
                    modele,
                    annee,
                    kilometrage,
                    prix,
                    etat,
                    matricule,
                    images: {set: images},
                    Agence: {
                        connect: {
                            name: agenceName
                        }
                    }
                },
                include: { Agence: true } // Include Agence object in the response
            });
            res.json(newVoiture);
        }

    if (method === 'GET') {
        if (req.query?.id) {
            const voitureId = req.query.id;
            const voiture = await prisma.voiture.findUnique({
                where: { id: Number(voitureId) },
                include: { Agence: true } // Include Agence object in the response
            });

            if (!voiture || voiture.Agence.name !== agenceName) {
                return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à voir cette voiture.' });
            }
            res.json(voiture);
        } else {
            const voitures = await prisma.voiture.findMany({
                where: { Agence: { name: agenceName } },
                include: { Agence: true } // Include Agence object in the response
            });
            res.json(voitures);
        }
    }



        if (method === "PUT") {
            let {
                agenceName: putAgenceName,
                marque,
                modele,
                annee,
                kilometrage,
                prix,
                etat,
                matricule,
                images,
                id
            } = req.body;
            annee = parseInt(annee);
            kilometrage = parseInt(kilometrage);
            prix = parseFloat(prix);

            const voiture = await prisma.voiture.findUnique({
                where: {id: Number(id)},
                include: { Agence: true } // Include Agence object in the response
            });

            if (voiture.Agence.name !== agenceName || putAgenceName !== agenceName) {
                return res.status(403).json({error: 'Vous n\'êtes pas autorisé à modifier cette voiture.'});
            }

            const updatedCar = await prisma.voiture.update({
                where: {id: Number(id)},
                data: {
                    marque,
                    modele,
                    annee,
                    kilometrage,
                    prix,
                    etat,
                    matricule,
                    images: {set: images},
                },
                include: { Agence: true } // Include Agence object in the response
            });

            res.json(updatedCar);
        }


    if (method === 'DELETE') {
        if (req.query?.id) {
            const voitureId = req.query.id;
            const voiture = await prisma.voiture.findUnique({
                where: {id: Number(voitureId)},
                include: { Agence: true } // Include Agence object in the response
            });

            if (voiture.Agence.name !== agenceName) {
                return res.status(403).json({error: 'Vous n\'êtes pas autorisé à supprimer cette voiture.'});
            }

            res.json(await prisma.voiture.delete({
                where: {id: Number(voitureId)},
                include: { Agence: true } // Include Agence object in the response
            }));
        }
    }
}








