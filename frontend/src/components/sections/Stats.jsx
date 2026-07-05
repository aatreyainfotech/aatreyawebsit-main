import { useEffect, useState } from "react";
import axios from "axios";
import { ACHIEVEMENTS } from "@/data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Stats() {
  const [items, setItems] = useState(ACHIEVEMENTS);

  useEffect(() => {
    let active = true;
    axios
      .get(`${API}/public/statistics`)
      .then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setItems(data);
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="container-x pb-10 md:pb-16" data-testid="stats-section">
      <div className="grid grid-cols-2 md:grid-cols-4 border border-[#D4AF37]/15">
        {items.map((a, i) => (
          <div
            key={a.label}
            className={`p-8 md:p-10 ${i !== 0 ? "border-l border-[#D4AF37]/10" : ""} ${
              i > 1 ? "md:border-t-0 border-t border-[#D4AF37]/10 md:!border-t-0" : ""
            }`}
            data-testid={`stat-${i}`}
          >
            <div className="font-display text-white text-5xl md:text-6xl leading-none">
              {a.value}
            </div>
            <div className="mt-4 label-eyebrow">{a.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
