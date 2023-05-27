    'use client';


    import { usePathname } from 'next/navigation';
    import Button from '@mui/material/Button';
    import { Disclosure, Menu } from '@headlessui/react';
    import NotificationDropdown from "@/app/admin/component/AppBar/NotificationDropdown";
    import UserDropdown from "@/app/admin/component/AppBar/UserDropdown";
    import { useEffect, useState } from 'react';
    import Link from "next/link"

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard/home' },
        { name: 'Cars List', href: '/admin/dashboard/Cars' },
        { name: 'Client List', href: '/admin/dashboard/User' },
        { name: 'Reserve List', href: '/admin/dashboard/Reservation' }
    ];

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ');
    }

    export default function Navbar() {

        const [isClient, setIsClient] = useState(false);
        useEffect(() => {
            setIsClient(true);
        }, []);
        const pathname = usePathname();

        return (
            <Disclosure as="nav" className="bg-white shadow-sm">
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        className="text-gray-100"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            width="100%"
                                            height="100%"
                                            rx="16"
                                            fill="currentColor"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                                            fill="black"
                                        />
                                    </svg>
                                </div>
                                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                pathname === item.href
                                                    ? 'border-slate-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                            )}
                                            aria-current={pathname === item.href ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                {isClient && (
                                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                      <Menu as="div" className="relative ml-3">
                                          <Button color="inherit">
                                              <NotificationDropdown />
                                          </Button>
                                      </Menu>
                                      <Menu as="div" className="relative ml-3">
                                          <Button color="inherit">
                                              <UserDropdown />
                                          </Button>
                                      </Menu>
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            </Disclosure>
        );
    }
