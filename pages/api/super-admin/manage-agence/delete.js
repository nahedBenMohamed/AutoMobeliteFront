import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handle(req, res) {
    const { method } = req;

    if (method === "DELETE") {
        try {
            if (req.query?.id) {
                const agencyId = req.query.id;
                const agency = await prisma.agency.findUnique({
                    where: { id: Number(agencyId) },
                });

                if (!agency) {
                    return res.status(404).json({ message: "Agency not found." });
                }

                if (agency.image) {
                    const imagePath = path.join(process.cwd(), "public", "agences", agency.image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        await prisma.agency.update({
                            where: { id: Number(agencyId) },
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
