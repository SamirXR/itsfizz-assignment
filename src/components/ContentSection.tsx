"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContentSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll(".content-card");
      if (items) {
        items.forEach((item) => {
          gsap.set(item, { opacity: 0, y: 60 });
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 60%",
              scrub: false,
              toggleActions: "play none none reverse",
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] py-24 md:py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Speed",
              desc: "0-100 km/h in 2.9 seconds. Pure adrenaline meets precision engineering.",
            },
            {
              title: "Design",
              desc: "Aerodynamic perfection sculpted by wind and inspired by nature.",
            },
            {
              title: "Innovation",
              desc: "Cutting-edge technology pushing the boundaries of what's possible.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="content-card p-8 border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-500"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {card.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="content-card mt-24 text-center">
          <p className="text-white/20 text-sm tracking-widest uppercase">
            Built with Next.js &middot; GSAP &middot; Tailwind CSS
          </p>
        </div>
      </div>
    </section>
  );
}
