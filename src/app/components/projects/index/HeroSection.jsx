import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 my-8">
      <div className="col-span-7 place-self-center place-items-center grid lg:place-items-start">
        <h1 className="text-white max-w-2xl mb-4 lg:text-6xl text-4xl font-extrabold text-center md:text-left">
          <span className="text-5xl text-white">My projects are… simple.</span>
        </h1>
        <p className="text-2xl text-white mb-5">
          But they're exactly what my clients asked for.
        </p>
        <p
          className="mb-2 text-xs bg-[#332C0F] border-0 border-thin border-[#F8D84B] text-[#F8D84B] uppercase hover:cursor-pointer"
          style={{
            borderRadius: "5px",
            padding: "5px 10px",
          }}
        >
          Current Focus
        </p>
        <p className="text-center md:text-left text-[#ADB7BE] mb-6 text-lg lg:text-xl">
          Exploring web application development utilizng the MERN technology
          stack as well as developing custom web applications that require
          strategic integration of payments services.
        </p>
      </div>
      <div className="col-span-5 place-self-center mt-4 lg:mt-0">
        <div className="bg-[#181818] lg:w-[370px] lg:h-[370px] w-[250px] h-[250px] rounded-full relative">
          <Image
            src="/images/projects/projects_space.png"
            alt="Empty office, multiple computers in a lo-fi lighting environment."
            className="absolute rounded-full shadow-inner shadow-black drop-shadow-2xl"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
