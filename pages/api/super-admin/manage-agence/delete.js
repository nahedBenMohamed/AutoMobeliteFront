import prisma from "@/lib/prisma";
import fs from "fs";
import path from 'path';


export default async function handle(req, res) {
    const { method } = req;

    if (method === "DELETE") {
        try {
            // If an ID query parameter exists, delete the car with that ID
            if (req.query?.id) {
                const agenceId = req.query.id;
                const agence = await prisma.agency.findUnique({
                    where: {id: Number(agenceId)},
                    include: {Agency: true}, // Include the Agency
                });

                if (!agence) {
                    return res.status(404).json({message: "Agency not found."});
                }

                if (agence.image) {
                    const imagePath = path.join(process.cwd(), '/public', agence.image);
                    fs.unlinkSync(imagePath);
                }

                // Delete the car and send the deleted car data as a response
                res.json(
                    await prisma.agency.update({
                        where: {id: Number(agenceId)},
                        data: {image: null},
                    })
                );
            }

        } catch (error) {
            res.status(500).json({message: "Error deleting image.", error: error.message});
        }
    }
}
