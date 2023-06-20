import React from 'react';
import Image from 'next/image';
import CustomButton from "@/components/client/CustomButton";
import Link from "next/link";


const Hero = () => {
    const handleScroll =()=>{

    }
    return (
        <div className="hero">
            <div className=" flex-1 pt-32 padding-x">
                <h1 className="hero__title  ">
                    RENTAL OF <span className="text-blue-600 ">CARS</span> DELIVER TO YOUR HOME
                </h1>
                <p className="hero__subtitle ">
                    We deliver and pick up your rental car at the address of your choice.
                </p>

                <div className="-mt-2">
                    <Link href="/Models">
                    <CustomButton
                        title="Explore Cars"
                        containerStyles="bg-primary-blue text-white rounded-full mt-10"
                        handleClick={handleScroll}
                    />
                    </Link>
                </div>


            </div>
            <div className="hero__image-container">
                <div className="hero__image">
                    <Image
                        src="/images/hero.png"
                        alt="hero"
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="hero__image-overlay" />
            </div>

            {/* Ajout des styles pour masquer l'arrière-plan en mode mobile */}
            <style jsx>{`
                @media (max-width: 410px) {
                    .hero__image {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Hero;
