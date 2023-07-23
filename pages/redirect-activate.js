export default function Redirect() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg p-8 shadow-md">
                <>
                    <h1 className="text-2xl font-bold mb-4">Lien envoye</h1>
                    <p>Please check your inbox to reactivate your account</p>
                    <p>A validation link has been sent to your mailbox</p>
                    <button  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-8">
                        <a href="/authentification/login" className="uppercase">
                            login
                        </a>
                    </button>
                </>
            </div>
        </div>
    );
}