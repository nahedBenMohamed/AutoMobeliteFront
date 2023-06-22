import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import bcrypt from 'bcryptjs';

export default async function handle(req, res) {
    if (req.method !== 'PUT') {
        // Return an error response if the request method is not PUT
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the token from the cookie
    const { token } = parseCookies({ req });

    let payload;
    try {
        // Verify the token
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    const { name, firstname, email, oldPassword, newPassword } = req.body;

    try {
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

        // Check if the old password matches the current password
        if (oldPassword && !(await bcrypt.compare(oldPassword, userAgency.password))) {
            return res.status(400).json({ error: 'Ancien mot de passe incorrect' });
        }

        // Update the user's information
        const updatedUserAgency = await prisma.agencyUser.update({
            where: {
                id: payload.agencyUserId,
            },
            data: {
                name,
                firstname,
                email,
                password: newPassword ? await bcrypt.hash(newPassword, 12) : undefined,
            },
        });

        // Return the updated user data
        return res.status(200).json({ userAgency: updatedUserAgency });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la base de données' });
    }
}
