import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handle(req, res) {
    const { method } = req;

    if (method === "DELETE") {
        try {
            if (req.query?.id) {
                const agencyUserId = req.query.id;
                const agencyUser = await prisma.agencyUser.findUnique({
                    where: { id: Number(agencyUserId) },
                });

                if (!agencyUser) {
                    return res.status(404).json({ message: "Admin not found." });
                }

                if (agencyUser.image) {
                    const imagePath = path.join(process.cwd(), "public", "admin", agencyUser.image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        await prisma.agencyUser.update({
                            where: { id: Number(agencyUserId) },
                            data: { image: null },
                        });
                    } else {
                        return res.status(404).json({ message: `Image not found at path: ${imagePath}` });
                    }
                }

                return res.status(200).json({ message: "Image deleted successfully." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `An error occurred while deleting the image for agency with id: ${req.query?.id}.` });
        }
    }
}
