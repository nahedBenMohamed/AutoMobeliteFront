import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { departDate, returnDate } = req.query;

  try {
    // Vérifier les dates de début et de fin
    if (!startDate || !returnDate) {
      return res
        .status(400)
        .json({ error: "Start and end dates are required." });
    }

    const start = new Date(startDate);
    const end = newDate(returnDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date." });
    }

    // Générer toutes les dates dans la plage
    // Cette boucle crée un tableau de toutes les dates entre la date de départ et la date de retour.
    const dates = [];
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date));
    }

    // Utilisez Prisma pour rechercher les voitures qui sont disponibles pendant la période demandée
    // La clause 'where' recherche les voitures dont toutes les dates dans la table 'Availability' correspondent aux dates dans le tableau 'dates'.
    // En d'autres termes, elle recherche les voitures qui sont disponibles pour chaque jour entre la date de départ et la date de retour.
    const cars = await prisma.car.findMany({
      where: {
        availability: {
          every: {
            date: {
              in: dates,
            },
          },
        },
      },
      include: {
        availability: true,
      },
    });

    // Renvoyer les voitures en réponse
    res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for cars." });
  }
}
