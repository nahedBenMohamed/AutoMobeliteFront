import prisma from "@/lib/prisma";
import fs from "fs";
import path from 'path';
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
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (method === "DELETE") {
        try {
            // If an ID query parameter exists, delete the user with that ID
            const client = await prisma.client.findUnique({
                where: {
                    id: payload.clientId,
                },
            });

            if (!client) {
                return res.status(404).json({ message: "User not found." });
            }

            if (client.image) {
                const imagePath = path.join(process.cwd(), "public", "client", client.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    await prisma.client.update({
                        where: { id:  payload.clientId },
                        data: { image: null },
                    });
                } else {
                    return res.status(404).json({ message: `Image not found at path: ${imagePath}` });
                }
            }

            // Delete the user and send the deleted user data as a response
            return res.status(200).json({ message: "Image deleted successfully." });
        } catch (error) {
            res.status(500).json({ message: "Error deleting image.", error: error.message });
        }
    }
}
