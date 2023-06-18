import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { name, adresse, email, telephone, responsableId } = req.body;

    // Vérifier si l'agence existe déjà
    console.log({ name, adresse, email, telephone, responsableId });
    const existingAgence = await prisma.agency.findUnique({
        where: {
            name: name,
        },
    });

    if (existingAgence) {
        return res.status(400).json({ message: 'Cette agence existe déjà.' });
    }

    // Vérifier si le id est déjà relier a une agence
    const existingUserId = await prisma.agency.findUnique({
        where: {
            responsibleId: responsableId,
        },
    });

    if (existingUserId) {
        return res.status(400).json({ message: 'Cet agent est déjà responsable d\'une autre agance.' });
    }

    // Vérifier si le responsable existe
    const responsableExists = await prisma.agencyUser.findUnique({
        where: {
            id: responsableId,
        },
    });

    if (!responsableExists) {
        return res.status(400).json({ message: 'Aucun utilisateur correspondant à cet ID responsable.' });
    }

    // Créer la nouvelle agence avec la référence au responsable
    const newAgence = await prisma.agency.create({
        data: {
            name: name,
            address: adresse,
            email: email,
            telephone: telephone,
            responsibleId: responsableId,
        },
    });

    // Envoyer une réponse de succès
    return res.status(200).json({ message: 'Agence ajoutée avec succès.', newAgence});
}
