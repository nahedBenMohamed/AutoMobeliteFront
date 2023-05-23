import React, { useEffect } from "react";
import { useTogglersContext } from "../context/togglers";
import { useInputValueContext } from "../context/inputValue";
import Image from "next/image";
import { personalInfo } from "../data/input";
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function BookingModal() {
  const { bookingModal, setBookingModal, bookingFields, setBookingFields } =
    useTogglersContext();
  const { bookingSelect, bookingDate, clearBookingInputs } =
    useInputValueContext();

  useEffect(() => {
    document.body.style.overflowY = bookingModal ? "hidden" : "auto";
  }, [bookingModal]);

  if (!bookingModal) return null;

  return (
    <section id="booking-modal">
      <div className="bg-black/70 fixed inset-0 z-40">
        <div className="absolute bg-white inset-y-0 inset-x-0 lg:inset-y-16 lg:inset-x-80 z-50 overflow-y-auto">
          <div className="bg-blue-600 flex items-center justify-between text-white text-2xl p-4 font-bold">
            <h1>COMPLETE THE BOOKING</h1>
            <button onClick={() => setBookingModal(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="bg-blue-600 p-4 space-y-4">
            <div className="text-black flex items-center gap-2">
              <span className="text-2xl">
                <InfoIcon />
              </span>
              <span className="font-bold lg:text-xl">
                Please complete this reservation form:
              </span>
            </div>
            <div>
              <p className="text-custom-black font-medium">
                A toll-free telephone number for customer support.
              </p>
            </div>
          </div>
          <div className="text-center lg:text-left px-8 py-10 flex flex-col gap-12 lg:flex-row lg:justify-between">
            <div className="space-y-6">
              <div>
                <h1 className="text-blue-600 font-bold text-lg">
                  Location & date
                </h1>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-lg">
                    <EventIcon />
                  </span>
                  <h3 className="font-bold">Date and time of pick-up</h3>
                </div>
                <div>
                  <span className="flex items-center justify-center gap-2 text-custom-grey">
                    <p>{bookingDate["pickup-date"]} / </p>
                    <input
                      type="time"
                      className="border border-lightest-grey rounded text-sm px-2 text-center bg-transparent w-fit"
                    />
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-lg">
                    <EventIcon />
                  </span>
                  <h3 className="font-bold">Date and time of delivery</h3>
                </div>
                <div>
                  <span className="flex items-center justify-center gap-2 text-custom-grey">
                    <p>{bookingDate["dropof-date"]} / </p>
                    <input
                      type="time"
                      className="border border-lightest-grey rounded text-sm px-2 text-center bg-transparent w-fit"
                    />
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-lg">
                    <LocationOnIcon />
                  </span>
                  <h3 className="font-bold">Place of support</h3>
                </div>
                <div>
                  <p className="text-custom-grey">
                    {bookingSelect["pickup-location"]}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <span className="text-lg">
                    <LocationOnIcon />
                  </span>
                  <h3 className="font-bold">Delivery location</h3>
                </div>
                <div>
                  <p className="text-custom-grey">
                    {bookingSelect["dropof-location"]}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">
                    Car -{" "}
                    <span className="text-blue-600">
                      {bookingSelect["car-type"]}
                    </span>
                  </h3>
                </div>
                <div>
                  <Image
                    src={`/images/${bookingSelect["car-type"]}.png`}
                    alt={bookingSelect["car-type"]}
                    width={600}
                    height={600}
                    className="m-auto w-96"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="border border-custom-grey/25" />
          <div className="px-8 py-10 space-y-8">
            <div>
              <h1 className="font-bold text-blue-600 text-lg">
                Personal Information
              </h1>
            </div>
            <div className="space-y-6">
              {personalInfo.map((data) => (
                <div key={data.id} className="flex flex-col gap-2">
                  <label htmlFor={data.htmlId}>
                    <span className="text-dark-grey font-medium">
                      {data.label}
                    </span>{" "}
                    <span className="text-custom-orange">*</span>
                  </label>
                  <input
                    type={data.type}
                    placeholder={data.placeholder}
                    className="bg-lighter-grey p-3 text-sm placeholder:text-custom-grey rounded"
                  />
                  <span className="text-[0.65rem]">
                    This field is required.
                  </span>
                </div>
              ))}
              <div className="flex gap-2 items-center">
                <input type="checkbox" id="cb" />
                <label htmlFor="cb">
                  Please send me the latest news and updates
                </label>
              </div>
            </div>
            <div className="lg:flex lg:justify-end">
              <button
                className="bg-blue-600 w-full lg:w-fit hover:text-blue-600-hov transition-all duration-300 ease-linear text-white p-3 font-bold rounded"
                onClick={() => {
                  setBookingModal(false);
                  setBookingFields({ ...bookingFields, green: true });
                  clearBookingInputs();
                }}
              >
                Reserve Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookingModal;
