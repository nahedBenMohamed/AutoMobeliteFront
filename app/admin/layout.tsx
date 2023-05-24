import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Poppins } from 'next/font/google';



export const metadata = {
    title: 'Automobelite Dashboard',
    description:
        'A user admin dashboard configured with Next.js'
};

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-rubik",
});

export default async function RootLayout({
    children
 }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={`${poppins.className} bg-custom-white`}>
        {children}
        <Analytics />
        </body>
        </html>
    );
}
