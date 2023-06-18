import * as bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export default async function handle(req, res) {
    const { name, firstname, email, password, role } = req.body;

    // Check if the email is already in use
    const existingUser = await prisma.agencyUser.findUnique({
        where: {
            email: email,
        },
    });

    if (existingUser) {
        // Return an error response if the email is already in use
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const newUser = await prisma.agencyUser.create({
        data: {
            name: name,
            firstname: firstname,
            email: email,
            password: hashedPassword,
            role: role,
        },
    });

    // Send a success response
    return res.status(200).json({ message: 'Utilisateur enregistré avec succès.', newUser });
}
