import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    const form = new multiparty.Form();

    try {
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });

        const { path: tempPath, originalFilename: fileName } = files.file[0];
        const targetPath = path.join(process.cwd(), '/public/agences/', fileName);
        const carId = parseInt(fields.id[0]);

        fs.renameSync(tempPath, targetPath);

        await prisma.voiture.update({
            where: { id: carId },
            data: { images: { set: fileName } },
        });

        const imagePath = `/agences/${fileName}`; // Chemin de l'image à renvoyer
        res.status(200).json({ message: 'Image uploaded successfully', imagePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
