import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setCookie } from 'nookies';

export default async function handle(req, res) {
    const { email, password } = req.body;

    try {
        // Search for the user in the database
        const client = await prisma.client.findUnique({
            where: {
                email: email,
            },
        });

        // Check if the user exists
        if (!client) {
            return res.status(401).json({ error: 'Email or password incorrect.' });
        }

        // Check if the email has been verified
        if (!client.emailVerified) {
            return res.status(401).json({ error: 'Your email has not been verified. Please check your inbox.' });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, client.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Email or password incorrect.' });
        }

        // Generate a token for the user
        const token = jwt.sign(
            {
                clientId: client.id,
                name : client.name,
                firstname : client.firstname,
                address : client.address,
                city : client.city,
                telephone : client.telephone,
                email : client.email,
                numPermis: client.numPermis,

            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set the authentication cookie
        setCookie({ res }, 'token', token, {
            maxAge: 7 * 24 * 3600, // Cookie lifetime in seconds (7 days)
            path: '/', // Cookie path (e.g., '/' for the root domain)
            secure: process.env.NODE_ENV === 'production', // Enable secure mode in production
            sameSite: 'strict', // Same-site constraints for the cookie
        });

        // Return a successful response
        res.status(200).json({ message: 'Authentication successful.' });
    } catch (error) {
        // Handle errors in case login fails
        res.status(500).json({ error: 'An error occurred during login.' });
    }
}
