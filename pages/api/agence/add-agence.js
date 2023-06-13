import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { name, adresse, email, telephone, responsableId } = req.body;

    // Vérifier si l'agence existe déjà
    const existingAgence = await prisma.agence.findUnique({
        where: {
            name: name,
        },
    });

    if (existingAgence) {
        return res.status(400).json({ message: 'Cette agence existe déjà.' });
    }

    // Vérifier si le id est déjà relier a une agence
    const existingUserId = await prisma.agence.findUnique({
        where: {
            responsableId: responsableId,
        },
    });

    if (existingUserId) {
        return res.status(400).json({ message: 'Cet agent est déjà responsable d\'une autre agance.' });
    }

    // Vérifier si le responsable existe
    const responsableExists = await prisma.userAgency.findUnique({
        where: {
            id: responsableId,
        },
    });

    if (!responsableExists) {
        return res.status(400).json({ message: 'Aucun utilisateur correspondant à cet ID responsable.' });
    }

    // Créer la nouvelle agence avec la référence au responsable
    const newAgence = await prisma.agence.create({
        data: {
            name: name,
            adresse: adresse,
            email: email,
            telephone: telephone,
            responsableId: responsableId,
        },
    });

    // Envoyer une réponse de succès
    return res.status(200).json({ message: 'Agence ajoutée avec succès.', newAgence});
}
