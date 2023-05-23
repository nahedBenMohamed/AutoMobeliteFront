import './globals.css';
import { Analytics } from '@vercel/analytics/react';



export const metadata = {
    title: 'Automobelite Dashboard',
    description:
        'A user admin dashboard configured with Next.js'
};

export default async function RootLayout({
    children
 }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full bg-gray-50">
        <body className="h-full">
        {children}
        <Analytics />
        </body>
        </html>
    );
}
