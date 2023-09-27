import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default function ValidatePage({ isValidated, message }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg p-8 shadow-md">
        {isValidated ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Reactivate Account</h1>
            <p>Your account has been successfully reactivated.</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-8 uppercase">
              <a href="/authentification/login">Login</a>
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Account reactivation failed
            </h1>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.query;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const clientId = decodedToken.clientId;

    let client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client) {
      throw new Error("This link has already been used to activate an account");
    }

    if (client.status === "activate") {
      throw new Error("This link has already been used to activate an account");
    }

    // Mettre à jour le statut du compte dans la base de données
    client = await prisma.client.update({
      where: {
        id: clientId,
      },
      data: {
        status: "activate",
      },
    });

    return {
      props: {
        isValidated: true,
      },
    };
  } catch (error) {
    return {
      props: {
        isValidated: false,
        message: error.message,
      },
    };
  }
}
