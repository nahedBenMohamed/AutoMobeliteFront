import { setCookie } from "nookies";

export default function handle(req, res) {
  // Clear the 'token' cookie by setting an empty value and negative maxAge
  setCookie({ res }, "token", "", {
    maxAge: -1, // Set the maxAge to -1 to expire the cookie immediately
    path: "/", // Set the path of the cookie to '/'
  });

  // Send a successful response indicating successful logout
  res.status(200).json({ message: "Logout successful." });
}