import Link from "next/link";

import CustomButton from "./CustomButton";

function NavBar () {
    return(
        <header className='w-full  absolute z-10'>
            <nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4 bg-transparent'>
                <Link href="/" className="text-2xl justify-center items-center">
                    AUTO<span className="text-blue-600">MOBELITE</span>
                </Link>

                <div className="flex space-x-4">
                    <CustomButton
                        title="Sign in"
                        btnType="button"
                        containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
                    />
                    <CustomButton
                        title="Register"
                        btnType="button"
                        containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
                    />
                </div>
            </nav>
        </header>
    )

        ;
}



export default NavBar;
