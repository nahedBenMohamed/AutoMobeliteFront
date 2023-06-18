import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const { method } = req;

    if (method === 'GET') {
        if (req.query?.id) {
            const userId = req.query.id;
            res.json(await prisma.client.findUnique({ where: { id: Number(userId) } }));
        } else {
            res.json(await prisma.client.findMany());
        }
    }
/*
    if (method === 'PUT') {
        const { id, name, firstname, email, password } = req.body;

        const updatedUser = await prisma.client.update({
            where: { id: Number(id) },
            data: {
                name,
                firstname,
                email,
                password,
            },
        });

        res.json(updatedUser);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            const userId = req.query.id;
            res.json(await prisma.client.delete({ where: { id: Number(userId) } }));
        }
    }*/
}
