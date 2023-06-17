import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {setCookie} from "nookies";

export default async function handle(req, res) {
    const { email, password } = req.body;

    // Rechercher l'utilisateur dans la base de données
    const agencyUser = await prisma.agencyUser.findUnique({
        where: {
            email: email,
        },
        include: {
            Agency: true,  // inclure les Agences liées à l'utilisateur
        },
    });

    // Vérifier si l'utilisateur existe
    if (!agencyUser) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, agencyUser.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }
    // Si l'utilisateur n'est associé à aucune Agence, on renvoie une erreur
    if (!agencyUser.Agency) {
        return res.status(400).json({ error: "vous n'avez pas acces au dashboard" });
    }

    // Générer un token pour l'utilisateur
    const token = jwt.sign({
        agencyUserId: agencyUser.id,
        name: agencyUser.name,
        firstname: agencyUser.firstname,
        role:agencyUser.role,
        agency: agencyUser.Agency.name
    }, process.env.JWT_SECRET, { expiresIn: '3h' });

    // Enregistrement du jeton dans un cookie sécurisé
    setCookie({ res }, 'token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 3*3600, // Durée de vie du cookie en secondes
    });


    // Retourner la réponse avec le rôle de l'utilisateur
    return res.status(200).json({  message: 'Connexion réussie', role: agencyUser.role });
}
