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
                    subject: 'Account Validation',
                    html: `
        <div style="background-color: #f5f5f5; font-family: 'Arial', sans-serif; width: 100%; display: flex; justify-content: center;">
            <div style="max-width: 600px; width: 100%; margin: 0 auto;">
                <div style="background-color: #fff; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <img src="cid:mobelite" alt="AUTOMOBELITE" style="width: 120px; height: auto;">
                        <h2 style="font-size: 24px; font-weight: bold; color: #4a90e2; margin-bottom: 10px;">Account Validation</h2>
                    </div>
                    <p style="margin-bottom: 20px;">Hello ${client.name},</p>
                    <p>You have registered an account on the <strong>AUTOMOBELITE</strong> application. To validate your account, please click the link below:</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.BASE_URL}/validate-email?token=${token}" style="background-color: #4a90e2; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Validate Account</a>
                    </div>
                    <p style="margin-top: 30px;">If you didn't register an account on AUTOMOBELITE, you can ignore this email.</p>
                    <p>Thank you,</p>
                    <p style="margin-bottom: 0;"><strong>The AUTOMOBELITE Team</strong></p>
                    <footer style="text-align: center; margin-top: 50px;">
                        <p style="color: #777;">&copy; ${new Date().getFullYear()} - Automobelite</p>
                    </footer>
                </div>
                   
            </div>
        </div>
    `,
                    attachments: [{
                        filename: 'mobelite.png',
                        path: 'public/mobelite.png',
                        cid: 'mobelite'
                    }]
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
