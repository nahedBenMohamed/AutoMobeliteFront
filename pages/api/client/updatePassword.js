import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';


export default async function handle(req, res) {
    const { id } = req.query;
    if (req.method === 'PUT') {

        const {
            oldPassword,
            newPassword,
        } = req.body;

        try {
            const user = await prisma.client.findUnique({
                where: { id: parseInt(id) },
            });

            if (!user) {
                return res.status(404).json({ error: 'The user does not exist' });
            }

            if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
                return res.status(400).json({ error: 'Incorrect old password' });
            }

            const updatedUser = await prisma.client.update({
                where: { id: parseInt(id) },
                data: {
                    password: newPassword !== undefined
                        ? await bcrypt.hash(newPassword, 12)
                        : user.password,
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