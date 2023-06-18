import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

const getAgenceNameFromToken = (req) => {
    // Extraire le token JWT du cookie de la requête
    if (req.headers.cookie) {
        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            return decodedToken.agency;
        } catch (error) {
            throw new Error("Token non valide.");
        }
    } else {
        throw new Error("Aucun cookie trouvé.");
    }
};

export default async function handle(req, res) {
    const { method } = req;

    // Extraire le nom de l'agence du token
    let agency;
    try {
        agency = getAgenceNameFromToken(req);
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }

    // Vérifier que l'utilisateur a le droit de voir les voitures de cette agence
    if (!agency) {
        return res
            .status(403)
            .json({ message: "Vous n'êtes pas autorisé à voir les voitures de cette agence." });
    }

    try {
        if (method === "POST") {
            const {
                agency: postAgencyName,
                brand,
                model,
                year,
                mileage,
                price,
                registration,
                status,
                images,
            } = req.body;
            const yearInt = parseInt(year);
            const mileageInt = parseInt(mileage);
            const priceFloat = parseFloat(price);

            // Vérifier que l'utilisateur a le droit de créer une voiture pour cette agence
            if (agency !== postAgencyName) {
                return res
                    .status(403)
                    .json({ message: "Vous n'êtes pas autorisé à créer une voiture pour cette agence." });
            }

            const newVoiture = await prisma.car.create({
                data: {
                    brand,
                    model,
                    year: yearInt,
                    mileage: mileageInt,
                    price: priceFloat,
                    registration,
                    status,
                    images: { set: images },
                    Agency: {
                        connect: {
                            name: agency,
                        },
                    },
                },
                include: { Agency: true }, // Include Agence object in the response
            });
            res.json(newVoiture);
        }
        if (method === "GET") {
            if (req.query?.id) {
                const voitureId = req.query.id;
                const voiture = await prisma.car.findUnique({
                    where: { id: Number(voitureId) },
                    include: { Agency: true },
                });

                if (!voiture || voiture.Agency.name !== agency) {
                    return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir cette voiture." });
                }

                res.json(voiture);
            } else {
                const voitures = await prisma.car.findMany({
                    where: { Agency: { name: agency } },
                    include: { Agency: true },
                });

                res.json(voitures);
            }
        }

        if (method === "PUT") {
            const {
                brand,
                model,
                year,
                mileage,
                price,
                registration,
                status,
                images,
                id,
            } = req.body;
            const yearInt = parseInt(year);
            const mileageInt = parseInt(mileage);
            const priceFloat = parseFloat(price);

            const voiture = await prisma.car.findUnique({
                where: { id: Number(id) },
                include: { Agency: true }, // Include Agence object in the response
            });

            if (voiture.Agency.name !== agency) {
                return res
                    .status(403)
                    .json({ message: "Vous n'êtes pas autorisé à modifier cette voiture." });
            }

            const updatedCar = await prisma.car.update({
                where: { id: Number(id) },
                data: {
                    brand,
                    model,
                    year: yearInt,
                    mileage: mileageInt,
                    price: priceFloat,
                    registration,
                    status,
                    images: { set: images },
                },
                include: { Agency: true }, // Include Agence object in the response
            });

            res.json(updatedCar);
        }

        if (method === "DELETE") {
            if (req.query?.id) {
                const voitureId = req.query.id;
                const voiture = await prisma.car.findUnique({
                    where: { id: Number(voitureId) },
                    include: { Agency: true }, // Include Agence object in the response
                });

                if (voiture.Agency.name !== agency) {
                    return res
                        .status(403)
                        .json({ message: "Vous n'êtes pas autorisé à supprimer cette voiture." });
                }

                res.json(
                    await prisma.car.delete({
                        where: { id: Number(voitureId) },
                        include: { Agency: true }, // Include Agence object in the response
                    })
                );
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "Une erreur est survenue lors de l'interaction avec la base de données.",
            error: error.message,
        });
    }
}
