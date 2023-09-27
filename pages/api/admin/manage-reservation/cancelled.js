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
    return res.status(401).json({ message: error.message });
  }
  try {
    if (req.method === "GET") {
      try {
        const rentals = await prisma.rental.findMany({
          where: {
            status: "cancelled", // Filter by status 'ongoing'
            car: {
              Agency: {
                name: agency,
              },
            },
          },
          include: { car: true, client: true },
        });
        res.status(200).json(rentals);
      } catch (error) {
        res.status(500).json({ error: "Error retrieving rental data" });
      }
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      try {
        const deletedRental = await prisma.rental.delete({
          where: {
            id: parseInt(id),
          },
        });
        res.json(deletedRental);
      } catch (error) {
        return res
          .status(500)
          .json({
            message: "An error occurred while deleting the rental.",
            error: error.message,
          });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
