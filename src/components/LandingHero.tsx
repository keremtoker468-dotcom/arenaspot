"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { Swords, Eye, Dumbbell, ChevronDown, ArrowRight } from "lucide-react";
import { useApp } from "@/components/ChatProvider";

/* ── Easing ── */
const ease = [0.16, 1, 0.3, 1] as const;

/* ── Hero Section ── */
function HeroSection({ onScrollToCards }: { onScrollToCards: () => void }) {
  return (
    <section className="relative h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Headline */}
      <h1 className="text-center leading-[0.85]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="text-white font-heading font-black tracking-[-0.04em] text-[72px] sm:text-[100px] md:text-[130px] lg:text-[150px]"
        >
          RİNGDE
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="text-accent font-heading font-black tracking-[-0.04em] text-[72px] sm:text-[100px] md:text-[130px] lg:text-[150px]"
        >
          YERİNİ AL.
        </motion.div>
      </h1>

      {/* Red accent line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ duration: 0.6, delay: 0.8, ease }}
        className="h-[3px] bg-accent mt-8"
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-body text-muted text-base md:text-lg max-w-md text-center mt-6"
      >
        Sporcuları keşfet. Antrenörünü bul. Arenaya katıl.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease }}
        onClick={onScrollToCards}
        className="mt-10 px-10 py-3.5 bg-accent hover:bg-accent-dark text-white font-heading font-bold text-sm tracking-[0.15em] transition-colors duration-200"
      >
        KEŞFET
      </motion.button>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-7 h-7 text-white/30" strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}

/* ── Role Band ── */
interface RoleBandProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  roleKey: "fan" | "athlete" | "coach";
  index: number;
  onSelect: (role: "fan" | "athlete" | "coach") => void;
}

function RoleBand({
  number,
  icon,
  title,
  description,
  roleKey,
  index,
  onSelect,
}: RoleBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => onSelect(roleKey), 300);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      className={`
        border-t border-white/10 cursor-pointer transition-colors duration-200
        ${clicked ? "bg-accent/10" : hovered ? "bg-white/[0.03]" : "bg-transparent"}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[60px_180px_1fr_40px] items-center gap-6 py-7">
        <span
          className={`font-heading font-bold text-sm tracking-widest transition-colors duration-200 ${
            hovered ? "text-accent" : "text-white/20"
          }`}
        >
          {number}
        </span>

        <div className="flex items-center gap-3">
          <span className="text-accent">{icon}</span>
          <span
            className={`font-heading font-bold text-2xl tracking-tight transition-colors duration-200 ${
              hovered ? "text-accent" : "text-white"
            }`}
          >
            {title}
          </span>
        </div>

        <p className="font-body text-white/50 text-sm">{description}</p>

        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight
            className={`w-5 h-5 transition-colors duration-200 ${
              hovered ? "text-accent" : "text-white/30"
            }`}
          />
        </motion.div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden py-5 px-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span
              className={`font-heading font-bold text-xs tracking-widest transition-colors duration-200 ${
                hovered ? "text-accent" : "text-white/20"
              }`}
            >
              {number}
            </span>
            <span className="text-accent">{icon}</span>
            <span
              className={`font-heading font-bold text-xl tracking-tight transition-colors duration-200 ${
                hovered ? "text-accent" : "text-white"
              }`}
            >
              {title}
            </span>
          </div>
          <ArrowRight
            className={`w-4 h-4 transition-colors duration-200 ${
              hovered ? "text-accent" : "text-white/30"
            }`}
          />
        </div>
        <p className="font-body text-white/40 text-sm pl-[72px]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Role Bands Section ── */
const roles = [
  {
    number: "01",
    icon: <Eye className="w-5 h-5" />,
    title: "FAN",
    description:
      "Sporcuları keşfet, takip et. Dövüş dünyasının nabzını tut.",
    roleKey: "fan" as const,
  },
  {
    number: "02",
    icon: <Swords className="w-5 h-5" />,
    title: "SPORCU",
    description:
      "Profilini oluştur, highlight videolarını yükle. Rakiplerini bul.",
    roleKey: "athlete" as const,
  },
  {
    number: "03",
    icon: <Dumbbell className="w-5 h-5" />,
    title: "ANTRENÖR",
    description:
      "Yetenekli sporcuları keşfet. Salonunu tanıt, bağlantı kur.",
    roleKey: "coach" as const,
  },
];

function RoleBandsSection({
  onSelect,
  sectionRef,
}: {
  onSelect: (role: "fan" | "athlete" | "coach") => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-20 md:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease }}
          className="font-heading font-black text-white text-[36px] md:text-[56px] tracking-tight text-center mb-16 md:mb-24"
        >
          SENİN ROLÜN NE?
        </motion.h2>

        {/* Role bands */}
        <div className="border-b border-white/10">
          {roles.map((role, i) => (
            <RoleBand
              key={role.roleKey}
              number={role.number}
              icon={role.icon}
              title={role.title}
              description={role.description}
              roleKey={role.roleKey}
              index={i}
              onSelect={onSelect}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 font-body text-white/40 text-sm">
          Zaten hesabın var mı?{" "}
          <Link
            href="/auth"
            className="text-accent hover:text-accent-dark underline underline-offset-4 transition-colors"
          >
            Giriş yap
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Main Landing Hero ── */
export default function LandingHero() {
  const router = useRouter();
  const { setRole } = useApp();
  const cardsRef = useRef<HTMLDivElement>(null);

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRoleSelect = (role: "fan" | "athlete" | "coach") => {
    if (role === "coach") {
      setRole("coach");
      router.push("/discover?coachselect=1");
    } else {
      setRole(role);
      router.push("/discover");
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="grain-overlay" />
      <HeroSection onScrollToCards={scrollToCards} />
      <RoleBandsSection onSelect={handleRoleSelect} sectionRef={cardsRef} />
    </div>
  );
}
