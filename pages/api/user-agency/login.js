import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {setCookie} from "nookies";
import cookie from "cookie";

export default async function handle(req, res) {
    const { email, password } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const userAgency = await prisma.userAgency.findUnique({
        where: {
            email: email,
        },
        include: {
            Agence: true,  // inclure les Agences liées à l'utilisateur
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
        {
            userAgencyId: userAgency.id,
            role: userAgency.role,
            name: userAgency.name,
            agenceName: userAgency.Agence[0].name
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Enregistrement du jeton dans un cookie sécurisé
    setCookie({ res }, 'token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 3600, // Durée de vie du cookie en secondes
    });

/*    // Récupérer le nom de l'agence
    const agenceName = userAgency.Agence[0].name;

    // Enregistrer le nom de l'agence dans un cookie
    res.setHeader('Set-Cookie', cookie.serialize('agenceName', agenceName, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 semaine
        sameSite: 'strict',
        path: '/',
    }));*/

    // Retourner la réponse avec le rôle de l'utilisateur
    return res.status(200).json({  message: 'Connexion réussie', role: userAgency.role });
}
