import Image from "next/image";
import React from "react";

function QuickEasy() {
  const quickEasy = [
    {
      id: 1,
      img: "/images/home.png",
      title: "Delivery & pick-up 7/7",
      content:
        "We deliver and pick up your vehicle, at the time and address of your choice, 7days/7 ",
    },
    {
      id: 2,
      img: "/images/calendar.png",
      title: "Reservations can be modified",
      content:
        "Modify your reservation at any time, directly in your account. Even for a current rental.",
    },
    {
      id: 3,
      img: "/images/cash.png",
      title: "Free cancellation!",
      content:
        "Cancel your rental for free up to 24 hours before the start of the rental period.",
    },
  ];
  return (
    <section id="quick-easy">
      <div className="px-8 lg:px-28 py-16 text-center space-y-8 lg:space-y-16">
        <div className="font-bold space-y-2">
          <h3 className="text-xl">Plan your trip now</h3>
          <h1 className="text-5xl leading-tight">QUICK & EASY CAR RENTAL</h1>
        </div>
        <div className="grid grid-cols-fluid gap-8">
          {quickEasy.map((data) => (
            <div key={data.id} className="flex flex-col gap-3">
              <Image
                src={data.img}
                alt={data.title}
                width={70}
                height={40}
                className="m-auto"
              />
              <h1 className="font-bold text-2xl">{data.title}</h1>
              <p className="text-custom-grey px-4 lg:px-12">{data.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default QuickEasy;
