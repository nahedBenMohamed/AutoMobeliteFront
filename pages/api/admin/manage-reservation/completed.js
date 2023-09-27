import prisma from "@/lib/prisma";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

const getAgencyNameFromToken = (req) => {
  // Extract the JWT token from the request's cookie
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies.token;

    try {
      // Verify and decode the JWT token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      // Return the agency name from the decoded token
      return decodedToken.agency;
    } catch (error) {
      // Error handling for invalid tokens
      throw new Error("Invalid token.");
    }
  } else {
    // Error handling if no cookies are found
    throw new Error("No cookie found.");
  }
};

export default async function handler(req, res) {
  // Extract the agency name from the JWT token
  let agency;
  try {
    agency = getAgencyNameFromToken(req);
  } catch (error) {
    // Handle error if unable to extract agency name from token
    res.status(401).json({ message: error.message });
  }
  try {
    if (req.method === "GET") {
      try {
        // If an ID query parameter exists, get rental data for that ID
        if (req.query?.id) {
          const rentalId = req.query.id;
          const rental = await prisma.rental.findUnique({
            where: {
              id: Number(rentalId),
            },
            include: {
              client: true,
              car: {
                include: {
                  Agency: true,
                  availability: true,
                },
              },
            },
          });

          if (!rental || rental.car.Agency.name !== agency) {
            return res
              .status(403)
              .json({ message: "You are not authorized to view this car." });
          }
          res.json(rental);
        } else {
          const rentals = await prisma.rental.findMany({
            where: {
              status: "completed", // Filter by status 'ongoing'
              car: {
                Agency: {
                  name: agency,
                },
              },
            },
            include: { car: true, client: true },
          });
          res.status(200).json(rentals);
        }
      } catch (error) {
        res.status(500).json({ error: "Error retrieving rental data" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
