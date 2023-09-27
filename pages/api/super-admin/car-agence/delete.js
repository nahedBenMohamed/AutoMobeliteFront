import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "DELETE") {
    try {
      // If an ID query parameter exists, delete the car with that ID
      if (req.query?.id) {
        const carId = req.query.id;
        const car = await prisma.car.findUnique({
          where: { id: Number(carId) },
          include: { Agency: true }, // Include the Agency
        });

        if (!car) {
          return res.status(404).json({ message: "Car not found." });
        }

        if (car.image) {
          const imagePath = path.join(process.cwd(), "/public", car.image);
          fs.unlinkSync(imagePath);
        }

        // Delete the car and send the deleted car data as a response
        res.json(
          await prisma.car.update({
            where: { id: Number(carId) },
            data: { image: null },
          })
        );
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting image.", error: error.message });
    }
  }
}
