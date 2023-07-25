import prisma from '@/lib/prisma';


export default async function handle(req, res) {
    const { id } = req.query;
    if (req.method === 'PUT') {

        const {
            newEmail,
        } = req.body;

        try {
            const user = await prisma.client.findUnique({
                where: { id: parseInt(id) },
            });

            if (!user) {
                return res.status(404).json({ error: 'The user does not exist' });
            }

            const updatedUser = await prisma.client.update({
                where: { id: parseInt(id) },
                data: {
                    email: newEmail !== undefined ? newEmail : user.email,
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