import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const {method} = req;

    if (method === 'GET') {
        const voitures = await prisma.voiture.findMany();
        res.json(voitures);
        }


}








