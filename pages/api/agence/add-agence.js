import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { name, adresse, email, telephone, responsableName } = req.body;

    // Vérifier si l'agence existe déjà
    const existingAgence = await prisma.agence.findUnique({
        where: {
            name: name,
        },
    });

    if (existingAgence) {
        return res.status(400).json({ error: 'Cette agence existe déjà.' });
    }

    // Créer la nouvelle agence avec la référence au responsable
        const newAgence = await prisma.agence.create({
            data: {
                name: name,
                adresse: adresse,
                email: email,
                telephone: telephone,
                responsableName: responsableName,
            },
        });

    // Envoyer une réponse de succès
    return res.status(200).json({ message: 'Agence ajoutée avec succès.' });
}
