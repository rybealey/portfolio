"use client";

import React, { useTransition, useState } from 'react'
import Image from 'next/image'
// import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import TabButton from './about/TabButton';

const tab_data = [
    {
        title: "Experience",
        id: "exp",
        content: (
            <ul>
                <h6 className="text-xl font-bold">Apple, Inc.</h6>
                <li>Sales Chat Specialist</li>
                <li className="text-sm">Full-time · Mar 2022 to Present</li>
                    <br />
                <li>EN Apple Support Community Moderator</li>
                <li className="text-sm">Rotation · Aug 2023 to Feb 2024</li>
                    <br />
                <li>Product Zone Specialist, Apple Domain NORTHSIDE</li>
                <li className="text-sm">Full-time · Sep 2021 to Mar 2022</li>
                    <br />
                <li>Knowledge Management Specialist</li>
                <li className="text-sm">Rotation · Mar 2021 to Aug 2021</li>
                    <br />
                <li>Technical Support Advisor</li>
                <li className="text-sm">Full-time · Jul 2018 to Mar 2021</li>
                    <br />
                <h6 className="text-xl font-bold">Ecobyte</h6>
                <li>Sr. DevOps, Web Lead, Client Relations</li>
                <li className="text-sm">Project · Oct 2014 to Present</li>
            </ul>
        )
    },
    {
        title: "Education",
        id: "edu",
        content: (
            <ul>
                <h6 className="text-xl font-bold">Degrees</h6>
                <li>University of Central Florida</li>
                <li className="text-sm">Bachelor of Arts (B.A.) · Aug 2016 to Dec 2019</li>
                <br />
                <li>Seminole State College of Florida</li>
                <li className="text-sm">Associate of Arts (A.A.) · Aug 2014 to Jun 2016</li>
                    <br />
                <h6 className="text-xl font-bold">Licenses & Certifications</h6>
                <li>University of Central Florida</li>
                <li className="text-sm">Certificate, SWE / Coding Bootcamp · Issued Jan 2018</li>
            </ul>
        )
    },
    {
        title: "Technology",
        id: "tech",
        content: (
            <ul>
                <li>Test, three</li>
            </ul>
        )
    },
    {
        title: "Interpersonal",
        id: "per",
        content: (
            <ul>
                <li>Test, four</li>
            </ul>
        )
    }
    // {
    //     title: "Experience",
    //     id: "exp",
    //     entries: [
    //         {
    //             role: "Sr. DevOps, Web Lead, Customer Relations",
    //             type: "Freelance",
    //             company: "Ecobyte",
    //             started: "Oct 2014",
    //             ended: null
    //         },
    //         {
    //             role: "Technical Support Advisor",
    //             type: "Full-time",
    //             company: "Apple Inc., AppleCare Contact Center",
    //             started: "Jul 2018",
    //             ended: "Mar 2021"
    //         },
    //         {
    //             role: "Knowledge Management Specialist",
    //             type: "Rotation",
    //             company: "Apple Inc., AppleCare Business Process Re-engineering (BPR)",
    //             started: "Mar 2021",
    //             ended: "Aug 2021"
    //         },
    //         {
    //             role: "Product Zone Specialist",
    //             type: "Full-time",
    //             company: "Apple Inc., Apple DOMAIN NORTHSIDE",
    //             started: "Sep 2021",
    //             ended: "Mar 2022"
    //         },
    //         {
    //             role: "Sales Chat Specialist",
    //             type: "Full-time",
    //             company: "Apple Inc., Retail Customer Care (RCC)",
    //             started: "Mar 2022",
    //             ended: null
    //         },
    //         {
    //             role: "AMR Support Community Moderator",
    //             type: "Rotation",
    //             company: "Apple Inc., AppleCare Digital",
    //             started: "Aug 2023",
    //             ended: "Feb 2024"
    //         }
    //     ]
    // },
    // {
    //     title: "Education",
    //     id: "edu",
    //     entries: [
    //         {
    //             institution: "Seminole State College of Florida",
    //             program: "Associate of Arts (A.A.), Information Systems Technology",
    //             dates: "Aug 2014 - Jun 2016"
    //         },
    //         {
    //             institution: "University of Central Florida",
    //             program: "Bachelor of Arts (B.A.), Digital Media, Web Design Specialization",
    //             dates: "Aug 2016 - Dec 2019"
    //         },
    //         {
    //             institution: "University of Central Florida",
    //             program: "Continuing Education Certificate, SWE / Coding Bootcamp",
    //             dates: "Issued Jan 2018"
    //         }
    //     ]
    // },
    // {
    //     title: "Interpersonal",
    //     id: "per",
    //     entries: [
    //         "De-escalation, Professional Facilitation", "Cross-team Collaboration", "Technical Support",
    //         "Phone Etiquette", "Community Engagement", "Community Moderation", "Lead Generation"
    //     ]
    // },
    // {
    //     title: "Technology",
    //     id: "tech",
    //     entries: [
    //         "Stripe", "Stripe Connect", "Quip", "Miro", "Wrike",
    //         "iOS", "macOS", "tvOS", "watchOS", "Microsoft Office", "Content Management Systems (CMS)",
    //         "Slack", "Git", "React", "Microsoft Azure", "Amazon Web Services (AWS)", "NextJS", "ReactJS",
    //         "MySQL", "NoSQL", "MongoDB", "Apache", "Linux", "NodeJS", "SQL", "PHP", "jQuery", "JavaScript",
    //         "CSS", "HTML", "RESTful APIs", "TypeScript", "Test-driven Development", "Backend Web Development",
    //         "Machine Learning", "Ecommerce", "Adobe® Creative Cloud", "cPanel / WHM", "WHMCS", "ClientExec"
    //     ]
    // }
];

