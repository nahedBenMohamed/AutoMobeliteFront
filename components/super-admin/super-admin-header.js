import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { protectRoute } from '@/utils/auth';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/super-admin/dashboard/home' },
    { name: 'Cars', href: '/super-admin/dashboard/cars'},
    { name: 'Users', href: '/super-admin/dashboard/users'},
    { name: 'Profile', href: '/super-admin/dashboard/profile'},
    { name: 'Agences', href: '/super-admin/dashboard/agence' },
    { name: 'Parking', href: '/super-admin/dashboard/parking' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function DashboardHeader() {
    const router = useRouter();
    const [currentLink, setCurrentLink] = useState('');

    useEffect(() => {
        setCurrentLink(router.pathname);
    }, [router.pathname]);

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
        <>
            <div className="min-w-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img className="h-10 w-10" src="/mobelite.png" alt="mobelite" />
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        className={classNames(
                                                            currentLink === item.href
                                                                ? 'bg-gray-900 text-white'
                                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                            'rounded-md px-3 py-2 text-sm font-medium'
                                                        )}
                                                        aria-current={currentLink === item.href ? 'page' : undefined}
                                                        onClick={() => setCurrentLink(item.href)}
                                                    >
                                                        {item.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {/* SuperAdminProfile dropdown */}
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="bg-none color-white block px-4 py-2 text-sm text-gray-700"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            id="Outline"
                                                            viewBox="0 0 24 24"
                                                            width="25"
                                                            height="25"
                                                        >
                                                            <path d="M22.829,9.172,18.95,5.293a1,1,0,0,0-1.414,1.414l3.879,3.879a2.057,2.057,0,0,1,.3.39c-.015,0-.027-.008-.042-.008h0L5.989,11a1,1,0,0,0,0,2h0l15.678-.032c.028,0,.051-.014.078-.016a2,2,0,0,1-.334.462l-3.879,3.879a1,1,0,1,0,1.414,1.414l3.879-3.879a4,4,0,0,0,0-5.656Z" />
                                                            <path d="M7,22H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7A1,1,0,0,0,7,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7a1,1,0,0,0,0-2Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(
                                                currentLink === item.href
                                                    ? 'bg-gray-900 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'block rounded-md px-3 py-2 text-base font-medium'
                                            )}
                                            aria-current={currentLink === item.href ? 'page' : undefined}
                                            onClick={() => setCurrentLink(item.href)}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pb-3 pt-4">
                                    <div>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-none color-white block px-4 py-2 text-sm text-gray-700"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                id="Outline"
                                                viewBox="0 0 24 24"
                                                width="25"
                                                height="25"
                                            >
                                                <path d="M22.829,9.172,18.95,5.293a1,1,0,0,0-1.414,1.414l3.879,3.879a2.057,2.057,0,0,1,.3.39c-.015,0-.027-.008-.042-.008h0L5.989,11a1,1,0,0,0,0,2h0l15.678-.032c.028,0,.051-.014.078-.016a2,2,0,0,1-.334.462l-3.879,3.879a1,1,0,1,0,1.414,1.414l3.879-3.879a4,4,0,0,0,0-5.656Z" />
                                                <path d="M7,22H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7A1,1,0,0,0,7,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7a1,1,0,0,0,0-2Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </>
    );
}

export default DashboardHeader;

export const getServerSideProps = (ctx) => {
    return protectRoute(ctx, ['superAdmin']);
};
