import type { ReactNode } from "react";
import DriftWall, { type DriftWallItem } from "./DriftWall";

export default function BoardScreen({
  title,
  action,
  items,
}: {
  title: string;
  action?: ReactNode;
  items: DriftWallItem[];
}) {
  return (
    <div className="home-screen">
      <section className="board-head">
        <h1>{title}</h1>
        {action}
      </section>
      <section className="drift-stage">
        <DriftWall items={items} tilt={6} turn={-6} dim={0.96} fade={0.32} overlayColor="#05050a" />
      </section>
    </div>
  );
}
