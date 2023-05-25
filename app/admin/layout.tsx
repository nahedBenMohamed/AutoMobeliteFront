import "./globals.css";
import { Poppins } from "next/font/google";

export const metadata = {
    title: "AutoMobelite Dashboard",
    description:
        "An online platform",
};

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-rubik",
});

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={`${poppins.className} bg-custom-white`}>{children}</body>
        </html>
    );
}

export default RootLayout;
