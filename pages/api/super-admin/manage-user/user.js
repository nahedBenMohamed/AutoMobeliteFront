import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "PUT") {
    const {
      id,
      name,
      firstname,
      email,
      image,
      address,
      city,
      telephone,
      isActive,
    } = req.body;
    console.log(req.body);

    if (!id) {
      return res.status(400).json({ message: "Client ID is required." });
    }

    const user = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "Client not found." });
    }

    const updatedUser = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        firstname: firstname,
        email: email,
        address: address,
        telephone: telephone,
        city: city,
        image,
        status: isActive ? "activate" : "deactivate", // Update the user's status
      },
    });
    return res.json(updatedUser);
  }

  if (method === "GET") {
    // Handle GET request
    if (req.query?.id) {
      // If an ID is provided in the query parameters
      const userId = req.query.id;
      // Retrieve a specific client by ID from the database
      res.json(
        await prisma.client.findUnique({ where: { id: Number(userId) } })
      );
    } else {
      // If no ID is provided, retrieve all clients from the database
      res.json(await prisma.client.findMany());
    }
  }
}
