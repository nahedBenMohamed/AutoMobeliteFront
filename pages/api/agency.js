import { addAgency } from "@/service/agencyService";


export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, email, tel, location } = req.body;

        try {
            const agency = await addAgency(name, email, tel, location);
            res.status(201).json({ agency });
        } catch (error) {
            res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout de l'agence." });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée" });
    }
}
