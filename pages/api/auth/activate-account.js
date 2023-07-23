import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export default async (req, res) => {
    const { email } = req.body;

    try {
        const existingClient = await prisma.client.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingClient) {
            return res.status(401).json({ error: 'This account does not exist.' });
        }

        if (existingClient.status === 'activate') {
            return res.status(400).json({ error: 'This account is already activated' });
        }

        const clientId = existingClient.id;

        const token = jwt.sign({ clientId: clientId }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL,
            to: existingClient.email,
            subject: 'Account Reactivation',
            html: `
        <div style="background-color: #f5f5f5; font-family: 'Arial', sans-serif; width: 100%; display: flex; justify-content: center;">
            <div style="max-width: 600px; width: 100%; margin: 0 auto;">
                <div style="background-color: #fff; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <img src="cid:mobelite" alt="AUTOMOBELITE" style="width: 120px; height: auto;">
                        <h2 style="font-size: 24px; font-weight: bold; color: #4a90e2; margin-bottom: 10px;">Account Reactivation</h2>
                    </div>
                    <p style="margin-bottom: 20px;">Hello ${existingClient.name},</p>
                    <p>You have requested to reactivate your account on the <strong>AUTOMOBELITE</strong> application.</p>
                    <p>Click the link below to reactivate your account:</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.BASE_URL}/activate-account?token=${token}" style="background-color: #4a90e2; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reactivate Account</a>
                    </div>
                    <p style="margin-top: 30px;">If you didn't request to reactivate your account, you can ignore this email.</p>
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
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
