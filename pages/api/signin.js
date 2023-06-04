import { authenticateUser, validateToken, redirectToAdminDashboard, redirectToHomeConnected } from '@/service/loginService';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return await authenticateUser(req, res);
    } else {
        return await validateToken(req, res, redirectToAdminDashboard, redirectToHomeConnected);
    }
}
