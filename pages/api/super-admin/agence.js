import prisma from '@/lib/prisma';


export default async function handle(req, res) {
    const { method } = req;

    try {
        if (method === 'POST') {
            // Handle POST method
            const { name, address, email, telephone, responsibleId } = req.body;

            // Vérifier si l'agence existe déjà
            const existingAgence = await prisma.agency.findUnique({
                where: {
                    name: name,
                },
            });

            if (existingAgence) {
                return res.status(400).json({ message: 'Cette agence existe déjà.' });
            }

            // Vérifier si le responsable existe et obtenir son id
            const responsible = await prisma.agencyUser.findUnique({
                where: {
                    id: responsibleId,
                },
            });

            if (!responsible) {
                return res.status(400).json({ message: 'Le responsable n\'existe pas.' });
            }

            // Vérifier si le responsable est déjà relier à une agence
            const existingUserId = await prisma.agency.findUnique({
                where: {
                    responsibleId: responsible.id,
                },
            });

            if (existingUserId) {
                return res.status(400).json({ message: 'Cet agent est déjà responsable d\'une autre agance.' });
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
            return res.status(200).json({ message: 'Agence ajoutée avec succès.', newAgence});

        }

        else if (method === 'GET') {
            // Handle GET method
            const { id } = req.query;

            if (id) {
                // Retrieve an agency by its ID
                const agency = await prisma.agency.findUnique({
                    where: { id: parseInt(id) },
                    include: { AgencyUser: true, Cars: true }, // Include the AgencyUser and Cars objects in the response
                });

                if (!agency) {
                    return res.status(404).json({ message: 'Agency not found.' });
                }

                const totalParkings = await prisma.parking.count({
                    where: { agencyId: agency.id },
                });

                return res.json({ ...agency, totalParkings });
            } else {
                // Retrieve all agencies
                const agencies = await prisma.agency.findMany({
                    include: { AgencyUser: true },
                });

                const agenciesWithCarCount = await Promise.all(
                    agencies.map(async (agency) => {
                        const totalCars = await prisma.car.count({
                            where: { agencyId: agency.id },
                        });
                        const totalParkings = await prisma.parking.count({
                            where: { agencyId: agency.id },
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

        } else if (method === 'PUT') {
            // Handle PUT method
            const { id, name, address, email, telephone, responsibleId } = req.body;

            // Check if the agency exists
            const existingAgency = await prisma.agency.findUnique({
                where: {
                    id: id,
                },
            });

            if (!existingAgency) {
                return res.status(404).json({ message: 'Agency not found.' });
            }

            // Update the agency
            const updatedAgency = await prisma.agency.update({
                where: { id: id },
                data: {
                    name: name,
                    address: address,
                    email: email,
                    telephone: telephone,
                    responsibleId: responsibleId,
                },
                include: { AgencyUser: true }, // Include the AgencyUser object in the response
            });

            return res.json(updatedAgency);

        } else if (method === 'DELETE') {
            // Handle DELETE method
            const { id } = req.body;

            // Check if the agency exists
            const existingAgency = await prisma.agency.findUnique({
                where: {
                    id: id,
                },
            });

            if (!existingAgency) {
                return res.status(404).json({ message: 'Agency not found.' });
            }

            // Delete the agency
            const deletedAgency = await prisma.agency.delete({
                where: { id: id },
                include: { AgencyUser: true }, // Include the AgencyUser object in the response
            });

            return res.json(deletedAgency);

        } else {
            return res.status(405).json({ message: 'Method not allowed.' });
        }

    } catch (error) {
        // Handle errors that occur during database interactions
        res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
}
