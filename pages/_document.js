import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";

export default function Document() {
    return (
        <Html lang="en" className="bg-gray-100">
            <Head>
                <Script src="/components/script"></Script>
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
