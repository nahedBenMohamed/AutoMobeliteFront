import Image from "next/image";
import React from "react";

function Hero() {
    return (
        <section id="hero">
            <div className="px-8 lg:px-28 py-12 lg:py-0 h-screen flex items-center relative">
                <Image
                    src="/images/home-hero-bg.png"
                    alt="hero"
                    width={680}
                    height={870}
                    className="absolute inset-y-0 right-0 -z-10 hidden lg:inline-block"
                    style={{ width: '40%', height: 'auto' }} // Utilisation d'un style inline pour rendre l'image flexible
                />
                <Image
                    src="/images/hero-big-car.png"
                    alt="hero"
                    width={740}
                    height={450}
                    className="absolute right-0 hidden lg:inline-block"
                    style={{ width: '52%', height: 'auto' }} // Utilisation d'un style inline pour rendre l'image flexible
                />
                <div className="space-y-8 text-center lg:text-left md:max-w-lg">
                    <div className="font-bold space-y-2">

                        <h4 className="text-[3.4rem] leading-tight">
                            RENTAL OF <span className="text-blue-600 ">CARS</span> DELIVER TO YOUR HOME
                        </h4>
                    </div>
                    <div>
                        <p className="text-custom-grey text-2xl">
                            We deliver and pick up your rental car at the address of your choice.
                        </p>
                    </div>
                    <div className="flex flex-col lg:flex-row text-white font-bold gap-6">
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
