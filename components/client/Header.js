import Link from "next/link";

import {AiOutlineMenu} from "react-icons/ai";
import {useTogglersContext} from "@/components/context/togglers";


function Header () {
    const { setMobileNavbar } = useTogglersContext();
    return(
        <header className='w-full  absolute z-10'>
            <nav className='max-w-[1740px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent'>
                <Link href="/" className="text-2xl justify-center items-center">
                    AUTO<span className="text-blue-600">MOBELITE</span>
                </Link>

                <div className="hidden lg:flex items-center text-black gap-4 font-medium">
                    <button className="hover:text-blue-600 transition-all duration-300 ease-linear">
                        <Link href="/authentification/login">
                            Sign In
                        </Link>
                    </button>
                    <button className="hover:text-blue-600 bg-white py-3 px-7 text-black rounded-full">
                        <Link href="/authentification/register">Register</Link>
                    </button>

                </div>
                <div className="lg:hidden">
                    <button
                        className="text-3xl transition-all duration-300 ease-linear hover:text-custom-blue"
                        onClick={() => setMobileNavbar(true)}
                    >
                        <AiOutlineMenu />
                    </button>
                </div>
            </nav>
        </header>
    )

        ;
}



export default Header;