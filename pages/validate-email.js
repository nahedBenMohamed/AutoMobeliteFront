import Link from "next/link";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default function ValidatePage({ isValidated, message }) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg p-8 shadow-md">
                {isValidated ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Email validé</h1>
                        <p>Votre email a été validé avec succès.</p>
                        <button  className="bg-blue-500 text-white px-4 py-2 rounded mt-8">
                            <a href="/authentification/login">
                                Se connecter
                            </a>
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Validation d'email échouée</h1>
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

        // Vérifier si le token a déjà été utilisé pour valider un compte
        const client = await prisma.client.findUnique({
            where: {
                id: clientId,
            },
        });

        if (!client) {
            return {
                props: {
                    isValidated: false,
                    message: "Ce lien a deja ete utilise pour activer un compte"
                },
            };
        }

        if (client.emailVerified) {
            return {
                props: {
                    isValidated: false,
                    message: "Le compte a déjà été validé."
                },
            };
        }

        // Mettre à jour le statut de validation du compte dans la base de données
        await prisma.client.update({
            where: {
                id: clientId,
            },
            data: {
                emailVerified: true,
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
                message: "Ce lien a expire."
            },
        };
    }
}
