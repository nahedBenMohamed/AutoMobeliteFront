import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
const getAgencyIdFromToken = (req) => {
  // Extract the JWT token from the request's cookie
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies.token;

    try {
      // Verify and decode the JWT token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      // Return the agency ID from the decoded token
      return decodedToken.agencyId;
    } catch (error) {
      // Error handling for invalid tokens
      throw new Error("Invalid token.");
    }
  } else {
    // Error handling if no cookies are found
    throw new Error("No cookie found.");
  }
};

export default async function handle(req, res) {
  const { method } = req;

  // Extract the agency ID from the JWT token
  let agencyId;
  try {
    agencyId = getAgencyIdFromToken(req);
  } catch (error) {
    // Handle error if unable to extract agency ID from token
    return res.status(401).json({ message: error.message });
  }

  try {
    if (method === "POST") {
      try {
        const updatedNotifications = await prisma.notification.updateMany({
          where: {
            agencyId: Number(agencyId),
            readStatus: false,
          },
          data: {
            readStatus: true,
          },
        });
        res.json(updatedNotifications);
      } catch (error) {
        res
          .status(500)
          .json({
            message: "An error occurred while updating the notifications.",
            error: error.message,
          });
      }
    }
  } catch (error) {
    // Handle error if something goes wrong during database operations
    return res.status(500).json({
      message: "An error occurred while interacting with the database.",
      error: error.message,
    });
  }
}
