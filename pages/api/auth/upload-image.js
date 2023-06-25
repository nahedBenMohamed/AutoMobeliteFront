import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';

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
        const targetPath = path.join(process.cwd(), '/public/client/', fileName);

        // Move the file to the target path
        fs.renameSync(tempPath, targetPath);

        // Create a new client in the database
        const { name, firstname, email, password, telephone } = fields;
        const hashedPassword = await bcrypt.hash(password[0], 12);
        const telephoneString = String(telephone[0]);

        const client = await prisma.client.create({
            data: {
                name: name[0],
                firstname: firstname[0],
                email: email[0],
                password: hashedPassword,
                telephone: telephoneString,
                image: fileName // Assign the filename to the 'image' field of the client
            },
        });

        // Define the image path to be sent in the response
        const imagePath = `/client/${fileName}`;

        // Send a success response with the image path and client information
        res.status(200).json({ message: 'Image and client registered successfully', imagePath, client });
    } catch (error) {
        console.error(error);
        // Send an error response if an error occurs during file processing or client registration
        res.status(500).json({ error: 'An error occurred while processing the file or registering the client' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
