import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';

export default async function handle(req, res) {
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur dans la base de données
        const client = await prisma.client.findUnique({
            where: {
                email: email,
            },
        });

        // Vérifier si l'utilisateur existe
        if (!client) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // Vérifier le mot de passe
        const motDePasseMatch = await bcrypt.compare(password, client.password);
        if (!motDePasseMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // Générer un token pour l'utilisateur
        const token = jwt.sign(
            { clientId: client.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Définir le cookie d'authentification

        setCookie({ res }, 'authToken', token, {
            maxAge: 60 * 60 * 24, // Durée de validité du cookie en secondes (ex: 24 heures)
            path: '/', // Chemin du cookie (ex: '/' pour le domaine principal)
            secure: process.env.NODE_ENV === 'production', // Activer le mode sécurisé en production
            sameSite: 'strict', // Contraintes de même site pour le cookie
        });

        // Retourner une réponse réussie
        res.status(200).json({ message: 'Authentification réussie.' });
    } catch (error) {
        // Gérer les erreurs en cas d'échec du login
        res.status(500).json({ error: 'Une erreur s\'est produite lors du login.' });
    }
}
