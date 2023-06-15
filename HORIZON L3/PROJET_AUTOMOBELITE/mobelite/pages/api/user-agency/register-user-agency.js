import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { nom, email, motDePasse, role } = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.userAgency.findUnique({
        where: {
            email: email,
        },
    });

    if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Créer le nouvel utilisateur
    const newUser = await prisma.userAgency.create({
        data: {
            nom: nom,
            email: email,
            motDePasse: hashedPassword,
            role: role,
        },
    });

    // Envoyer une réponse de succès
    return res.status(200).json({ message: 'Utilisateur enregistré avec succès.' });
}
