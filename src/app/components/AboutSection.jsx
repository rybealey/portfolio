"use client";

import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./about/TabButton";
import SocialMediaIcons from "./SocialMediaIcons";

let interpersonalData = [
  "De-escalation",
  "Professional Facilitation",
  "Cross-team Collaboration",
  "Technical Support",
  "Phone Etiquette",
  "Community Engagement",
  "Community Moderation",
  "Lead Generation",
];

let techStack = [
  "Stripe",
  "Stripe Connect",
  "Quip",
  "Miro",
  "Wrike",
  "iOS",
  "macOS",
  "tvOS",
  "watchOS",
  "Microsoft Office",
  "Content Management Systems (CMS)",
  "Slack",
  "Git",
  "React",
  "Microsoft Azure",
  "Amazon Web Services (AWS)",
  "NextJS",
  "ReactJS",
  "MySQL",
  "NoSQL",
  "MongoDB",
  "Apache",
  "Linux",
  "NodeJS",
  "SQL",
  "PHP",
  "jQuery",
  "JavaScript",
  "CSS",
  "HTML",
  "RESTful APIs",
  "TypeScript",
  "Test-driven Development",
  "Backend Web Development",
  "Machine Learning",
  "Ecommerce",
  "Adobe® Creative Cloud",
  "cPanel / WHM",
  "WHMCS",
  "ClientExec",
];

const tab_data = [
  {
    title: "Experience",
    id: "exp",
    content: (
      <div>
        <div>
          <h6 className="text-xl font-bold">Apple, Inc.</h6>
          <ul>
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
          </ul>
        </div>
        <div>
          <h6 className="text-xl font-bold">Ecobyte</h6>
          <ul>
            <li>Sr. DevOps, Web Lead, Client Relations</li>
            <li className="text-sm">Project · Oct 2014 to Present</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Education",
    id: "edu",
    content: (
      <div>
        <div>
          <h6 className="text-xl font-bold">Degrees</h6>
          <ul>
            <li>University of Central Florida</li>
            <li className="text-sm">
              Bachelor of Arts (B.A.) · Aug 2016 to Dec 2019
            </li>
            <br />
            <li>Seminole State College of Florida</li>
            <li className="text-sm">
              Associate of Arts (A.A.) · Aug 2014 to Jun 2016
            </li>
          </ul>
        </div>
        <br />
        <div>
          <h6 className="text-xl font-bold">Licenses & Certifications</h6>
          <ul>
            <ul>
              <li>University of Central Florida</li>
              <li className="text-sm">
                Certificate, SWE / Coding Bootcamp · Issued Jan 2018
              </li>
            </ul>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Technology",
    id: "tech",
    content: techStack.sort().join(", "),
  },
  {
    title: "Interpersonal",
    id: "per",
    content: interpersonalData.sort().join(", "),
  },
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
      <div className="md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-8 items-center py-8 px-4 xl:gap-12 sm:py-16 xl:px-12">
        <Image
          src="/images/rybealey-workstation.png"
          alt="2D stylized art, showcasing two big displays in a Lo-fi style environment. Ry's ideal workstation."
          width={500}
          height={500}
        />
        <div className="my-4 text-center md:text-left lg:text-left xl:text-left">
          <h2 className="text-4xl">
            Who's that guy? <span className="font-extrabold">It's Ry</span>.
          </h2>
          <br />
          <p className="text-base lg:text-lg">
            Multifaceted tech and design professional with over seven years of
            experience crafting user-centric solutions across server
            administration, front and back-end development, and website design.
            My expertise lies in cPanel/WHM, open-source CMS, and diverse
            programming languages, which enable me to tackle complex technical
            challenges with ease.
          </p>
          {/* <SocialMediaIcons /> */}
          <br />
          <div className="flex flex-col md:flex-row text-center mt-8">
            <TabButton
              selectTab={() => handleTabChange("exp")}
              active={tab === "exp"}
            >
              {" "}
              Experience{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("edu")}
              active={tab === "edu"}
            >
              {" "}
              Education{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("tech")}
              active={tab === "tech"}
            >
              {" "}
              Tech Stack{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("per")}
              active={tab === "per"}
            >
              {" "}
              Interpersonal{" "}
            </TabButton>
          </div>
          <div className="mt-8">
            {tab_data.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
