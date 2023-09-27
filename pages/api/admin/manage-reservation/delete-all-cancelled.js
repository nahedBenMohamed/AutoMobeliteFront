import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;
  try {
    if (method === "DELETE") {
      try {
        const deletedRental = await prisma.rental.deleteMany({
          where: {
            status: "cancelled",
          },
        });
        res.json(deletedRental);
      } catch (error) {
        res
          .status(500)
          .json({
            message: "An error occurred while deleting the notifications.",
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
