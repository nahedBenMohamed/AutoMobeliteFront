import React from "react";
import Link from "next/link";
import { AiFillCar, AiFillStar, AiFillTool } from "react-icons/ai";
import { GiCarDoor } from "react-icons/gi";
import { BsFillFuelPumpFill } from "react-icons/bs";
import CustomButton from "@/components/client/CustomButton";

const ImageBox = () => {
  const handleScroll = () => {};
  const images = [
    {
      src: "/images/box-VW Passat CC.png",
      alt: "Image 1",
      description: "Volkswagen",
      link: "/Models",
    },
    {
      src: "/images/box-VW Golf 6.png",
      alt: "Image 2",
      description: "Volkswagen",
      link: "/Models",
    },
    {
      src: "/images/box-Toyota Camry.png",
      alt: "Image 3",
      description: "Nissan Patrol",
      link: "/Models",
    },
  ];

  return (
    <section id="models-main">
      <h1 className="text-5xl leading-tight text-center font-bold">
        A VEHICLE FOR EVERY NEED
      </h1>
      <div className="py-8 px-8 lg:px-48 lg:py-16 my-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <Link href={image.link} key={index}>
              <div className="relative">
                <div className="border border-lighter-grey bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                  <div className="image-container">
                    <img src={image.src} alt="" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-75 text-white">
                    <h1 className="font-bold text-lg lg:text-xl">
                      {image.description}
                    </h1>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/Models">
            <CustomButton
              title="Explore more  Cars"
              containerStyles="bg-primary-blue text-white rounded-full mt-10"
              handleClick={handleScroll}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ImageBox;
