import Image from "next/image";
import React from "react";
/*import { IoIosArrowDown } from "react-icons/io";*/
import {ArrowDown} from 'mdi-material-ui';
import Link from "next/link";

function HeroHome() {
    return (
        <section id="hero">
            <div className="px-8 lg:px-28 py-12 lg:py-0 h-screen flex items-center relative">
                <Image
                    src="/images/home-hero-bg.png"
                    alt="hero"
                    width={680}
                    height={870}
                    className="absolute inset-y-0 right-0 -z-10 hidden lg:inline-block"
                />
                <Image
                    src="/images/hero-big-car.png"
                    alt="hero"
                    width={800}
                    height={450}
                    className="absolute right-0 hidden lg:inline-block"
                />
                <div className="space-y-8 text-center lg:text-left lg:max-w-lg">
                    <div className="font-bold space-y-2">
                        <h1 className="text-[2.9rem] leading-tight">
                            RENTAL OF <span className="text-blue-600 ">CARS</span> DELIVER TO YOUR HOME
                        </h1>
                    </div>
                    <div>
                        <p className="text-custom-grey text-xl">
                            We deliver and pick up your rental car at the address of your choice.
                        </p>
                    </div>
                    <div className="flex flex-col lg:flex-row text-white font-bold gap-6">

                    </div>
                </div>
                {/*il faut verifier ici il y'a une erreur dans l'url*/}
                {/*J'ai preferé le mettre en commentaire pour  l'instant */}

               {/* <Link href="/app/front-end/component/Booking" className="absolute bottom-16 inset-x-1/2 text-3xl animate-bounce">
                    <ArrowDown />
                </Link>*/}
            </div>
        </section>
    );
}

export default HeroHome;