import React from 'react';
import Link from 'next/link';

const ImageBox = () => {
    const images = [
        {
            src: '/images/sousse.png',
            alt: 'Image 1',
            description: 'Sousse',
        },
        {
            src: '/images/tunis.png',
            alt: 'Image 2',
            description: 'Tunis',
        },
        {
            src: '/images/Nabeul.png',
            alt: 'Image 3',
            description: 'Nabeul',

        },
    ];

    return (
        <section id="models-main">
            <h1 className="text-5xl leading-tight text-center font-bold">WHERE CAN WE DELIVER?</h1>
            <div className="py-8 px-8 lg:px-48 lg:py-16 my-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {images.map((image, index) => (
                        <div href={image} key={index}>
                            <div className="relative">
                                <div className="border border-lighter-grey bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                                    <div className="image1-container">
                                        <img src={image.src} alt="" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-75 text-white">
                                        <h1 className="font-bold text-lg lg:text-xl">
                                            {image.description}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImageBox;
