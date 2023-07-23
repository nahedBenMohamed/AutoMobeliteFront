import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default function ValidatePage({ isValidated, message }) {

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg p-8 shadow-md">
                {isValidated ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Compte reactiver</h1>
                        <p>Votre compte a été reactiver avec succès.</p>
                        <button  className="bg-blue-500 text-white px-4 py-2 rounded mt-8">
                            <a href="/authentification/login">
                                Se connecter
                            </a>
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Reactivation du compte a échouée</h1>
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
            throw new Error("Ce lien a déjà été utilisé pour activer un compte");
        }

        if (client.status === "activate") {
            throw new Error("Ce lien a déjà été utilisé pour activer un compte");
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
