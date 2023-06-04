import { logoutUser, validateToken } from '@/service/logoutService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await logoutUser(res);
  } else {
    return await validateToken(req, res);
  }
}
