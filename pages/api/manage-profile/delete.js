import prisma from "@/lib/prisma";
import fs from "fs";
import path from 'path';


export default async function handle(req, res) {
    const { method } = req;

    if (method === "DELETE") {
        try {
            // If an ID query parameter exists, delete the car with that ID
            if (req.query?.id) {
                const agencyUserId = req.query.id;
                const user = await prisma.agencyUser.findUnique({
                    where: {id: Number(agencyUserId)},
                    include: {Agency: true}, // Include the Agency
                });

                if (!user) {
                    return res.status(404).json({message: "User not found."});
                }

                if (user.image) {
                    const imagePath = path.join(process.cwd(), '/public', user.image);
                    fs.unlinkSync(imagePath);
                }

                // Delete the car and send the deleted car data as a response
                res.json(
                    await prisma.agencyUser.update({
                        where: {id: Number(agencyUserId)},
                        data: {image: null},
                    })
                );
            }

        } catch (error) {
            res.status(500).json({message: "Error deleting image.", error: error.message});
        }
    }
}
