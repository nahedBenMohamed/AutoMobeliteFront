import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      // Handle GET method
      const { id } = req.query;

      if (id) {
        // Retrieve an agency by its ID
        const agency = await prisma.agency.findUnique({
          where: { id: parseInt(id) },
          include: { AgencyUser: true, Cars: true }, // Include the AgencyUser and Cars objects in the response
        });

        if (!agency) {
          return res.status(404).json({ message: "Agency not found." });
        }

        const totalParkings = await prisma.parking.count({
          where: { agencyId: agency.id },
        });

        const totalCars = await prisma.car.count({
          where: { agencyId: agency.id },
        });

        return res.json({ ...agency, totalCars, totalParkings });
      }
    } else if (method === "PUT") {
      // Handle PUT method
      const {
        agencyId,
        name,
        address,
        email,
        telephone,
        image,
        responsibleEmail,
        isActive,
      } = req.body;

      // Check if the agency exists
      const existingAgency = await prisma.agency.findUnique({
        where: { id: parseInt(agencyId) },
      });

      if (!existingAgency) {
        return res.status(404).json({ message: "Agency not found." });
      }

      // Check if the responsible email exists and is not already associated with another agency
      const responsibleUser = await prisma.agencyUser.findUnique({
        where: {
          email: responsibleEmail,
        },
      });

      if (!responsibleUser) {
        return res
          .status(404)
          .json({ message: "Responsible email not found." });
      }

      const associatedAgency = await prisma.agency.findFirst({
        where: {
          responsibleId: responsibleUser.id,
          NOT: {
            id: agencyId,
          },
        },
      });

      if (associatedAgency) {
        return res
          .status(400)
          .json({
            message: "Responsible is already associated with another agency.",
          });
      }

      // Update the agency
      const updatedAgency = await prisma.agency.update({
        where: { id: agencyId },
        data: {
          name: name,
          address: address,
          email: email,
          telephone: telephone,
          image,
          status: isActive ? "activate" : "deactivate", // Update the agency's status
          AgencyUser: {
            connect: {
              id: responsibleUser.id,
            },
          },
        },
        include: { AgencyUser: true },
      });

      return res.json(updatedAgency);
    }
  } catch (error) {
    // Handle errors that occur during database interactions
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
}
