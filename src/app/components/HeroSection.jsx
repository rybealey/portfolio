"use client";
import Image from "next/image";
import React from "react";
import { TypeAnimation } from "react-type-animation";

const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 my-8 lg:text-left md:text-center sm:text-center text-center">
      <div className="col-span-7 place-self-center place-items-center grid lg:place-items-start">
        <h1 className="text-white max-w-2xl mb-4 lg:text-6xl text-4xl font-extrabold">
          <span className="text-transparent lg:text-5xl text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Hi, I'm Ry. <br />
            Thanks for droppin' in.
          </span>{" "}
          👋
          <br></br>
          <TypeAnimation
            sequence={[
              "Web Developer",
              1000,
              "Design Enthusiast",
              1000,
              "Communications Connoisseur",
              1000,
              "DevOps Tinkerer",
              1000,
              "Project Manager",
              1000,
              "Fintech Nerd",
              1000,
              "Product Owner",
              1000,
              "Ordained Minister (yes, really…)",
              2500,
            ]}
            wrapper="span"
            style={{ fontSize: ".5em", fontWeight: "600" }}
            speed={50}
            repeat={Infinity}
          />
        </h1>
        <p className="mb-4 lg:text-left md:text-center sm:text-center text-center text-[#ADB7BE] text-lg lg:text-xl text-left">
          I help to craft visually appealing, user-friendly, accessible websites
          to help businesses and organizations of all sizes.
        </p>
        <div className="lg:items-left md:items-center sm:items-center items-left">
          <button className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:bg-slate-200 text-white px-6 py-3 rounded-full mr-4">
            <a href="mailto:hello@ryanbealey.com">Hire Me</a>
          </button>
          <button className="m-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-1 py-1  text-white rounded-full">
            <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
              <a href="/docs/ry_bealey.pdf" target="_blank">
                Download CV
              </a>
            </span>
          </button>
        </div>
      </div>
      <div className="col-span-5 place-self-center mt-4 lg:mt-0">
        <div className="bg-[#181818] lg:w-[370px] lg:h-[370px] w-[250px] h-[250px] rounded-full relative">
          <Image
            src="/images/rybealey-animated.png"
            alt="Ry Bealey, animated. Smirking while working on a MacBook Pro 16-inch."
            className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
