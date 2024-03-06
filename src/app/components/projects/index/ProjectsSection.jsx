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
        setTimeout(function () {
          setLoading(false);
        }, 1450);
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
        <section className="flex flex-row gap-10 py-5">
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
      );
    }
  }
};

export default ProjectsSection;
