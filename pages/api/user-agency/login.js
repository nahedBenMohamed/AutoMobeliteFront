import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handle(req, res) {
    const { email, password } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const userAgency = await prisma.userAgency.findUnique({
        where: {
            email: email,
        },
    });

    // Vérifier si l'utilisateur existe
    if (!userAgency) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, userAgency.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Générer un token pour l'utilisateur
    const token = jwt.sign(
        { userAgencyId: userAgency.id, role: userAgency.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Définir le cookie d'authentification
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);

    // Retourner la réponse avec le rôle de l'utilisateur
    return res.status(200).json({ role: userAgency.role });
}
