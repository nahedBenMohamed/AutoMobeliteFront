import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export default async function handle(req, res) {
  const { method } = req;
  // Get the token from the cookie
  const { token } = parseCookies({ req });

  let payload;
  try {
    // Verify the token
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (method === "DELETE") {
    try {
      // If an ID query parameter exists, delete the user with that ID
      const userAgency = await prisma.agencyUser.findUnique({
        where: {
          id: payload.agencyUserId,
        },
      });

      if (!userAgency) {
        return res.status(404).json({ message: "User not found." });
      }

      if (userAgency.image) {
        const imagePath = path.join(process.cwd(), "/public", userAgency.image);
        fs.unlinkSync(imagePath);
      }

      // Delete the user and send the deleted user data as a response
      res.json(
        await prisma.agencyUser.update({
          where: { id: Number(userAgency.id) },
          data: { image: null },
        })
      );
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting image.", error: error.message });
    }
  }
}
