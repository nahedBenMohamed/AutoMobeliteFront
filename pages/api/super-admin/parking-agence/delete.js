import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "DELETE") {
    try {
      if (req.query?.id) {
        const parkingId = req.query.id;
        const parking = await prisma.parking.findUnique({
          where: { id: Number(parkingId) },
        });

        if (!parking) {
          return res.status(404).json({ message: "Admin not found." });
        }

        if (parking.image) {
          const imagePath = path.join(
            process.cwd(),
            "public",
            "parking",
            parking.image
          );
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            await prisma.parking.update({
              where: { id: Number(parkingId) },
              data: { image: null },
            });
          } else {
            return res
              .status(404)
              .json({ message: `Image not found at path: ${imagePath}` });
          }
        }

        return res.status(200).json({ message: "Image deleted successfully." });
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
