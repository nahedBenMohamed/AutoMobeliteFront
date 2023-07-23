import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

// Function to extract the agency name from the JWT token
const getAgencyIdFromToken = (req) => {
    // Extract the JWT token from the request's cookie
    if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;

        try {
            // Verify and decode the JWT token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // Return the agency ID from the decoded token
            return decodedToken.agencyId;
        } catch (error) {
            // Error handling for invalid tokens
            throw new Error("Invalid token.");
        }
    } else {
        // Error handling if no cookies are found
        throw new Error("No cookie found.");
    }
};


export default async function handle(req, res) {
    const { method } = req;

    // Extract the agency ID from the JWT token
    let agencyId;
    try {
        agencyId = getAgencyIdFromToken(req);
    } catch (error) {
        // Handle error if unable to extract agency ID from token
        return res.status(401).json({ message: error.message });
    }

    try {
        // Handling different methods (POST, GET, DELETE)
        if (method === "POST") {
            const id = req.query.id;
            try {
                const updatedNotification = await prisma.notification.update({
                    where: {id: parseInt(id)},
                    data: {readStatus: true},
                });
                res.json(updatedNotification);
            } catch (error) {
                // Send an error response if the update fails
                res.status(500).json({ message: "An error occurred while updating the notification.", error: error.message });
            }
        }


        if (method === "GET") {
            // Get notifications for the agency
            const notifications = await prisma.notification.findMany({
                where: {
                    agencyId: Number(agencyId)
                }
            });
            return res.json(notifications);

        }
        if (method === "DELETE") {
            const id = req.query.id;

            try {
                const deletedNotification = await prisma.notification.delete({
                    where: {id: parseInt(id)},
                });
                return res.json(deletedNotification);
            } catch (error) {
                return res.status(500).json({ message: "An error occurred while deleting the notification.", error: error.message });
            }
        }


    } catch (error) {
        // Handle error if something goes wrong during database operations
        return res.status(500).json({
            message: "An error occurred while interacting with the database.",
            error: error.message,
        });
    }
}

