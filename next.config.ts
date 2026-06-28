import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // cPanel / CloudLinux caps memory per account. The default parallel
    // static-page workers each spin up SWC/WASM and collectively overrun the
    // limit (build worker SIGABRT). One worker keeps peak memory low; with a
    // handful of static pages the build-time cost is negligible.
    cpus: 1,
    memoryBasedWorkersCount: true,
  },
};

export default nextConfig;
