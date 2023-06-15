import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handle(req, res) {
  const { name, email, password,firstname } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const client = await prisma.client.create({
    data: {
      name: name,
      firstname: firstname,
      email: email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
      { clientId: client.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
  );

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

  try {
     transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email envoyé avec succès.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
  }
}
