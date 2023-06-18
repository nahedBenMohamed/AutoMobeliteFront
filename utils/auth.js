// utils/auth.js
import {parseCookies} from 'nookies';
import jwt from 'jsonwebtoken';

export const getSession = (ctx) => {
    const { token } = parseCookies(ctx);

    if (!token) {
        return null;
    }

    // decode the token
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const protectRoute = async (ctx, allowedRoles) => {
    const session = await getSession(ctx);
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    if (!allowedRoles.includes(session.role)) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {session}
    }
};
