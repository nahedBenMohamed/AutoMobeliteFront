import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;

  // Handle GET request
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
      const availability = await prisma.availability.findMany({
        where: { carId: Number(carId) },
      });

      // Merge car data, availability data and rental data
      car = { ...car, availability };

      // Send the car data as a response
      res.json(car);
    } else {
      // Retrieve all cars from the database
      const cars = await prisma.car.findMany({
        include: { Agency: true, availability: true, parking: true }, // Include the Agency and parking details
      });

      const carsWithAvailability = [];

      // Fetch availability and rental data for each car
      for (let car of cars) {
        const availability = await prisma.availability.findMany({
          where: { carId: car.id },
        });

        const rentals = await prisma.rental.findMany({
          where: { carId: car.id },
        });

        // Exclude cars without availability
        if (availability.length > 0) {
          // Merge car data, availability data, and rental data
          car = { ...car, availability, rentals };

          // Modify the response to include the parking name
          car = { ...car };

          carsWithAvailability.push(car);
        }
      }
      // Send the queried cars as a response
      res.json(carsWithAvailability);
    }
  }
}
