import React from 'react';
import { carDetails } from "../data/content";
import Image from "next/image";
import {  CarDoor, Car, Tools, GasStation,Star } from 'mdi-material-ui';
import Link from 'next/link';

function Modelsconnected() {
  return (
    <section id='models-main'>
      <div className='py-8 px-8 lg:px-48 lg:py-16 my-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {carDetails.map((data) => (
            <div key={data.id} className='border border-lighter-grey bg-white rounded'>
              <div><Image src={`/images/box-${data.car}.png`} alt={data.car}
                          width={400}
                          height={600}
                          className='w-full h-full lg:h-60 object-cover rounded-t' />
              </div>
              <div className='p-6 space-y-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <div>
                      <h1 className='font-bold text-xl lg:text-2xl'>{data.car}</h1>
                    </div>
                    <div className='text-[#ffc933] flex items-center'>
                      <span><Star /></span>
                      <span><Star /></span>
                      <span><Star /></span>
                      <span><Star /></span>
                      <span><Star /></span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <h1 className='font-bold text-xl lg:text-2xl'>${data.price}</h1>
                    <p className='text-custom-grey'>per day</p>
                  </div>
                </div>
                <div className='flex items-center justify-between text-lg'>
                  <div className='flex items-center gap-2'>
                    <span><Car /></span>
                    <span>{data.model}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span>{data.doors}</span>
                    <span><CarDoor /></span>
                  </div>
                </div>
                <div className='flex items-center justify-between text-lg'>
                  <div className='flex items-center gap-2'>
                    <span><Tools /></span>
                    <span>{data.transmission}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span>{data.fuel}</span>
                    <span><GasStation /></span>
                  </div>
                </div>
                <div>
                  <hr className='border border-lighter-grey' />
                </div>
                <div>
                  <Link href={'/authentification/Login'}
                        className='block text-center bg-blue-600 p-3 font-bold text-white rounded  w-full'>
                    Book Ride
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Modelsconnected;
