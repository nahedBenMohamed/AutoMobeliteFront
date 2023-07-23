import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

export default async (req, res) => {
    const { email } = req.body;

    try {
        if (req.method === 'POST') {
            // Vérifier si l'utilisateur existe avec l'e-mail donné
            const agent = await prisma.agencyUser.findUnique({
                where: {
                    email: email,
                },
            });

            if (!agent) {
                return res.status(404).json({ error: 'User not found.' });
            }

            // Générer un jeton de réinitialisation de mot de passe
            const resetToken = jwt.sign({ userId: agent.id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            // Envoyer un e-mail de réinitialisation de mot de passe
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL,
                to: agent.email,
                subject: 'Password Reset',
                text: `Click the following link to reset your password: ${process.env.BASE_URL}/admin/reset-password?token=${resetToken}`,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'Email sent successfully.' });
        }
        else if (req.method === 'PUT') {
            const { agentId, password } = req.body;

            const agent = await prisma.agencyUser.findUnique({
                where: {
                    id: parseInt(agentId),
                },
            });

            if (!agent) {
                throw new Error('Client not found.');
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const agentUpdate = await prisma.agencyUser.update({
                where: {
                    id: parseInt(agentId),
                },
                data: {
                    password: hashedPassword,
                },
            });

            return res.status(200).json({ agentUpdate: 'password changed successfully' });
        } else {
            return res.status(405).json({ error: 'Method not allowed.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
};