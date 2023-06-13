// pages/someProtectedPage.js
import { useRouter } from 'next/router';
import {protectRoute} from "@/utils/auth";

export default function SomeProtectedPage({ session }) {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
        });

        if (res.ok) {
            await router.push('/authentification/login');
        } else {
            // handle error
        }
    };

    return (
        <div>
            Bienvenue, {session.name}. Vous êtes responsable de l'agence {session.agenceName}.
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    );

}

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['admin', 'superAdmin']);
};
