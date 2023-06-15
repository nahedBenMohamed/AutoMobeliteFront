import React from 'react';
import Link from 'next/link';

const ImageBox = () => {
    const images = [
        {
            src: '/images/hero.png',
            alt: 'Image 1',
            description: 'Description de l\'image 1',
            link: '/vehicules',
        },
        {
            src: '/images/hero.png',
            alt: 'Image 2',
            description: 'Description de l\'image 2',
            link: '/vehicules',
        },
        {
            src: '/images/hero.png',
            alt: 'Image 3',
            description: 'Description de l\'image 3',
            link: '/vehicules',
        },
        {
            src: '/images/hero.png',
            alt: 'Image 4',
            description: 'Description de l\'image 4',
            link: '/vehicules',
        },
    ];

    return (
        <div className="flex justify-center space-x-4">
            {images.map((image, index) => (
                <div className="image-box border border-lighter-grey bg-gray-200 rounded p-4" key={index}>
                    <img src={image.src} alt={image.alt} className="w-40 h-auto mx-auto mb-4" />
                    <p className="text-center">{image.description}</p>
                    <Link href={image.link}>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500">Voir plus de véhicules</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ImageBox;
