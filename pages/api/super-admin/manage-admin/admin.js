import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

export default async function handle(req, res) {
    const { method } = req;

    try {
        if (method === "POST") {
            // Handle POST method
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

        if (method === "GET") {
            const { id } = req.query;

            if (id) {
                const admin = await prisma.agencyUser.findUnique({
                    where: { id: parseInt(id) },
                    include: { Agency: true },
                });

                if (!admin) {
                    return res.status(404).json({ message: "Admin not found." });
                }
                return res.json(admin);

            } else {
                const agencyUsers = await prisma.agencyUser.findMany({
                    where: { role: { not: "superAdmin" } },
                    include: { Agency: true },
                });
                return res.json(agencyUsers);
            }
        }

        if (method === 'PUT') {
            const { id, name, firstname, email, image, agencyName } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'Admin ID is required.' });
            }

            const admin = await prisma.agencyUser.findUnique({
                where: { id: parseInt(id) },
                include: { Agency: true },
            });

            if (!admin) {
                return res.status(404).json({ message: 'Admin not found.' });
            }

            let agency = null;

            if (agencyName) {
                agency = await prisma.agency.findUnique({
                    where: { name: agencyName },
                });

                if (agency && agency.responsibleId && agency.responsibleId !== admin.id) {
                    return res.status(400).json({ message: 'The specified agency already has a responsible.' });
                }
            }
            const updatedAdmin = await prisma.agencyUser.update({
                where: { id: parseInt(id) },
                data: {
                    name: name || admin.name,
                    firstname: firstname || admin.firstname,
                    email: email || admin.email,
                    image,
                    Agency: agency
                        ? { connect: { name: agencyName } }
                        : admin.Agency
                            ? { disconnect: true }
                            : undefined,
                },
                include: { Agency: true },
            });

            res.json(updatedAdmin);
        }

        if (method === 'DELETE') {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ message: 'Missing ID parameter.' });
            }

            const admin = await prisma.agencyUser.findUnique({
                where: { id: parseInt(id) },
                include: { Agency: true },
            });

            if (!admin) {
                return res.status(404).json({ message: 'Admin not found.' });
            }

            // Vérifier si l'administrateur est responsable d'une agence
            const agency = await prisma.agency.findUnique({
                where: { responsibleId: parseInt(id) },
            });

            if (agency) {
                return res.status(400).json({ message: 'Cannot delete admin. Admin is responsible for an agency.' });
            }

            // Supprimer l'administrateur
            await prisma.agencyUser.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).json({ message: 'Admin deleted successfully.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
}
