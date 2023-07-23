import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";

export default function Document() {
    return (
        <Html lang="en" >
            <Head>
                <Script src="/components/script"></Script>
            </Head>
            <body className="bg-gray-50">
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
