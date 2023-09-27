import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "DELETE") {
    try {
      if (req.query?.id) {
        const clientId = req.query.id;
        const client = await prisma.client.findUnique({
          where: { id: Number(clientId) },
        });

        if (!client) {
          return res.status(404).json({ message: "Client not found." });
        }

        if (client.image) {
          const imagePath = path.join(process.cwd(), "public", client.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            await prisma.client.update({
              where: { id: Number(clientId) },
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
          error: `An error occurred while deleting the image for client with id: ${req.query?.id}.`,
        });
    }
  }
}
