import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { method } = req;

    try {
        if (method === 'POST') {
            if (method === 'POST') {
                const { name, city, address, agencyName } = req.body;

                // Vérifier si le parking existe déjà
                const existingParking = await prisma.parking.findUnique({
                    where: {
                        name: name,
                    },
                });
                if (existingParking) {
                    return res.status(400).json({ message: 'Ce parking existe déjà.' });
                }

                // Rechercher l'agence par son nom
                const agency = await prisma.agency.findUnique({
                    where: {
                        name: agencyName,
                    },
                });

                if (!agency) {
                    return res.status(400).json({ message: 'Aucune agence correspondant à ce nom.' });
                }

                // Créer le nouveau parking avec l'ID de l'agence
                const newParking = await prisma.parking.create({
                    data: {
                        name: name,
                        city: city,
                        address: address,
                        agencyId: agency.id,
                    },
                });

                // Envoyer une réponse de succès
                return res.status(200).json({ message: 'Parking ajouté avec succès.', parking: newParking });
            }

        } else if (method === 'GET') {
            const { id } = req.query;

            if (id) {
                // Récupérer un parking par son ID
                const parking = await prisma.parking.findUnique({
                    where: { id: parseInt(id) },
                    include: { Agency: true },
                });

                if (!parking) {
                    return res.status(404).json({ message: 'Parking non trouvé.' });
                }

                return res.json(parking);
            } else {
                // Récupérer tous les parkings
                const parkings = await prisma.parking.findMany({
                    include: { Agency: true },
                });

                return res.json(parkings);
            }

        } else if (method === 'PUT') {
            const { id, name, city, address } = req.body;

            // Vérifier si le parking existe
            const existingParking = await prisma.parking.findUnique({
                where: { id: parseInt(id) },
            });

            if (!existingParking) {
                return res.status(404).json({ message: 'Parking non trouvé.' });
            }

            // Mettre à jour le parking
            const updatedParking = await prisma.parking.update({
                where: { id: parseInt(id) },
                data: { name, city, address },
                include: { Agency: true },
            });

            return res.json(updatedParking);

        }  else if (method === 'DELETE') {

                if (req.query?.id) {
                    const parkingId = req.query.id;
                    const parking = await prisma.parking.findUnique({
                        where: {id: Number(parkingId)},
                        include: { Agency: true }
                    });

                    res.json(await prisma.parking.delete({
                        where: {id: Number(parkingId)},
                        include: { Agency: true } // Include Agency object in the response
                    }));
                    return res.json(parking)
                }
        } else {
            return res.status(405).json({ message: 'Méthode non autorisée.' });
        }


    } catch (error) {
        res.status(500).json({ message: 'Une erreur est survenue.', error: error.message });
    }
}
