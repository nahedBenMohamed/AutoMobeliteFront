import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { parseISO } from "date-fns";

const getAgencyIdFromToken = async (req) => {
  // Extract the JWT token from the request's cookie
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies?.token;

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      return decodedToken.agencyId;
    } catch (error) {
      throw new Error("Invalid token.");
    }
  } else if (req.query.agencyId) {
    // If agencyId is provided in query parameters
    return req.query.agencyId;
  } else if (req.query.agencyName) {
    // If agencyName is provided in query parameters
    const agency = await prisma.agency.findUnique({
      where: { name: req.query.agencyName },
    });

    if (agency) {
      return agency.id;
    } else {
      throw new Error("Invalid agency name.");
    }
  } else {
    throw new Error("No agency ID or name provided.");
  }
};

export default async function handler(req, res) {
  try {
    // Extract the agency id from the token or query parameters
    const agencyId = await getAgencyIdFromToken(req);

    if (req.method === "PUT") {
      // Extract variables from the request body
      const { id, carId, description, price, startDate, endDate } = req.body;

      const maintenanceId = parseInt(id);
      const maintenance = await prisma.maintenance.findUnique({
        where: {
          id: maintenanceId,
        },
        include: {
          car: {
            include: {
              Agency: true,
            },
          },
        },
      });

      // Définir les nouvelles valeurs des dates
      const parsedStartDate = startDate
        ? parseISO(startDate)
        : maintenance.startDate;
      const parsedEndDate = endDate ? parseISO(endDate) : maintenance.endDate;

      // Update the rental data
      const updatedMaintenance = await prisma.maintenance.update({
        where: { id: maintenanceId },
        data: {
          carId,
          description,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          cost: parseFloat(price),
        },
        include: { car: true },
      });

      // Supprimer toutes les disponibilités pour la voiture pendant la période de maintenance
      await prisma.availability.deleteMany({
        where: {
          carId,
          date: {
            gte: parsedStartDate,
            lte: parsedEndDate,
          },
        },
      });

      // Send the updated rental and car data as a response
      res.status(201).json({ maintenance: updatedMaintenance });
    } else if (req.method === "GET") {
      // If an ID query parameter exists, get rental data for that ID
      if (req.query?.id) {
        const maintenanceId = req.query.id;
        const maintenance = await prisma.maintenance.findUnique({
          where: {
            id: Number(maintenanceId),
          },
          include: {
            car: {
              include: {
                Agency: true,
                availability: true,
                rentals: true,
              },
            },
          },
        });

        res.json(maintenance);
      } else {
        const maintenance = await prisma.maintenance.findMany({
          where: {
            car: {
              Agency: {
                id: agencyId,
              },
            },
          },
          include: {
            car: {
              include: {
                Agency: true,
              },
            },
          },
        });
        res.status(200).json(maintenance);
      }
    } else {
      res.status(405).json({ error: "Method not allowed. Use GET method." });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}
