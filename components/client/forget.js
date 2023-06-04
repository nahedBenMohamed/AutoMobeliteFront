import React, { useState } from 'react';
import { HiMail } from 'react-icons/hi';
import axios from 'axios';

const ForgetPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Effectuer une requête à ton API pour envoyer l'e-mail de réinitialisation
            const response = await axios.post('/api/reset-password', { email });

            // Gérer le cas de succès (e-mail envoyé avec succès)
            console.log(response.data);
            setSuccess(true);
        } catch (error) {
            // Gérer les erreurs lors de l'envoi de l'e-mail
            console.error(error);
            setError('Une erreur s\'est produite lors de l\'envoi de l\'e-mail');
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-4 bg-white rounded-md shadow-md lg:max-w-xl">
                <p className="mt-1 text-center text-xl font-normal leading-9 tracking-tight text-gray-900">
                    Indiquez ci-dessous l'adresse e-mail que vous utilisez pour vous connecter à votre compte https://www.automobelite.tn.
                    Vous recevrez un email vous indiquant la marche à suivre afin de réinitialiser votre mot de passe.
                </p>
                <div className=" mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {!success ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Adresse e-mail
                                </label>
                                <div className="mt-2">
                                    <div className="relative">
                                        <HiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={handleEmailChange}
                                            className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <button
                                        type="submit"
                                        className="mt-8 w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Réinitialiser le mot de passe
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <p className="text-center">Un e-mail de réinitialisation a été envoyé à l'adresse {email}.</p>
                    )}
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Vous avez déjà un compte ?{' '}
                        <a href="/authentification/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Connectez-vous
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPage;
