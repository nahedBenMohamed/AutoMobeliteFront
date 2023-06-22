import Image from "next/image";
import React from "react";
import Link from "next/link";
import CustomButton from "@/components/client/CustomButton";

function QuickEasy(){
    const handleScroll =()=>{

    }
    const quickEasy = [
        {
            id: 1,
            img: "/images/laptop-screen.png",
            title: "Book online",
            content:
                "Book a vehicle to suit your needs in just 5 minutes.Be ready "
        },
        {
            id: 2,
            img: "/images/delivery1.png",
            title: "I'll have it delivered",
            content:
                "Your vehicle is delivered by a driver at the time and address of your choice..",
        },
        {
            id: 3,
            img: "/images/internet.png",
            title: "I'm on my way home",
            content:
                "On your return, a driver will meet you at the address indicated to collect the vehicle.",
        },
    ];
    return(
        <section id="quick-easy">
            <div className="px-8 lg:px-28 py-16 text-center space-y-8 lg:space-y-16">
                <div className="font-bold space-y-2">
                    <h1 className="text-5xl leading-tight">HOW IT WORKS ?</h1>
                </div>
                <div className="grid grid-cols-fluid gap-8">
                    {quickEasy.map((data) => (
                        <div key={data.id} className="flex flex-col gap-3">
                            <Image
                                src={data.img}
                                alt={data.title}
                                width={90}
                                height={40}
                                className="m-auto"
                            />
                            <h1 className="font-bold text-2xl">{data.title}</h1>
                            <p className="text-custom-grey px-4 lg:px-12">{data.content}</p>
                        </div>
                    ))}
                </div>
              {/*  <div className="flex justify-center">
                    <Link href="/">
                        <CustomButton
                            title="Explore Cars"
                            containerStyles="bg-primary-blue text-white rounded-full mt-10"
                            handleClick={handleScroll}
                        />
                    </Link>
                </div>*/}
            </div>


        </section>

    );
}
export default QuickEasy