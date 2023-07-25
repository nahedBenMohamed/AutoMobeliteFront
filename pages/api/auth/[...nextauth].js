import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials";
import defaultMiddleware from "/middleware";

export default NextAuth({
    session: {
        strategy: "jwt",
    },
    use: [
        defaultMiddleware,
    ],
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const { email, password } = credentials;
                const user = await prisma.client.findUnique({
                    where: {
                        email,
                    },
                });
                if (!user) {
                    throw new Error("Invalid Email or Password");
                }
                // Check if the email has been verified
                if (!user.emailVerified) {
                    throw new Error( 'Your email has not been verified. Please check your inbox.');
                }

                // Verify if the user status is active
                if (user.status !== 'activate') {
                    throw new Error(  'Your account is deactivated please activate' );
                }
                const isPasswordMatched = await bcrypt.compare(password, user.password);
                if (!isPasswordMatched) {
                    throw new Error("Invalid Email or Password");
                }
                return user;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user){
                token.id = user.id;  // Ajoute l'id utilisateur au token lors de la connexion
                token.role = user.role;
                token.email = user.email;
                token.name = user.name;
                token.firstname = user.firstname;
                token.telephone = user.telephone;
                token.numPermis = user.numPermis;
                token.address = user.address;
                token.city = user.city;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;  // Ici, nous utilisons l'id du token au lieu de l'id utilisateur
            session.user.role = token.role;
            session.user.name = token.name;
            session.user.firstname = token.firstname;
            session.user.telephone = token.telephone;
            session.user.numPermis = token.numPermis;
            session.user.address = token.address;
            session.user.city = token.city;
            return session;
        }
    },
    pages: {
        signIn: "/authentification/login"
    },
    secret: process.env.NEXTAUTH_SECRET
})
