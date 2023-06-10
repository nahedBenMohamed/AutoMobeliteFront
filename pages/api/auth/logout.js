import { destroyCookie } from 'nookies';

export default async function handle(req, res) {
    try {
        // Supprimer le cookie d'authentification
        destroyCookie({ res }, 'authToken');

        // Envoyer une réponse de succès
        res.status(200).json({ message: 'Déconnexion réussie.' });
    } catch (error) {
        // Gérer les erreurs en cas d'échec de la déconnexion
        res.status(500).json({ error: 'Une erreur s\'est produite lors de la déconnexion.' });
    }
}
