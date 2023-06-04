import * as bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";

export async function createUser(name, firstName, email, password, role) {
    try {
            // Vérification si l'utilisateur existe déjà
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new Error('Cet email est déjà utilisé par un autre utilisateur.');
            }

            // Hachage du mot de passe
            const hashedPassword = await bcrypt.hash(password, 12);

            // Création de l'utilisateur dans la base de données
            const newUser = await prisma.user.create({
                data: {
                    name,
                    firstName,
                    email,
                    password: hashedPassword,
                    role,
                },
            });

        return newUser;
    } catch (error) {
        throw new Error('Une erreur est survenue lors de l\'inscription.');
    }
}


