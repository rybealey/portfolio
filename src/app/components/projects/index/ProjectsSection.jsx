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
        <section className="columns-2 md:columns-3 lg:columns-4">
          {data.map((proj) => {
            return (
              <ProjectComponent
                key={proj.id}
                title={proj.projects_title}
                desc={proj.projects_desc}
                image={proj.projects_img}
                client={proj.projects_client}
                website={proj.projects_website}
                className="mb-4"
              />
            );
          })}
        </section>
      );
    }
  }
};

export default ProjectsSection;
