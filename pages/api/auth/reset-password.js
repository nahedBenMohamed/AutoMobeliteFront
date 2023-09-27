import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export default async (req, res) => {
  const { email } = req.body;

  try {
    if (req.method === "POST") {
      // Vérifier si l'utilisateur existe avec l'e-mail donné
      const existingUser = await prisma.client.findUnique({
        where: {
          email: email,
        },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "User not found." });
      }

      // Générer un jeton de réinitialisation de mot de passe
      const resetToken = jwt.sign(
        { userId: existingUser.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Envoyer un e-mail de réinitialisation de mot de passe
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: existingUser.email,
        subject: "Password Reset",
        html: `
        <div style="background-color: #f5f5f5; font-family: 'Arial', sans-serif; width: 100%; display: flex; justify-content: center;">
            <div style="max-width: 600px; width: 100%; margin: 0 auto;">
                <div style="background-color: #fff; padding: 40px;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <img src="cid:mobelite" alt="AUTOMOBELITE" style="width: 120px; height: auto;">
                        <h2 style="font-size: 24px; font-weight: bold; color: #4a90e2; margin-bottom: 10px;">Password Reset</h2>
                    </div>
                    <p style="margin-bottom: 20px;">Hello ${
                      existingUser.name
                    },</p>
                    <p>You have requested a password reset for your account on the <strong>AUTOMOBELITE</strong> application.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${
                          process.env.BASE_URL
                        }/reset-password?token=${resetToken}" style="background-color: #4a90e2; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="margin-top: 30px;">If you didn't request a password reset, you can ignore this email.</p>
                    <p>Thank you,</p>
                    <p style="margin-bottom: 0;"><strong>The AUTOMOBELITE Team</strong></p>
                     <footer style="text-align: center; margin-top: 50px;">
                    <p style="color: #777;">&copy; ${new Date().getFullYear()} - Automobelite</p>
                </footer>
                </div>
                
            </div>
        </div>
    `,
        attachments: [
          {
            filename: "mobelite.png",
            path: "public/mobelite.png",
            cid: "mobelite",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: "Email sent successfully." });
    } else if (req.method === "PUT") {
      const { clientId, password } = req.body;

      const client = await prisma.client.findUnique({
        where: {
          id: parseInt(clientId),
        },
      });

      if (!client) {
        throw new Error("Client not found.");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const clientUpdate = await prisma.client.update({
        where: {
          id: parseInt(clientId),
        },
        data: {
          password: hashedPassword,
        },
      });

      return res
        .status(200)
        .json({ clientUpdate: "password changed successfully" });
    } else {
      return res.status(405).json({ error: "Method not allowed." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while resetting the password." });
  }
};
