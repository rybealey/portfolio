"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import NavLink from './NavLink';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from './MenuOverlay';
import Image from 'next/image';

const navLinks = [
    {
        title: "About",
        target: "_self",
        path: "#about"
    },
    {
        title: "Buy Me Coffee",
        target: "_blank",
        path: "https://donate.stripe.com/aEUcQN2QMbK8eEE7ss"
    }
]

const Navbar = () => {
    const [navbarOpen, setNavbarOpen] = useState();

    return (
        <nav className="fixed top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100">
            <div className="flex flex-wrap items-center justify-between mx-auto px-16 py-4">
                <Link href={"/"} className="text-3xl md:text-5xl text-white font-semibold">
                    <Image
                        src="/images/rybealey-logo-trns.png"
                        alt="Ry, official wordmark"
                        width={200}
                        height={100}
                    />
                </Link>
                <div className="mobile-menu block md:hidden">
                    {
                        !navbarOpen ? (
                            <button
                                id="nav-toggle"
                                onClick={() => setNavbarOpen(true)}
                                className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white">
                                <Bars3Icon
                                    className="h-5 w-5"
                                />
                            </button>
                        ) : (
                            <button
                                id="nav-toggle"
                                onClick={() => setNavbarOpen(false)}
                                className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white">
                                <XMarkIcon
                                    className="h-5 w-5"
                                />
                            </button>
                        )
                    }
                </div>
                <div className="hidden md:block md:w-auto" id="navbar-default">
                    <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
                        {
                            navLinks.map((link, index) => (
                                <li key={index}>
                                    <NavLink
                                        href={link.path}
                                        title={link.title}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            {
                navbarOpen ? 
                    <MenuOverlay links={navLinks} /> : null
            } 
        </nav>
    )
}

export default Navbar