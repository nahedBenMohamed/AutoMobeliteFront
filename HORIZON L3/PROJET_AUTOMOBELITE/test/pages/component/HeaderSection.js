import React from 'react';
import Image from 'next/image';
import VehicleSearchForm from "@/pages/component/VehicleSearchForm";

const HeroSection = () => {
    return (
        <div className="mt-8 md:flex md:items-center">
            <div className="md:w-1/2 mx-auto text-center">
                <div className="lg:px-16 py-5 space-y-8  text-center  ">
                    <div className=" font-bold ">

                        <h4 className="text-[3.5rem] leading-tight">
                            RENTAL OF <span className="text-blue-600 ">CARS</span> DELIVER TO YOUR HOME
                        </h4>
                    </div>
                    <div>
                        <p className="text-custom-grey text-2xl">
                            We deliver and pick up your rental car at the address of your choice.
                        </p>
                    </div>
                </div>
            </div>

            <div className="md:w-1/2 md:ml-8">
                <Image
                    src="/car.png"
                    alt="Car"
                    width={1500}
                    height={600}
                    className="rounded-lg"
                />
            </div>
        </div>

    );
};

export default HeroSection;
