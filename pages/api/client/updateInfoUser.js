import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default async function handle(req, res) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        const {
            name,
            firstname,
            telephone,
            drivingLicense,
            address,
            city,
            image,
        } = req.body;

        const telephoneString = String(telephone);

        try {
            const user = await prisma.client.findUnique({

                where: { id: parseInt(id) },
            });

            if (!user) {
                return res.status(404).json({ error: 'The user does not exist' });
            }

            const phoneNumber = parsePhoneNumberFromString(telephoneString, 'TN');

            if (!phoneNumber || !phoneNumber.isValid()) {
                throw new Error('Please enter a valid Tunisian phone number.');
            }

            const updatedUser = await prisma.client.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    firstname,
                    telephone,
                    numPermis: drivingLicense,
                    address,
                    city,
                    image
                },
            });

            return res.status(200).json({ user: updatedUser });
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({ error: 'An error occurred while updating the user data' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}