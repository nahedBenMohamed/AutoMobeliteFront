import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {setCookie} from "nookies";

export default async function handle(req, res) {
    const { email, password } = req.body;

    // Search for the user in the database
    const agencyUser = await prisma.agencyUser.findUnique({
        where: {
            email: email,
        },
        include: {
            Agency: true,  // include Agencies linked to the user
        },
    });

    // Verify if the user exists
    if (!agencyUser) {
        return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    // Verify if the user status is active
    if (agencyUser.status !== 'activate') {
        return res.status(403).json({ error: 'Your account is deactivated. Please contact the admin.' });
    }

// Verify if the agency is active
    if (agencyUser.Agency.status !== 'activate') {
        return res.status(403).json({ error: 'The agency is deactivated. Please contact the admin.' });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, agencyUser.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    // If the user is not associated with any Agency, return an error
    if (!agencyUser.Agency) {
        return res.status(400).json({ error: "You do not have access to the dashboard" });
    }

// Generate a token for the user
    const token = jwt.sign(
        {
            agencyUserId: agencyUser.id,
            name: agencyUser.name,
            firstname: agencyUser.firstname,
            role: agencyUser.role,
            agency: agencyUser.Agency.name,
            agencyId:agencyUser.Agency.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

// Store the token in a secure cookie
    setCookie({ res }, 'token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 3600, // Cookie lifetime in seconds (7 days)
    });

    // Return the response with the user's role
    return res.status(200).json({  message: 'Successful login', role: agencyUser.role,  agencyId:agencyUser.Agency.id });

}
