import React from "react";
import Link from "next/link";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const basepath = publicRuntimeConfig.basePath || "";

export default function Home() {
  return (
    <>
      <h1>Next.js MySQL Query</h1>
      <Link
        href="/graph/?device_name=device1"
        as={`${basepath}/graph/device1`}
      >
        <a>Graph: device1</a>
      </Link>
    </>
  );
}
