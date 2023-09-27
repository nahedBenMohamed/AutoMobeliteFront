import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const agencyCount = await prisma.agency.count();
      const adminCount = await prisma.agencyUser.count({
        where: { role: "admin" },
      });
      const clientCount = await prisma.client.count();

      res.status(200).json({ agencyCount, adminCount, clientCount });
    } else {
      res.status(405).json({ error: "Method not allowed. Use GET method." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
}
