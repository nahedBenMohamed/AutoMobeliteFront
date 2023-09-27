import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export default async function handle(req, res) {
  const { id } = req.query;
  const { method } = req;
  if (method === "GET") {
    try {
      const user = await prisma.client.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).json({ error: "The user does not exist" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving user data" });
    }
  } else if (req.method === "PUT") {
    const {
      name,
      firstname,
      email,
      telephone,
      drivingLicense,
      address,
      city,
      image,
      oldPassword,
      newPassword,
    } = req.body;

    const telephoneString = String(telephone);

    try {
      const user = await prisma.client.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).json({ error: "The user does not exist" });
      }

      const phoneNumber = parsePhoneNumberFromString(telephoneString, "TN");

      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error("Please enter a valid Tunisian phone number.");
      }

      if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(400).json({ error: "Incorrect old password" });
      }

      const updatedUser = await prisma.client.update({
        where: { id: parseInt(id) },
        data: {
          name,
          firstname,
          email,
          telephone,
          numPermis: drivingLicense,
          address,
          city,
          image,
          password: newPassword
            ? await bcrypt.hash(newPassword, 12)
            : undefined,
        },
      });

      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the user data" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
