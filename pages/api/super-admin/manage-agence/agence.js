import prisma from '@/lib/prisma';


export default async function handle(req, res) {
    const { method } = req;

    try {
        if (method === 'POST') {
            // Handle POST method
            const {name, address, email, telephone,responsibleEmail} = req.body;


            // Vérifier si l'agence existe déjà
            const existingAgence = await prisma.agency.findUnique({
                where: {
                    name: name,
                },
            });

            if (existingAgence) {
                return res.status(400).json({message: 'This agency already exists'});
            }

            // Check if an agency with the same email already exists
            const existingAgencyEmail = await prisma.agency.findUnique({
                where: {
                    email: email,
                },
            });

            if (existingAgencyEmail) {
                return res.status(400).json({message: 'An agency with this email already exists'});
            }

            // Vérifier si le responsable existe et obtenir son id
            const responsible = await prisma.agencyUser.findUnique({
                where: {
                    email: responsibleEmail,
                },
            });

            if (!responsible) {
                return res.status(400).json({message: 'Manager does not exist'});
            }

            // Vérifier si le responsable est déjà relié à une agence
            const existingUserId = await prisma.agency.findUnique({
                where: {
                    responsibleId: responsible.id,
                },
            });

            if (existingUserId) {
                return res.status(400).json({message: 'This agent is already responsible for another Agency'});
            }

            // Créer la nouvelle agence avec la référence au responsable
            const newAgence = await prisma.agency.create({
                data: {
                    name: name,
                    address: address,
                    email: email,
                    telephone: telephone,
                    responsibleId: responsible.id,
                },
            });

            // Envoyer une réponse de succès
            return res.status(200).json({message: 'Agency added successfully', newAgence});
        } else if (method === 'GET') {
            // Handle GET method
            const {id} = req.query;

            if (id) {
                // Retrieve an agency by its ID
                const agency = await prisma.agency.findUnique({
                    where: {id: parseInt(id)},
                    include: {AgencyUser: true, Cars: true}, // Include the AgencyUser and Cars objects in the response
                });

                if (!agency) {
                    return res.status(404).json({message: 'Agency not found.'});
                }

                const totalParkings = await prisma.parking.count({
                    where: {agencyId: agency.id},
                });

                const totalCars = await prisma.car.count({
                    where: { agencyId: agency.id },
                });

                return res.json({...agency, totalCars, totalParkings});
            } else {
                // Retrieve all agencies
                const agencies = await prisma.agency.findMany({
                    include: {AgencyUser: true},
                });

                const agenciesWithCarCount = await Promise.all(
                    agencies.map(async (agency) => {
                        const totalCars = await prisma.car.count({
                            where: {agencyId: agency.id},
                        });
                        const totalParkings = await prisma.parking.count({
                            where: {agencyId: agency.id},
                        });
                        return {
                            ...agency,
                            totalCars,
                            totalParkings,
                        };
                    })
                );

                return res.json(agenciesWithCarCount);

            }

        }  else if (method === 'PUT') {
            // Handle PUT method
            const {id, name, address, email, telephone, image,responsibleEmail} = req.body;

            // Check if the agency exists
            const existingAgency = await prisma.agency.findUnique({
                where: {id: parseInt(id)},
            });

            if (!existingAgency) {
                return res.status(404).json({message: 'Agency not found.'});
            }

            // Check if the responsible email exists and is not already associated with another agency
            const responsibleUser = await prisma.agencyUser.findUnique({
                where: {
                    email: responsibleEmail,
                },
            });

            if (!responsibleUser) {
                return res.status(404).json({message: 'Responsible email not found.'});
            }

            const associatedAgency = await prisma.agency.findFirst({
                where: {
                    responsibleId: responsibleUser.id,
                    NOT: {
                        id: id,
                    },
                },
            });

            if (associatedAgency) {
                return res.status(400).json({message: 'Responsible is already associated with another agency.'});
            }

            // Update the agency
            const updatedAgency = await prisma.agency.update({
                where: {id: id},
                data: {
                    name: name,
                    address: address,
                    email: email,
                    telephone: telephone,
                    image,
                    AgencyUser: {
                        connect: {
                            id: responsibleUser.id,
                        },
                    },
                },
                include: {AgencyUser: true},
            });

            return res.json(updatedAgency);

        } else if (method === 'DELETE') {
            // Handle DELETE method
            if (req.query?.id) {

                const agencyId = req.query.id;

                // Check if the agency exists
                const agence = await prisma.agency.findUnique({
                    where: {id: Number(agencyId)},
                });

                if (!agence) {
                    return res.status(404).json({message: 'Agency not found.'});
                }

                // Supprimer les enregistrements de la table `Parking` qui référencent l'agence à supprimer
                await prisma.parking.deleteMany({
                    where: {
                        agencyId: Number(agencyId),
                    },
                });

                // Supprimer les enregistrements de la table `Car` qui référencent l'agence à supprimer
                await prisma.car.deleteMany({
                    where: {
                        agencyId: Number(agencyId),
                    },
                });

                // Supprimer l'agence et ses données associées
                const deletedAgency = await prisma.agency.delete({
                    where: { id: Number(agencyId) },
                    include: {
                        AgencyUser: true, // Inclure l'objet AgencyUser
                    },
                });
                return res.json(deletedAgency);

            } else {
                return res.status(405).json({message: 'Method not allowed.'});
            }
        }
    }
     catch (error) {
        // Handle errors that occur during database interactions
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
}
