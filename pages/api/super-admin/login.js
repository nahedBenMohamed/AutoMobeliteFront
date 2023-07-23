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
    });

    // Verify if the user exists
    if (!agencyUser) {
        return res.status(401).json({ error: 'User not found.' });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, agencyUser.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password.' });
    }

    // Generate a token for the user after verification of the data
    const token = jwt.sign(
        {
            agencyUserId: agencyUser.id,
            role: agencyUser.role,
            name: agencyUser.name,
            firstname: agencyUser.firstname,
        },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }
    );

    // Record the token in a secure cookie
    setCookie({ res }, 'token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 5 * 3600, // Cookie's lifetime in seconds
    });

    // Return the response with the user's role
    return res.status(200).json({ message: 'Successful login', role: agencyUser.role });
}

