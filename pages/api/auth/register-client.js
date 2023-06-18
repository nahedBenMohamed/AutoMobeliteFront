import * as bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handle(req, res) {
    const { name, firstname, email, password, telephone } = req.body;

    try {
        // Check if the email already exists in the database
        const existingClient = await prisma.client.findUnique({
            where: {
                email: email,
            },
        });

        // If the email already exists, return an error response
        if (existingClient) {
            return res.status(400).json({ message: 'Email already exists.' });
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
                telephone: telephone,
            },
        });

        // Generate a token for the client
        const token = jwt.sign(
            { clientId: client.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
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
            subject: 'Automobelite validate your account',
            text: `Please click on the following link to validate your account: ${process.env.BASE_URL}/validate-email?token=${token}`,
        };

        try {
            // Send the email using the transporter
            await transporter.sendMail(mailOptions);

            // Return a success response if the email is sent successfully
            return res.status(200).json({ message: 'Email sent successfully.' });
        } catch (error) {
            // Return an error response if there's an issue sending the email
            return res.status(500).json({ error: 'Error sending the email.' });
        }
    } catch (error) {
        // Return an error response if there's an issue creating the client
        return res.status(500).json({ error: 'Error creating the client.' });
    }
}
