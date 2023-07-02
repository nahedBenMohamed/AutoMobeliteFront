import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    return (
        <section id="models-main">
            <h1 className="text-5xl leading-tight text-center font-bold">WHERE CAN WE DELIVER?</h1>
            <div
                ref={ref}
                className="py-8 px-8 lg:px-48 lg:py-16 my-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
                transition={{ duration: 0.8 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {images.map((image, index) => (
                        <div href={image} key={index}>
                            <div className="relative">
                                <div className="border border-lighter-grey bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                                    <div className="image1-container">
                                        <motion.img
                                            src={image.src}
                                            alt={image.alt}
                                            whileHover={{ scale: 0.9 }}
                                            whileTap={{ scale: 1.0 }}
                                        />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-75 text-white">
                                        <h1 className="font-bold text-lg lg:text-xl">{image.description}</h1>
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
