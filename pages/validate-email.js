import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default function ValidatePage({ isValidated, message }) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg p-8 shadow-md">
                {isValidated ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Email validated</h1>
                        <p>Your email has been successfully validated.</p>
                        <button  className="bg-blue-500 text-white px-4 py-2 rounded mt-8">
                            <a href="/authentification/login" className="uppercase">
                              login
                            </a>
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Email validation failed</h1>
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
                    message: "This link has already been used to activate an account"
                },
            };
        }

        if (client.emailVerified) {
            return {
                props: {
                    isValidated: false,
                    message: "The account has already been validated."
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
                status:"activate",
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
                message: "This link has expired"
            },
        };
    }
}
