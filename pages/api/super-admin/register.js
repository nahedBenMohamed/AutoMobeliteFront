import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

export default async function handle(req, res) {
  const { method } = req;

  try {
    if (method === "POST") {
      // Handle POST method
      const { name, firstname, email, password, role } = req.body;
      // Check if the email is already in use
      const existingUser = await prisma.agencyUser.findUnique({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        // Return an error response if the email is already in use
        return res
          .status(400)
          .json({ message: "This email is already in use" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create the new user
      const newUser = await prisma.agencyUser.create({
        data: {
          name: name,
          firstname: firstname,
          email: email,
          password: hashedPassword,
          role: role,
        },
      });

      // Send a success response
      return res
        .status(200)
        .json({ message: "User registered successfully", newUser });
    }
  } catch (e) {}
}
