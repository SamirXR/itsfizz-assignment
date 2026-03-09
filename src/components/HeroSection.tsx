"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 58, suffix: "%", label: "Increase in pick up point use" },
  { value: 23, suffix: "%", label: "Decreased in customer phone calls" },
  { value: 27, suffix: "%", label: "Increase in pick up point use" },
  { value: 40, suffix: "%", label: "Decreased in customer phone calls" },
];

// Particle config
const PARTICLE_COUNT = 35;
const SPEED_LINE_COUNT = 12;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
    depthFactor: 0.3 + Math.random() * 0.7,
  }));
}

function generateSpeedLines() {
  return Array.from({ length: SPEED_LINE_COUNT }).map((_, i) => ({
    id: i,
    left: `${15 + Math.random() * 70}%`,
    height: 60 + Math.random() * 120,
  }));
}

export default function HeroSection() {
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([]);
  const [speedLines, setSpeedLines] = useState<ReturnType<typeof generateSpeedLines>>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const carInnerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const speedLinesRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Mouse-follow parallax handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  // Smooth mouse-follow loop
  const mouseFollowLoop = useCallback(() => {
    if (carInnerRef.current) {
      const { x, y } = mousePos.current;
      gsap.to(carInnerRef.current, {
        rotateY: x * 8,
        rotateX: -y * 5,
        x: x * 15,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    rafId.current = requestAnimationFrame(mouseFollowLoop);
  }, []);

  useEffect(() => {
    setParticles(generateParticles());
    setSpeedLines(generateSpeedLines());
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(mouseFollowLoop);

    const ctx = gsap.context(() => {
      // --- INTRO ANIMATIONS ---

      // Headline: staggered letter reveal
      const letters = headlineRef.current?.querySelectorAll(".letter");
      if (letters) {
        gsap.set(letters, { opacity: 0, y: 30, filter: "blur(8px)" });
        gsap.to(letters, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
          delay: 0.3,
        });
      }

      // Car: fade in and scale up
      if (carRef.current) {
        gsap.set(carRef.current, { opacity: 0, scale: 0.7, y: 60 });
        gsap.to(carRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          delay: 0.5,
        });
      }

      // Glow: fade in after car
      if (glowRef.current) {
        gsap.set(glowRef.current, { opacity: 0, scale: 0.5 });
        gsap.to(glowRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
          delay: 0.9,
        });
      }

      // Stats: staggered fade + counter animation
      const statItems = statsRef.current?.querySelectorAll(".stat-item");
      if (statItems) {
        gsap.set(statItems, { opacity: 0, y: 40 });
        gsap.to(statItems, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          delay: 1.0,
        });

        // Animated counters
        const counters = statsRef.current?.querySelectorAll(".stat-number");
        if (counters) {
          counters.forEach((el, i) => {
            const target = stats[i].value;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              delay: 1.0 + i * 0.15,
              ease: "power2.out",
              onUpdate: () => {
                (el as HTMLElement).textContent =
                  Math.round(obj.val) + stats[i].suffix;
              },
            });
          });
        }
      }

      // Road lines animation
      const roadLines = roadRef.current?.querySelectorAll(".road-line");
      if (roadLines) {
        gsap.set(roadLines, { opacity: 0, scaleY: 0 });
        gsap.to(roadLines, {
          opacity: 0.3,
          scaleY: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.8,
        });
      }

      // Particles float in
      const particleEls =
        particlesRef.current?.querySelectorAll(".particle");
      if (particleEls) {
        gsap.set(particleEls, { opacity: 0 });
        gsap.to(particleEls, {
          opacity: 1,
          duration: 1.5,
          stagger: 0.08,
          delay: 1.2,
          ease: "power1.out",
        });
      }

      // --- SCROLL-BASED ANIMATIONS ---

      // Car moves upward, steers slightly, and scales down
      if (carRef.current && sectionRef.current) {
        gsap.fromTo(carRef.current,
          { y: 0, scale: 1 },
          {
            y: "-120vh",
            scale: 0.65,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // Car steering rotation — subtle S-curve as you scroll
      if (carInnerRef.current && sectionRef.current) {
        const steerTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          },
        });
        steerTl
          .to(carInnerRef.current, { rotate: -6, duration: 0.25 })
          .to(carInnerRef.current, { rotate: 8, duration: 0.5 })
          .to(carInnerRef.current, { rotate: -4, duration: 0.25 })
          .to(carInnerRef.current, { rotate: 0, duration: 0.25 });
      }

      // Glow intensifies and stretches on scroll
      if (glowRef.current && sectionRef.current) {
        gsap.fromTo(glowRef.current,
          { scaleY: 1, scaleX: 1, opacity: 1 },
          {
            scaleY: 3,
            scaleX: 1.5,
            opacity: 0.8,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "60% top",
              scrub: 1.5,
            },
          }
        );
        gsap.fromTo(glowRef.current,
          { y: 0 },
          {
            y: "-120vh",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // Speed lines appear as you scroll
      if (speedLinesRef.current && sectionRef.current) {
        const slines =
          speedLinesRef.current.querySelectorAll(".speed-line");
        slines.forEach((line, i) => {
          gsap.set(line, { opacity: 0, scaleY: 0 });
          gsap.to(line, {
            opacity: 0.4,
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${5 + i * 3}% top`,
              end: `${15 + i * 3}% top`,
              scrub: 1,
            },
          });
          // Then fade out
          gsap.to(line, {
            opacity: 0,
            y: -200,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `${20 + i * 3}% top`,
              end: `${35 + i * 3}% top`,
              scrub: 1,
            },
          });
        });
      }

      // Particles drift with parallax depth on scroll
      if (particlesRef.current && sectionRef.current) {
        const pEls = particlesRef.current.querySelectorAll(".particle");
        pEls.forEach((p) => {
          const depth = parseFloat(
            (p as HTMLElement).dataset.depth || "0.5"
          );
          gsap.to(p, {
            y: `-${60 * depth}vh`,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      }

      // Road lines move with scroll
      if (roadRef.current && sectionRef.current) {
        gsap.to(roadRef.current, {
          y: "-80vh",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Headline fades out on scroll
      if (headlineRef.current && sectionRef.current) {
        gsap.fromTo(headlineRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)" },
          {
            opacity: 0,
            y: -60,
            filter: "blur(10px)",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "30% top",
              scrub: 1,
            },
          }
        );
      }

      // Stats fade out on scroll
      if (statsRef.current && sectionRef.current) {
        gsap.fromTo(statsRef.current,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -40,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "25% top",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove, mouseFollowLoop, particles]);

  // Split headline text into individual letters
  const headlineText = "WELCOME ITZFIZZ";
  const headlineLetters = headlineText.split("").map((char, i) => (
    <span
      key={i}
      className="letter inline-block"
      style={{ minWidth: char === " " ? "0.5em" : undefined }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh] bg-[#0a0a0a] overflow-hidden"
    >
      {/* Sticky hero container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />

        {/* Floating particles */}
        <div
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none z-[1]"
        >
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle absolute rounded-full bg-white/30"
              data-depth={p.depthFactor}
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Speed lines (visible on scroll) */}
        <div
          ref={speedLinesRef}
          className="absolute inset-0 pointer-events-none z-[2]"
        >
          {speedLines.map((sl) => (
            <div
              key={sl.id}
              className="speed-line absolute w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"
              style={{
                left: sl.left,
                top: "50%",
                height: sl.height,
                transformOrigin: "center top",
              }}
            />
          ))}
        </div>

        {/* Road / track lines */}
        <div
          ref={roadRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3]"
        >
          {/* Center dashed lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="road-line absolute w-[2px] bg-white/20"
              style={{
                height: "40px",
                left: "50%",
                top: `${10 + i * 5}%`,
                transformOrigin: "center bottom",
              }}
            />
          ))}
          {/* Left lane line */}
          <div className="absolute left-[35%] top-0 bottom-0 w-[1px] bg-white/5" />
          {/* Right lane line */}
          <div className="absolute right-[35%] top-0 bottom-0 w-[1px] bg-white/5" />
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="relative z-10 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] text-white text-center mb-8 md:mb-12 select-none"
        >
          {headlineLetters}
        </h1>

        {/* Car image + glow wrapper */}
        <div
          ref={carRef}
          className="relative z-10 w-[200px] sm:w-[280px] md:w-[350px] lg:w-[420px] will-change-transform"
          style={{ perspective: "800px" }}
        >
          {/* Glow trail behind car */}
          <div
            ref={glowRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 w-[120%] h-[200%] pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,120,50,0.15) 0%, rgba(255,80,30,0.06) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div ref={carInnerRef} className="relative z-10 will-change-transform">
            <Image
              src="/car-top-view.png"
              alt="McLaren 720S Top View"
              width={800}
              height={1200}
              className="w-full h-auto drop-shadow-[0_0_80px_rgba(255,100,50,0.15)]"
              priority
            />
          </div>
        </div>

        {/* Statistics */}
        <div
          ref={statsRef}
          className="relative z-10 mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 px-6 max-w-5xl"
        >
          {stats.map((stat, i) => (
            <div key={i} className="stat-item text-center group">
              <div className="stat-number text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
                0{stat.suffix}
              </div>
              <div className="text-xs sm:text-sm text-white/50 leading-snug max-w-[140px] mx-auto">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
