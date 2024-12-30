"use client";

import dynamic from "next/dynamic";

const Contract = dynamic(() => import("@/app/contract/Contract"), { ssr: false });

export default function Client() {
  return <Contract />;
}