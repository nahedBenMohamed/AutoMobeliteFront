import prisma from "@/lib/prisma";
import fs from "fs";
import path from 'path';


export default async function handle(req, res) {
    const { method } = req;

    if (method === "DELETE") {
        try {
            // If an ID query parameter exists, delete the car with that ID
            if (req.query?.id) {
                const parkingId = req.query.id;
                const parking = await prisma.parking.findUnique({
                    where: {id: Number(parkingId)},
                    include: {Agency: true}, // Include the Agency
                });

                if (!parking) {
                    return res.status(404).json({message: "Agency not found."});
                }

                if (parking.image) {
                    const imagePath = path.join(process.cwd(), '/public', parking.image);
                    fs.unlinkSync(imagePath);
                }

                // Delete the car and send the deleted car data as a response
                res.json(
                    await prisma.parking.update({
                        where: {id: Number(parkingId)},
                        data: {image: null},
                    })
                );
            }

        } catch (error) {
            res.status(500).json({message: "Error deleting image.", error: error.message});
        }
    }
}
