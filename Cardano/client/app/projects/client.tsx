"use client";

import dynamic from "next/dynamic";
const Projects = dynamic(() => import("./projects"), { ssr: false });

export default function ProjectsClient() {
    return <Projects />;
}