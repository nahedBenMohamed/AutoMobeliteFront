import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies';
import bcrypt from 'bcryptjs';
import {parsePhoneNumberFromString} from "libphonenumber-js";

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

    if (req.method === 'GET') {
        // Use the id to make the API call
        try {
            const user = await prisma.client.findUnique({
                where: {
                    id: payload.clientId,
                },
            });

            // If the user doesn't exist
            if (!user) {
                return res.status(404).json({ error: "The user does not exist" });
            }

            // Return the user data
            return res.status(200).json({ user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données de l\'utilisateur' });
        }
    } else if (req.method === 'PUT') {
        const { name, firstname, email, telephone, drivingLicense, address, city, image, oldPassword, newPassword } = req.body;
        const telephoneString = String(telephone);
        try {
            // Use the id to make the API call
            const userPut = await prisma.client.findUnique({
                where: {
                    id: payload.clientId,
                },
            });

            // If the user doesn't exist
            if (!userPut) {
                return res.status(404).json({ error: "The user does not exist" });
            }

            const phoneNumber = parsePhoneNumberFromString(telephoneString, 'TN');
            if (!phoneNumber || !phoneNumber.isValid()) {
                throw new Error('Please enter a valid Tunisian phone number.');
            }

            // Check if the old password matches the current password
            if (oldPassword && !(await bcrypt.compare(oldPassword, userPut.password))) {
                return res.status(400).json({ error: 'Old incorrect password' });
            }

            // Update the user's information
            const updatedUser = await prisma.client.update({
                where: {
                    id: payload.clientId,
                },
                data: {
                    name,
                    firstname,
                    email,
                    telephone,
                    numPermis : drivingLicense,
                    address,
                    city,
                    image,
                    password: newPassword ? await bcrypt.hash(newPassword, 12) : undefined,
                },
            });

            // Return the updated user data
            return res.status(200).json({ user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while updating the database' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
