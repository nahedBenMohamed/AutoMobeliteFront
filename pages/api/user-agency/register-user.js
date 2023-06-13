import * as bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { name,firstname, email, password, role } = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.userAgency.findUnique({
        where: {
            email: email,
        },
    });

    if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer le nouvel utilisateur
    const newUser = await prisma.userAgency.create({
        data: {
            name: name,
            firstname: firstname,
            email: email,
            password: hashedPassword,
            role: role,
        },
    });

    // Envoyer une réponse de succès
    return res.status(200).json({ message: 'Utilisateur enregistré avec succès.',newUser });
}
