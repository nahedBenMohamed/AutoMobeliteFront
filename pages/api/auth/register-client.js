import multer from 'multer';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import path from 'path';
import fs from 'fs';

// Configure multer
const upload = multer({ dest: path.join(process.cwd(), 'tmp') });
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    upload.single('image')(req, {}, async (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const { name, firstname, email, password, telephone, numPermis, address, city } = req.body;
        const telephoneString = String(telephone);

        try {
            const existingClient = await prisma.client.findFirst({
                where: {
                    email: email,
                },
            });

            if (existingClient) {
                throw new Error('Email already exists.');
            }

            const phoneNumber = parsePhoneNumberFromString(telephoneString, 'TN');
            if (!phoneNumber || !phoneNumber.isValid()) {
                throw new Error('Please enter a valid Tunisian phone number.');
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            let imagePath = '';

            if (req.file) {
                const uploadedImage = req.file;
                const uniqueFileName = `${Date.now()}_${uploadedImage.originalname}`;
                imagePath = path.join('/client', uniqueFileName).replace(/\\/g, "/");
                await fs.promises.rename(uploadedImage.path, path.join(process.cwd(), '/public/', imagePath));
            }

            if (name && firstname && email && password && telephone && numPermis && address && city && imagePath) {
                const client = await prisma.client.create({
                    data: {
                        name: name,
                        firstname: firstname,
                        email: email,
                        password: hashedPassword,
                        telephone: telephoneString,
                        numPermis: numPermis,
                        address: address,
                        city: city,
                        image: imagePath
                    },
                });

                const token = jwt.sign({ clientId: client.id }, process.env.JWT_SECRET, { expiresIn: '3h' });

                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD,
                    },
                });

                let mailOptions = {
                    from: process.env.EMAIL,
                    to: client.email,
                    subject: 'Automobelite valider votre compte',
                    text: `Veuillez cliquer sur le lien suivant pour valider votre compte: ${process.env.BASE_URL}/validate-email?token=${token}`,
                };

                await transporter.sendMail(mailOptions);

                return res.status(200).json({ message: 'Email envoyé avec succès.' });
            } else {
                throw new Error('Toutes les informations requises ne sont pas fournies.');
            }
        } catch (error) {
            if (error.message === 'Email already exists.') {
                return res.status(400).json({ message: error.message });
            } else {
                return res.status(500).json({ message: error.message });
            }
        }
    });
}
