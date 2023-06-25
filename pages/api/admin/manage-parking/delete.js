import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import fs from 'fs';
import path from 'path';

// Function to extract the agency name from the JWT token
const getAgencyNameFromToken = (req) => {
    // Extract the JWT token from the request's cookie
    if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;

        try {
            // Verify and decode the JWT token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // Return the agency name from the decoded token
            return decodedToken.agency;
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
    const parkingId = Number(req.query.id); // Ensure to pass parkingId in the request body

    // Extract the agency name from the JWT token
    let agency;
    try {
        agency = getAgencyNameFromToken(req);
    } catch (error) {
        // Handle error if unable to extract agency name from token
        return res.status(401).json({ message: error.message });
    }

    try {
        // Fetch the parking record
        const parking = await prisma.parking.findUnique({
            where: { id: parkingId },
            include: { Agency: true }, // Include the Agency object in the response
        });

        if (!parking) {
            return res.status(404).json({ error: "Parking not found" });
        }

        // Check if the agency has the right to delete the image from this parking
        if (parking.Agency.name !== agency) {
            return res.status(403).json({ message: "You are not authorized to delete this image." });
        }

        // Update the parking record in the database by setting the image field to null
        await prisma.parking.update({
            where: { id: parkingId },
            data: { image: null },
        });

        // Extract the filename from the database record
        const fileName = parking.image;

        // Define the path of the image file to be deleted
        const filePath = path.join(process.cwd(), '/public/parking/', fileName);

        // Delete the file from the filesystem
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                // Re-throw the error if it's not an 'ENOENT' error
                throw error;
            }
            // Ignore the error if the file doesn't exist
        }

        // Send a success response
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        // Send an error response if an error occurs during the process
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
}

export const config = {
    api: {
        bodyParser: true, // Enable body parsing for DELETE requests
    },
};
