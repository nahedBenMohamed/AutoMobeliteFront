import Image from "next/image";
import React from "react";

import {IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

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
        />
        <Image
          src="/images/hero-big-car.png"
          alt="hero"
          width={700}
          height={450}
          className="absolute right-0 hidden lg:inline-block"
        />
        <div className="space-y-8 text-center lg:text-left md:max-w-lg">
          <div className="font-bold space-y-2">

              <h4 className="text-[2.0rem] leading-tight">
                RENTAL OF <span className="text-blue-600 ">CARS</span> DELIVER TO YOUR HOME
              </h4>
          </div>
          <div>
            <p className="text-custom-grey text-xl">
              We deliver and pick up your rental car at the address of your choice.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row text-white font-bold gap-6">
            {/*<Link href="#booking" className="bg-custom-blue flex items-center gap-2 justify-center py-4 px-4 lg:px-8 shadow-orange-bottom hover:shadow-orange-bottom-hov transition-all duration-300 ease-linear rounded border-2 border-custom-blue"
            >
              <span>Book Ride</span>
              <span className="text-xl">
                <AiFillCheckCircle />
              </span>
            </Link>
            <a
              href="#booking"
              className="bg-black flex items-center gap-2 justify-center py-4 px-4 lg:px-8 transition-all duration-300 ease-linear hover:bg-transparent hover:text-black rounded border-2 border-black"
            >
              <span>Learn More</span>
              <span className="text-xl">
                <IoIosArrowForward />
              </span>
            </a>*/}
          </div>
        </div>
        <Link href="#booking" className="absolute bottom-16 inset-x-1/2 text-3xl animate-bounce">
          <IoIosArrowDown />
        </Link>
      </div>
    </section>
  );
}

export default Hero;
