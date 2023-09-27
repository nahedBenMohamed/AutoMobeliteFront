import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method === "POST") {
    try {
      // Retrieve the client
      const user = await prisma.client.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const ongoingReservations = await prisma.rental.findMany({
        where: {
          clientId: parseInt(id),
          status: {
            in: ["ongoing", "reserved"],
          },
        },
      });

      if (ongoingReservations.length > 0) {
        return res.status(400).json({ error: "You have current reservations" });
      }

      const deactivatedUser = await prisma.client.update({
        where: { id: parseInt(id) },
        data: { status: "deactivate" },
      });

      // Send back a successful response
      return res.status(200).send();
    } catch (error) {
      // Send back an error message if anything goes wrong
      return res.status(500).json({ error: "An internal error has occurred" });
    }
  } else {
    // If the method is not POST, return an error
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
