import {createUser} from "@/service/userService";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, firstName,email, password, role } = req.body;

        // Vérification des données requises
        if (!name || !firstName || !email || !password || !role) {
            return res.status(400).json({ message: 'Veuillez fournir tous les champs requis.' });
        }

        try {
            const newUser = await createUser(name, firstName, email, password, role);
            return res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
        }
    } else {
        res.status(405).json({ message: 'Méthode non autorisée.' });
    }
}
