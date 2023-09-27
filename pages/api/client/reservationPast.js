import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });
  try {
    if (req.method === "GET") {
      const clientId = session?.user?.id;

      if (!clientId) {
        return res
          .status(401)
          .json({ error: "Client ID not found in session" });
      }

      try {
        // If an ID query parameter exists, get rental data for that ID
        if (req.query?.id) {
          const rentalId = req.query.id;
          const rental = await prisma.rental.findUnique({
            where: {
              id: Number(rentalId),
            },
            include: {
              car: {
                include: {
                  Agency: true,
                  availability: true,
                },
              },
            },
          });
          res.json(rental);
        } else {
          const rentals = await prisma.rental.findMany({
            where: {
              clientId: parseInt(clientId),
              status: "completed",
            },
            include: { car: true },
          });

          return res.status(200).json(rentals);
        }
      } catch (error) {
        res.status(500).json({ error: "Error retrieving rental data" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
