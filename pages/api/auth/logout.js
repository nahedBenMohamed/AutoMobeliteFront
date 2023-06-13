import { setCookie } from 'nookies';

export default function handle(req, res) {
    setCookie({ res }, 'token', '', {
        maxAge: -1,
        path: '/',
    });

    res.status(200).json({ message: 'Déconnexion réussie.' });
}
