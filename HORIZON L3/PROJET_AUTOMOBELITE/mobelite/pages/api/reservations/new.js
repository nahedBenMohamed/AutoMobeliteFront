import prisma from "@/lib/prisma";

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const { vehicleId, pickupDate, returnDate, paymentMethod } = req.body;

        // Vérifier si le véhicule existe
        const existingVehicle = await prisma.voiture.findUnique({
            where: {
                id: vehicleId,
            },
        });

        if (!existingVehicle) {
            return res.status(404).json({ error: 'Véhicule non trouvé.' });
        }

        // Calculer le total de la réservation en fonction des dates de début et de fin
        const total = calculateTotal(pickupDate, returnDate);

        // Créer la réservation dans la base de données
        const newReservation = await prisma.location.create({
            data: {
                utilisateurId: req.user.id, // Utilisateur actuellement authentifié
                voitureId: vehicleId,
                dateDeDebut: pickupDate,
                dateDeFin: returnDate,
                total: total,
                methodePaiement: paymentMethod,
            },
        });

        res.status(201).json(newReservation);
    } else {
        res.status(405).json({ error: 'Méthode non autorisée.' });
    }
}

// Fonction utilitaire pour calculer le total de la réservation en fonction des dates de début et de fin
function calculateTotal(pickupDate, returnDate) {
    // Calcul du total en fonction des dates de début et de fin
    // Ajoutez votre logique de calcul du total ici
    return 0; // Remplacez par le calcul réel du total
}