const AboutSection = () => {
    const [tab, setTab] = useState("exp");
    const [isPending, startTransition] = useTransition();
    const handleTabChange = (id) => {
        startTransition(() => {
            setTab(id);
        });
    };
  return (
    <section className="text-white" id="about">
        <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
            <Image
                src="/images/rybealey-workstation.png"
                alt="2D stylized art, showcasing two big displays in a Lo-fi style environment. Ry's ideal workstation."
                className="rounded-lg"
                width={500}
                height={500}
            />
            <div className="my-4">
                <h2 className="text-4xl">Who's that guy? <span className="font-extrabold">It's Ry</span>.</h2>
                    <br />
                <p className="text-base lg:text-lg">
                    Multifaceted tech and design professional with over seven years of experience crafting user-centric solutions across server administration, front and back-end development, and website design. My expertise lies in cPanel/WHM, open-source CMS, and diverse programming languages, which enable me to tackle complex technical challenges with ease.
                        <br /><br />
                    {/* <div className="flex flex-row items-center">
                        <a
                            className="underline underline-offset-4"
                            href="https://www.linkedin.com/in/ryanbealey/"
                            target="_blank">
                                Let's Connect
                        </a>&nbsp;
                        <ArrowTopRightOnSquareIcon className="w-6 h-6"/>
                    </div> */}
                </p>
                <div className="flex flex-row mt-8">
                    <TabButton
                        selectTab={() => handleTabChange("exp")}
                        active={tab === "exp"}>
                            {" "} Experience {" "}
                    </TabButton>

                    <TabButton
                        selectTab={() => handleTabChange("edu")}
                        active={tab === "edu"}>
                            {" "} Education {" "} 
                    </TabButton>
                    <TabButton
                        selectTab={() => handleTabChange("tech")}
                        active={tab === "tech"}>
                            {" "} Technology {" "} 
                    </TabButton>
                    <TabButton
                        selectTab={() => handleTabChange("per")}
                        active={tab === "per"}>
                            {" "} Interpersonal {" "} 
                    </TabButton>
                </div>
                <div className="mt-8">
                    {tab_data.find((t) => t.id === tab).content}
                </div>
            </div>
        </div>
    </section>
  )
}

export default AboutSection