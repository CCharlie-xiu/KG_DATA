import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Masonry, { type MasonryItem } from "./Masonry";

export default function MasonryScreen({
  title,
  action,
  items,
  empty,
}: {
  title: string;
  action?: ReactNode;
  items: MasonryItem[];
  empty: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="home-screen scroll-screen">
      <section className="board-head">
        <h1>{title}</h1>
        {action}
      </section>
      {items.length === 0 ? (
        <p className="board-empty">{empty}</p>
      ) : (
        <section className="masonry-stage">
          <Masonry
            items={items}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover
            hoverScale={0.97}
            blurToFocus
            colorShiftOnHover={false}
            onItemClick={(item) => navigate(item.url)}
          />
        </section>
      )}
    </div>
  );
}
