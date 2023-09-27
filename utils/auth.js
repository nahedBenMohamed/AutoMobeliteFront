import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export const getSession = (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) {
    return null;
  }
  // decode the token
  return jwt.verify(token, process.env.JWT_SECRET);
};
export const protectRoute = async (ctx, allowedRoles) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/authentification/login",
        permanent: false,
      },
    };
  }

  if (!allowedRoles.includes(session.role)) {
    let redirectPath = "/";

    // Determine the redirect path based on the user's role
    if (session.role === "superAdmin") {
      redirectPath = "/super-admin/auth/login";
    } else if (session.role === "admin") {
      redirectPath = "/admin/auth/login";
    }

    return {
      redirect: {
        destination: redirectPath,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
