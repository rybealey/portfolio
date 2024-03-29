"use client";
import React, { useEffect, useState } from "react";
import ProjectComponent from "./ProjectComponent";
import Image from "next/image";

const ProjectsSection = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  console.log();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Image
          src="/images/loading.gif"
          className="items-center"
          width="400"
          height="100"
        />
      </div>
    );
  } else {
    if (!data) {
      return "There's no projects available at the moment. :/";
    } else {
      return (
        <section>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {data.map((proj) => {
              return (
                <ProjectComponent
                  key={proj.id}
                  title={proj.projects_title}
                  desc={proj.projects_desc}
                  image={proj.projects_img}
                  client={proj.projects_client}
                  website={proj.projects_website}
                />
              );
            })}
          </section>
          <section className="my-10 text-center text-white text-sm">
            <p>
              I'm working on a handful of projects that won't be listed for some
              time. Chat me up and
              <a
                href="mailto:hello@ryanbealey.com"
                className="underline underline-offset-4"
              >
                ask me about my passion projects
              </a>
              .
            </p>
          </section>
        </section>
      );
    }
  }
};

export default ProjectsSection;
