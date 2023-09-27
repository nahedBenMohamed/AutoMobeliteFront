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
          const imagePath = path.join(process.cwd(), "/public", agency.image);
          fs.unlinkSync(imagePath);
        }

        if (agency.image) {
          const imagePath = path.join(
            process.cwd(),
            "public",
            "agences",
            agency.image
          );
          fs.existsSync(imagePath);
        }
        // Delete the car and send the deleted car data as a response
        return res.json(
          await prisma.agency.update({
            where: { id: Number(agencyId) },
            data: { image: null },
          })
        );
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error: `An error occurred while deleting the image for agency with id: ${req.query?.id}.`,
        });
    }
  }
}
