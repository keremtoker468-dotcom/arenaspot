"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "motion/react";
import { Swords, Eye, Dumbbell, ChevronDown } from "lucide-react";
import { useApp } from "@/components/ChatProvider";

/* ── Hero Section ── */
function HeroSection({ onScrollToCards }: { onScrollToCards: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.8]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image with zoom */}
        <motion.div
          style={{ scale }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-cage.png"
            alt="Empty MMA Cage"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark gradient overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"
        />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        {/* Content */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative h-full flex flex-col items-center justify-center px-4 text-center"
        >
          <h1 className="mb-6">
            <div
              className="text-white uppercase font-black tracking-[-0.03em] text-[52px] md:text-[100px] leading-none"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              RİNGDE
            </div>
            <div
              className="text-[#e63946] uppercase font-black tracking-[-0.03em] text-[52px] md:text-[100px] leading-none"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              YERİNİ AL.
            </div>
          </h1>

          <p
            className="text-white/60 text-base md:text-lg mb-10 max-w-2xl"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            Sporcuları keşfet. Antrenörünü bul. Arenaya katıl.
          </p>

          <button
            onClick={onScrollToCards}
            className="px-12 py-4 bg-[#e63946] hover:bg-[#c1121f] text-white uppercase font-bold rounded-lg transition-colors duration-300 tracking-wide"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            KEŞFET
          </button>

          {/* Bouncing arrow */}
          <motion.div
            className="absolute bottom-12"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-8 h-8 text-white/40" strokeWidth={2} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Role Card ── */
interface RoleCardProps {
  image: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  roleKey: "fan" | "athlete" | "coach";
  index: number;
  onSelect: (role: "fan" | "athlete" | "coach") => void;
}

function RoleCard({
  image,
  icon,
  title,
  description,
  buttonText,
  roleKey,
  index,
  onSelect,
}: RoleCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleClick = () => {
    if (isExpanding) return;
    setIsExpanding(true);
    setTimeout(() => onSelect(roleKey), 600);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="relative"
    >
      <motion.div
        className="bg-white rounded-2xl border border-[#eaeaea] overflow-hidden cursor-pointer"
        style={{
          boxShadow: isHovered
            ? "0 12px 40px rgba(230, 57, 70, 0.12)"
            : "0 2px 8px rgba(0, 0, 0, 0.04)",
          willChange: "transform, opacity, box-shadow",
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        animate={{
          y: isHovered ? -4 : 0,
          borderColor: isHovered ? "#e63946" : "#eaeaea",
          scale: isExpanding ? 3 : 1,
          opacity: isExpanding ? 0 : 1,
        }}
        transition={{
          duration: isExpanding ? 0.5 : 0.25,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {/* Image section */}
        <div className="relative h-[280px] overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

          {/* Icon badge with glassmorphism */}
          <motion.div
            className="absolute bottom-4 left-4 w-[46px] h-[46px] rounded-[11px] flex items-center justify-center"
            style={{
              background: isHovered
                ? "rgba(230, 57, 70, 0.8)"
                : "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
            animate={{
              background: isHovered
                ? "rgba(230, 57, 70, 0.8)"
                : "rgba(255, 255, 255, 0.1)",
            }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-white">{icon}</div>
          </motion.div>

          {/* Title overlaid on image */}
          <div className="absolute bottom-4 left-20 right-4">
            <h3
              className="text-white uppercase font-black text-2xl tracking-tight"
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                fontFamily: "Barlow Condensed, sans-serif",
              }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 h-[180px] flex flex-col">
          <p
            className="text-gray-600 mb-6 leading-relaxed flex-1"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            {description}
          </p>

          <button
            className="w-full px-6 py-3 bg-[#e63946] hover:bg-[#c1121f] text-white uppercase font-bold rounded-lg transition-colors duration-300 text-sm tracking-wide"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            {buttonText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Role Selection Section ── */
function RoleSelection({
  onSelect,
  sectionRef,
}: {
  onSelect: (role: "fan" | "athlete" | "coach") => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="bg-white py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div ref={headingRef} className="text-center mb-16">
          <motion.h2
            className="uppercase font-black text-[48px] md:text-[56px] tracking-tight mb-4"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            SENİN ROLÜN NE?
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "Barlow, sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Platformu sana göre ayarlayalım. Bir rol seç ve arenaya katıl.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RoleCard
            image="/images/fan.png"
            icon={<Eye className="w-6 h-6" />}
            title="FAN"
            description="Sporcuları keşfet, takip et. Dövüş dünyasının heyecanını yaşayan kalabalığa katıl."
            buttonText="KEŞFETMEYE BAŞLA →"
            roleKey="fan"
            index={0}
            onSelect={onSelect}
          />

          <RoleCard
            image="/images/sporcu.png"
            icon={<Swords className="w-6 h-6" />}
            title="SPORCU"
            description="Profilini oluştur, highlight videolarını yükle. Sparring partneri ve antrenör bul."
            buttonText="RİNGİ SAHİPLEN →"
            roleKey="athlete"
            index={1}
            onSelect={onSelect}
          />

          <RoleCard
            image="/images/antrenor.png"
            icon={<Dumbbell className="w-6 h-6" />}
            title="ANTRENÖR"
            description="Salonunu veya PT hizmetini tanıt. Yetenekli sporcuları keşfet ve bağlantı kur."
            buttonText="KATIL →"
            roleKey="coach"
            index={2}
            onSelect={onSelect}
          />
        </div>

        {/* Footer line */}
        <motion.div
          className="text-center mt-16 text-gray-600"
          style={{ fontFamily: "Barlow, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={isHeadingInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Zaten hesabın var mı?{" "}
          <span className="text-[#e63946] underline hover:text-[#c1121f] transition-colors cursor-pointer">
            Giriş yap
          </span>
        </motion.div>
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
    <div className="bg-white min-h-screen">
      <HeroSection onScrollToCards={scrollToCards} />
      <RoleSelection onSelect={handleRoleSelect} sectionRef={cardsRef} />
    </div>
  );
}
