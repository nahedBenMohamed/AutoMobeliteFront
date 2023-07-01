import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const form = new multiparty.Form();

    try {
        // Parse the incoming form data
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        // Extract the temporary path and original filename of the uploaded file
        const { path: tempPath, originalFilename: fileName } = files.file[0];

        // Define the target path where the file will be saved
        const targetPath = path.join(process.cwd(), '/public/agences/', fileName);

        // Parse the car ID from the form fields
        const agenceId = parseInt(fields.id[0]);

        // Move the file to the target path
        fs.renameSync(tempPath, targetPath);

        // Update the car record in the database with the filename of the uploaded image
        await prisma.agency.update({
            where: { id: agenceId },
            data: { image: fileName },
        });

        // Define the image path to be sent in the response
        const imagePath = `/agences/${fileName}`;

        // Send a success response with the image path
        res.status(200).json({ message: 'Image uploaded successfully', imagePath });
    } catch (error) {
        console.error(error);
        // Send an error response if an error occurs during file processing
        res.status(500).json({ error: 'Add Agency before picture please' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
