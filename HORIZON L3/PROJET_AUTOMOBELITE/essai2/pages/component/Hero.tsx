import React from 'react';
import {CustomButton} from "@/pages/component/index";
import Image from "next/image";

const Hero = () => {
    const handleScroll =()=>{

    }
    return (
        <div className="hero">
            <div className="flex-1 pt-32 padding-x">
                <h1 className="hero__title">
                    RENTAL OF <span className="text-blue-600 ">CARS</span> DELIVER TO YOUR HOME
                </h1>
                <p className="hero__subtitle">
                    We deliver and pick up your rental car at the address of your choice.
                </p>

                <CustomButton
                    title="Explore Cars"
                    containerStyles="bg-primary-blue text-white rounded-full mt-10"
                    handleClick={handleScroll}
                />
            </div>
            <div className="hero__image-container">
                <div className="hero__image">
                    <Image
                        src="/hero.png"
                        alt="hero"
                        fill className="object-contain" />
                </div>

                <div className="hero__image-overlay" />
            </div>
        </div>
    );
};

export default Hero;