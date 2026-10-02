"use client";

import { Lanyard3D } from "@cortexcn/ui/components/lanyard-3d";

export function Lanyard3DDemo() {
  return <Lanyard3D />;
}

export function Lanyard3DDetailsDemo() {
  return (
    <Lanyard3D
      backText="Build Week, October 2026"
      badgeId="BW-2026-118"
      className="h-[520px]"
      dropIn={false}
      jobTitle="Founding Engineer"
      label="SPEAKER"
      name="Sam Okafor"
      strapLength={150}
      strapText="BUILD WEEK 2026"
    />
  );
}

export function Lanyard3DColorsDemo() {
  return (
    <Lanyard3D
      cardColor="#111113"
      className="h-[520px]"
      inkColor="#fafafa"
      jobTitle="Product Designer"
      label="GUEST"
      name="Mia Chen"
      strapColor="#2563eb"
      strapLength={160}
    />
  );
}
