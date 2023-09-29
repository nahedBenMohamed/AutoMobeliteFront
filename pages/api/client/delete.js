import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  if (method === "DELETE") {
    try {
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const clientId = session.user.id;

      // Retrieve the client
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!client) {
        return res.status(404).json({ message: "User not found." });
      }

      if (client.image) {
        const imagePath = path.join(process.cwd(), "/public", client.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          await prisma.client.update({
            where: { id: clientId },
            data: { image: null },
          });
        } else {
          return res
            .status(404)
            .json({ message: `Image not found at path: ${imagePath}` });
        }
      }

      res.status(200).json({ message: "Image deleted successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting image.", error: error.message });
    }
  }
}
