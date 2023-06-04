import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { setCookie } from 'nookies';

require('dotenv').config();

export async function authenticateUser(req, res) {
    const { email, password } = req.body;

    // Vérification des données requises
    if (!email || !password) {
        return res.status(400).json({ message: 'Veuillez fournir tous les champs requis.' });
    }

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: 'Email ou mot de passe invalide.' });
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
        }

        // Génération du jeton d'accès (JWT)
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: 60 } // Représente 3 minutes
        );
        // Enregistrement du jeton dans un cookie sécurisé
        setCookie({ res }, 'token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 180, // Durée de vie du cookie en secondes (3 minutes)
        });

        return res.status(200).json({ token, message: 'Connexion réussie', role: user.role });

    } catch (error) {
        console.error(error);

        // Traitez les erreurs spécifiques
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
        }

        // Erreur interne du serveur
        return res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
    }
}

export async function validateToken(req, res, redirectAdminDashboard, redirectToHomeConnected) {
    // Vérification de la présence du jeton d'accès dans les cookies
    const token = req.cookies.token;

    try {
        // Vérification et validation du jeton JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérification de l'expiration du jeton
        if (Date.now() >= decoded.exp * 1000) {
            // Le jeton a expiré, supprimez le cookie et effectuez la déconnexion
            setCookie({ res }, 'token', '', {
                httpOnly: true,
                path: '/',
                maxAge: 0, // Supprimez le cookie en définissant la durée de vie à 0
            });

            console.log("date ", Date.now, "decoded", (decoded.exp * 1000));

            // Affichage du modal d'alerte avec les boutons "Login" et "Sign Up"
            return res.status(200).json({ modal: true, message: 'Votre session a expiré. Veuillez vous reconnecter.' });
        }

        // L'extraction des informations pertinentes à partir du jeton (par exemple, l'identifiant de l'utilisateur)
        const userId = decoded.userId;

        // Redirection vers la page d'accueil de l'administration pour l'utilisateur authentifié
        if (user.role === 'admin') {
            return redirectAdminDashboard(res);
        } else if (user.role === 'client') {
            return redirectToHomeConnected(res);
        }

        res.end();
    } catch (error) {
        // L'utilisateur n'est pas authentifié, reste sur la page de connexion
        // Vous pouvez rendre le template de la page de connexion ici
        return res.status(401).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
    }
}

export function redirectToAdminDashboard(res) {
    res.writeHead(302, {
        Location: '/admin/dashboard/home', // Remplacez par l'URL de votre page d'accueil de l'administration
    });
    res.end();
}

export function redirectToHomeConnected(res) {
    res.writeHead(302, {
        Location: '/HomeConnected', // Remplacez par l'URL de votre page d'accueil de l'administration
    });
    res.end();
}
