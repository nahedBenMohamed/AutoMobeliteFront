import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

// Function to extract the agency name from the JWT token
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

export default async function handle(req, res) {
  const { method } = req;

  // Extract the agency name from the JWT token
  let agency;
  try {
    agency = getAgencyNameFromToken(req);
  } catch (error) {
    // Handle error if unable to extract agency name from token
    return res.status(401).json({ message: error.message });
  }

  try {
    // Handling different methods (POST, GET, PUT, DELETE)
    if (method === "POST") {
      // Extract variables from the request body
      const {
        parkingName,
        brand,
        model,
        year,
        mileage,
        price,
        registration,
        image,
        description,
        door,
        fuel,
        gearBox,
      } = req.body;

      // Convert variables to the appropriate types
      const yearInt = parseInt(year);
      const mileageInt = parseInt(mileage);
      const priceFloat = parseFloat(price);
      const doorInt = parseInt(door);

      let parking = null;

      // Check if parkingName is provided
      if (parkingName) {
        // Find the parking by name
        parking = await prisma.parking.findFirst({
          where: {
            name: parkingName,
            agencyId: agency.id, // Check if the parking belongs to the right agency
          },
        });

        // If parking is not found, return an error
        if (!parking) {
          return res.status(400).json({ error: "Invalid Parking name." });
        }
      }

      // Create a new car for the agency extracted from the JWT token
      const newCar = await prisma.car.create({
        data: {
          brand,
          model,
          registration,
          image,
          description,
          fuel,
          gearBox,
          year: yearInt,
          mileage: mileageInt,
          price: priceFloat,
          door: doorInt,
          Agency: {
            connect: {
              name: agency,
            },
          },
          parking: parking
            ? {
                connect: {
                  id: parking.id,
                },
              }
            : undefined,
        },
        include: {
          Agency: true,
          availability: true, // Include availability records in the response
        },
      });

      // Generate availability dates for the next 365 days
      const currentDate = new Date();
      const availabilityDates = [];
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() + i);
        availabilityDates.push(date);
      }

      // Insert availability records for the new car
      const availabilityRecords = availabilityDates.map((date) => {
        return {
          carId: newCar.id,
          date,
        };
      });

      await prisma.availability.createMany({
        data: availabilityRecords,
      });

      // Send the new car data with availability as a response
      res.json(newCar);
    }

    if (method === "GET") {
      // If an ID query parameter exists, get car data for that ID
      if (req.query?.id) {
        const carId = req.query.id;
        let car = await prisma.car.findUnique({
          where: { id: Number(carId) },
          include: {
            Agency: true,
            parking: true,
          },
        });

        if (!car || car.Agency.name !== agency) {
          return res
            .status(403)
            .json({ message: "You are not authorized to view this car." });
        }

        const availability = await prisma.availability.findMany({
          where: { carId: Number(carId) },
        });

        const rentals = await prisma.rental.findMany({
          where: { carId: Number(carId) },
        });

        const maintenances = await prisma.maintenance.findMany({
          where: { carId: Number(carId) },
        });

        // Merge car data, availability data and rental data
        car = { ...car, availability, maintenances, rentals };

        res.json(car);
      } else {
        // Get all car data for the agency
        const cars = await prisma.car.findMany({
          where: { Agency: { name: agency } },
          include: { Agency: true, parking: { select: { name: true } } },
        });

        // Fetch availability and rental data for each car
        for (let car of cars) {
          const availability = await prisma.availability.findMany({
            where: { carId: car.id },
          });

          const rentals = await prisma.rental.findMany({
            where: { carId: car.id },
          });

          // Merge car data, availability data and rental data
          car = { ...car, availability, rentals };
        }

        // Modify the response to include the parking name
        const carsWithParkingName = cars.map((car) => ({
          ...car,
          parkingName: car.parking?.name || "",
        }));

        res.json(carsWithParkingName);
      }
    }

    if (method === "PUT") {
      // Extract variables from the request body
      const {
        id,
        parkingName,
        brand,
        model,
        year,
        mileage,
        price,
        fuel,
        gearBox,
        door,
        registration,
        image,
        description,
        startDate,
        endDate,
      } = req.body;

      // Convert variables to the appropriate types
      const yearInt = parseInt(year);
      const mileageInt = parseInt(mileage);
      const priceFloat = parseFloat(price);
      const doorInt = parseInt(door);

      let parking = null;

      // Get car data for the specified ID
      const car = await prisma.car.findUnique({
        where: { id: Number(id) },
        include: { Agency: true, parking: true, availability: true }, // Include the Agency, parking, and availability details
      });

      // If the agency does not have access to the car, send an error
      if (car.Agency.name !== agency) {
        return res
          .status(403)
          .json({ message: "You are not authorized to modify this car." });
      }

      // Check if parkingName is provided
      if (parkingName) {
        // Find the parking by name
        parking = await prisma.parking.findFirst({
          where: {
            name: parkingName,
            agencyId: agency.id, // Check if the parking belongs to the right agency
          },
        });

        // If parking is not found, return an error
        if (!parking) {
          return res.status(400).json({ error: "Invalid Parking name." });
        }
      }

      // Update the car data
      const updatedCar = await prisma.car.update({
        where: { id: Number(id) },
        data: {
          brand,
          model,
          year: yearInt,
          mileage: mileageInt,
          price: priceFloat,
          door: doorInt,
          registration,
          fuel,
          gearBox,
          image,
          description,
          parking: parking
            ? {
                connect: {
                  id: parking.id,
                },
              }
            : {
                disconnect: true,
              },
        },
        include: { Agency: true, availability: true, parking: true }, // Include the Agency and parking details
      });

      // Delete existing availability records for the car only if new dates are provided
      if (startDate && endDate) {
        await prisma.availability.deleteMany({
          where: { carId: Number(id) },
        });
      }

      // Generate availability dates for the new range
      let availabilityDates = [];

      if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const currentDate = new Date(startDateObj); // Start from the specified start date

        while (currentDate <= endDateObj) {
          availabilityDates.push(new Date(currentDate)); // Add a new date instance to the list
          currentDate.setDate(currentDate.getDate() + 1); // Advance by one day
        }
      }

      // Insert new availability records for the car if dates are available
      if (availabilityDates.length > 0) {
        const availabilityRecords = availabilityDates.map((date) => {
          return {
            carId: updatedCar.id,
            date,
          };
        });

        await prisma.availability.createMany({
          data: availabilityRecords,
        });
      }

      // Send the updated car data as a response
      res.json(updatedCar);
    }

    if (method === "DELETE") {
      // If an ID query parameter exists, delete the car with that ID
      if (req.query?.id) {
        const carId = req.query.id;
        const car = await prisma.car.findUnique({
          where: { id: Number(carId) },
          include: { Agency: true, parking: true }, // Include the Agency and parking details
        });

        // If the agency does not have access to the car, send an error
        if (car.Agency.name !== agency) {
          return res
            .status(403)
            .json({ message: "You are not authorized to delete this car." });
        }

        // Check if the car is reserved
        const isCarReserved = await prisma.rental.findFirst({
          where: {
            carId: Number(carId),
          },
        });

        // If the car is reserved, send an error response
        if (isCarReserved) {
          return res
            .status(403)
            .json({ message: "The car is reserved and cannot be deleted." });
        }

        // Delete the car's availability records
        await prisma.availability.deleteMany({
          where: { carId: Number(carId) },
        });

        // Delete the car and send the deleted car data as a response
        res.json(
          await prisma.car.delete({
            where: { id: Number(carId) },
            include: { Agency: true, parking: true }, // Include the Agency and parking details
          }),
        );
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
