import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';

export default async function handle(req, res) {
    // Get the token from the cookie
    const { token } = parseCookies({ req });

    let payload;
    try {
        // Verify the token
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    // Use the id to make the API call
    const userAgency = await prisma.agencyUser.findUnique({
        where: {
            id: payload.agencyUserId,
        },
    });

    // If the user doesn't exist
    if (!userAgency) {
        return res.status(404).json({ error: "L'utilisateur n'existe pas" });
    }

    // Return the user data
    return res.status(200).json({ userAgency });
}
