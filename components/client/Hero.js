import React from 'react';
import Image from 'next/image';
import CustomButton from "@/components/client/CustomButton";
import Link from "next/link";
import { motion } from 'framer-motion';
import SearchBarr from "@/components/client/SearchBarr";
import styles from '../../styles/SearchBarr.module.css';


const Hero = () => {
    const handleScroll =()=>{

    }

    // Définir les variants pour les animations
    const container = {
        hidden: { opacity: 0, y: '-20vh' },
        show: {
            opacity: 1,
            y: 2,
            transition: {
                staggerChildren: 1.5,
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: '-30vh' },
        show: { opacity: 3, y: 0 },
    }

    const image = {
        hidden: { scale: 1.0 },
        show: { scale: 1},
    }

    return (
        <div className="hero">
            <motion.div className=" flex-1 pt-32 padding-x"
                        variants={container}
                        initial="hidden"
                        animate="show"
            >
                <motion.h1 className="hero__title" variants={item}>
                    RENTAL OF <span className="text-blue-600 ">CARS</span> DELIVER TO YOUR HOME
                </motion.h1>
                <motion.p className="hero__subtitle" variants={item}>
                    We deliver and pick up your rental car at the address of your choice.
                </motion.p>

                <motion.div className="-mt-2" variants={item}>
                    <Link href="/Models">
                        <CustomButton
                            title="Explore Cars"
                            containerStyles="bg-primary-blue text-white rounded-full mt-10"
                            handleClick={handleScroll}
                        />
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div className="hero__image-container" variants={image}>
                <div className="hero__image">
                    <Image
                        src="/images/hero.png"
                        alt="hero"
                        layout='fill'
                        className="object-contain"
                    />
                </div>

                <div className="hero__image-overlay" />
            </motion.div>


            {/* Ajout des styles pour masquer l'arrière-plan en mode mobile */}
            <style jsx>{`
              @media (max-width: 410px) {
                .hero__image {
                  display: none;
                }
              }
            `}</style>
            {/*<div className={styles.searchBar}>*/}
            {/*    <SearchBarr />*/}
            {/*</div>*/}
        </div>

    );
};

export default Hero;
