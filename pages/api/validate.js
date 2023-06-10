import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { token } = req.query;

    // Vérifier et décoder le token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { clientId } = decodedToken;

        // Vérifier si le token a déjà été utilisé pour valider un compte
        const client = await prisma.client.findUnique({
            where: {
                id: clientId,
            },
        });

        if (!client) {
            return res.status(400).json({ error: 'Token invalide.' });
        }

        if (client.emailVerified) {
            return res.status(400).json({ error: 'Le compte a déjà été validé.' });
        }

        // Mettre à jour le statut de validation du compte dans la base de données
        await prisma.client.update({
            where: {
                id: clientId,
            },
            data: {
                emailVerified: true,
            },
        });

        // Envoyer une réponse de succès
        return res.status(200).json({ message: 'Compte validé avec succès.' });
    } catch (error) {
        // Gérer les erreurs de validation du token
        return res.status(400).json({ error: 'Token invalide ou expiré.' });
    }
}
