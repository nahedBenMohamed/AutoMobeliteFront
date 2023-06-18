import React from 'react';
import Link from 'next/link';
import { AiFillCar, AiFillStar, AiFillTool } from 'react-icons/ai';
import { GiCarDoor } from 'react-icons/gi';
import { BsFillFuelPumpFill } from 'react-icons/bs';

const ImageBox = () => {
    const images = [
        {
            src: '/images/box-VW Passat CC.png',
            alt: 'Image 1',
            description: 'Description de l\'image 1',
            link: '/vehicules',
        },
        {
            src: '/images/box-VW Golf 6.png',
            alt: 'Image 2',
            description: 'Description de l\'image 2',
            link: '/vehicules',
        },
        {
            src: '/images/box-Toyota Camry.png',
            alt: 'Image 3',
            description: 'Description de l\'image 3',
            link: '/vehicules',
        },
    ];

    return (
        <section id="models-main">
            <h1 className="text-5xl leading-tight text-center font-bold">A VEHICLE FOR EVERY NEED</h1>
            <div className="py-8 px-8 lg:px-48 lg:py-16 my-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {images.map((image, index) => (
                        <Link href={image.link} key={index}>
                            <div className="border border-lighter-grey bg-gray-100 rounded-lg shadow-lg">
                                <div className="image-container">
                                    <img src={image.src} alt="" />
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div>
                                                <h1 className="font-bold text-xl lg:text-2xl">
                                                    {image.description}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImageBox;
