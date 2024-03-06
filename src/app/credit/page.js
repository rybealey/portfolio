import React from "react";
import Navbar from "../components/navigation/Navbar";
import FooterSection from "../components/FooterSection";

const Credit = () => {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <div className="container mt-24 mx-auto px-12 py-4">
        <Navbar />
        <div className="grid grid-cols-1 col-span-1 my-8 text-center">
          <h6 className="text-lg text-white font-bold">Technology Stack</h6>
          <p className="text-lg text-white">
            This website's a cute space, but I received a fat chunk of help.
          </p>
          <br />
          <ul className="text-white text-sm">
            <li>@heroicons/react</li>
            <li>@tailwindcss/typography</li>
            <li>@vercel/analytics</li>
            <li>@vercel/postgres</li>
            <li>@vercel/speed-insights</li>
            <li>next</li>
            <li>react</li>
            <li>react-dom</li>
            <li>react-social-icons</li>
            <li>react-type-animation</li>
            <li>eslint</li>
            <li>postcss</li>
            <li>tailwindcss</li>
          </ul>
        </div>
        <FooterSection />
      </div>
    </main>
  );
};

export default Credit;
