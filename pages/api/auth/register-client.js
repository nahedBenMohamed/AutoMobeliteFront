import * as bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default async function handle(req, res) {
    const { name, firstname, email, password, telephone, numPermis , address , city } = req.body;

    // Convert telephone to a string
    const telephoneString = String(telephone);

    try {
        // Check if the email already exists
        const existingClient = await prisma.client.findUnique({
            where: {
                email: email,
            },
        });


        if (existingClient) {
            throw new Error('Email already exists.');
        }

        // Validate the phone number using the country code for Tunisia (TN)
        const phoneNumber = parsePhoneNumberFromString(telephoneString, 'TN');
        if (!phoneNumber || !phoneNumber.isValid()) {
            throw new Error('Please enter a valid Tunisian phone number.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new client in the database
        const client = await prisma.client.create({
            data: {
                name: name,
                firstname: firstname,
                email: email,
                password: hashedPassword,
                telephone: telephoneString,
                numPermis: numPermis,
                address : address,
                city : city,
            },
        });

        // Generate a token for the client
        const token = jwt.sign(
            { clientId: client.id },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        // Create a nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Prepare the email content
        let mailOptions = {
            from: process.env.EMAIL,
            to: client.email,
            subject: 'Automobelite valider votre compte',
            text: `Veuillez cliquer sur le lien suivant pour valider votre compte: ${process.env.BASE_URL}/validate-email?token=${token}`,
        };

        try {
            // Send the email using the transporter
            await transporter.sendMail(mailOptions);

            // Return a success response if the email is sent successfully
            return res.status(200).json({ message: 'Email envoyé avec succès.' });
        } catch (error) {
            throw new Error('Erreur lors de l\'envoi de l\'email.');
        }
    } catch (error) {
        // Return an error response for the specific error scenarios
        if (error.message === 'Email already exists.') {
            return res.status(400).json({ message: error.message });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
}
