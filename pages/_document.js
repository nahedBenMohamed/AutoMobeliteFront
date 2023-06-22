import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";

export default function Document() {
    return (
        <Html lang="en" className="h-full bg-gray-100" >
            <Head>
                <Script src="/components/script"></Script>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            </Head>
            <body className="h-full">
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
