// utils/auth.js
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

export const getSession = (ctx) => {
    const { token } = parseCookies(ctx);

    if (!token) {
        return null;
    }

    // décode le token
    const session = jwt.verify(token, process.env.JWT_SECRET);

    return session;
};

export const protectRoute = (ctx, roles) => {
    const session = getSession(ctx);

    // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
    if (!session) {
        return {
            redirect: {
                destination: '/authentification/login',
                permanent: false,
            },
        }
    }

    // Si l'utilisateur n'a pas le bon rôle, redirigez-le vers la page d'accueil
    if (!roles.includes(session.role)) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: { session },
    }
};
