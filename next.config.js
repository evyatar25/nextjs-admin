const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => {
  const isStaticExport = process.env.NEXT_OUTPUT_EXPORT === "true";

  return {
    reactStrictMode: true,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    ...(isStaticExport
      ? {
          output: "export",
          trailingSlash: true,
        }
      : {}),
  };
};
