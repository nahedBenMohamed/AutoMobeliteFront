import jwt from 'jsonwebtoken';

export async function logoutUser(res) {
    // Effacement du cookie contenant le jeton d'accès
    res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0');

    return res.status(200).json({ message: 'Déconnexion réussie' });
}

export async function validateToken(req, res) {
    // Vérification de la présence du jeton d'accès dans les cookies
    const token = req.cookies.token;

    try {
        // Vérification et validation du jeton JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // L'extraction des informations pertinentes à partir du jeton (par exemple, l'identifiant de l'utilisateur)
        const userId = decoded.userId;

        // Effectuer d'autres opérations nécessaires lors de la déconnexion, par exemple, mettre à jour l'état de connexion de l'utilisateur dans la base de données.

        // Effacement du cookie contenant le jeton d'accès
        res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0');

        return res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        // L'utilisateur n'est pas authentifié, donc pas besoin de déconnexion
        return res.status(200).json({ message: 'Accès non autorisé. Veuillez vous connecter.' });
    }
}
