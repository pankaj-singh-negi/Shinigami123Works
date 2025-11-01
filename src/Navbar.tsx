import React, { useEffect, useRef } from "react";
import AnimatedClock from "./components/AnimatedClock";
import { SmartNumber } from "./components/AnimatedClock";
import { NavLink } from "react-router";

type NavbarProps = {
  currentSection: number;
  totalOriginalSections?: number;
  onToggleBackground?: () => void;
  contrastNumber: number;
};

type navItems = {
  title: string;
  href: string;
};

const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  totalOriginalSections = 5,
  onToggleBackground,
  contrastNumber,
}) => {
  const navItems: navItems[] = [
    { title: "INDEX", href: "/index" },
    { title: "ABOUT", href: "/about" },
    { title: "CONTACT", href: "/contact" },
  ];

  const previousSectionRef = useRef(currentSection);
  const previousTotalRef = useRef(totalOriginalSections);

  useEffect(() => {
    previousSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    previousTotalRef.current = totalOriginalSections;
  }, [totalOriginalSections]);

  const previousSection = previousSectionRef.current;
  const previousTotal = previousTotalRef.current;

  const FullscreenButton = () => (
    <button
      className="relative h-5 w-5 transition-opacity"
      title="Toggle Fullscreen"
    >
      <div className="absolute left-0 top-0 h-2 w-2">
        <div className="absolute left-0 top-0 h-px w-1.5 bg-black"></div>
        <div className="absolute left-0 top-0 h-1.5 w-px bg-black"></div>
      </div>
      <div className="absolute right-0 top-0 h-2 w-2">
        <div className="absolute right-0 top-0 h-px w-1.5 bg-black"></div>
        <div className="absolute right-0 top-0 h-1.5 w-px bg-black"></div>
      </div>
      <div className="absolute bottom-0 left-0 h-2 w-2">
        <div className="absolute bottom-0 left-0 h-px w-1.5 bg-black"></div>
        <div className="absolute bottom-0 left-0 h-1.5 w-px bg-black"></div>
      </div>
      <div className="absolute bottom-0 right-0 h-2 w-2">
        <div className="absolute bottom-0 right-0 h-px w-1.5 bg-black"></div>
        <div className="absolute bottom-0 right-0 h-1.5 w-px bg-black"></div>
      </div>
    </button>
  );

  return (
    <div className="fixed left-0 right-0 top-0 z-50 text-[#fcfaf5] mix-blend-difference">
      <div className="pointer-events-none flex h-screen flex-col justify-between px-6 py-6 text-sm font-light tracking-wide">
        <div className="pointer-events-auto">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-x-8">
              <span className="uppercase">Bihar, (IN)</span>
              <span className="opacity-50">//</span>
              <AnimatedClock />
              <FullscreenButton />
            </div>

            {/* Center Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 transform text-center">
              <a
                href="/"
                className="block text-lg font-bold leading-tight tracking-wide"
              >
                NITE<sup className="text-xs">®</sup>
                <br />
                <span className="block text-right">RIOT</span>
              </a>
            </div>

            {/* Center Right Nav */}
            <div className="flex items-center gap-x-16 uppercase">
              <div className="flex shrink-0 items-start gap-x-1">
                <span className="cursor-pointer transition-opacity">WORK</span>
                <sup className="text-xs opacity-40">(24)</sup>
              </div>
              <div className="flex shrink-0 items-start gap-x-1">
                <span className="cursor-pointer transition-opacity">
                  INSPIRED
                </span>
                <sup className="text-xs opacity-40">(41)</sup>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex shrink-0 items-center gap-x-12 uppercase">
              <button
                className="flex shrink-0 items-center font-mono tabular-nums"
                onClick={onToggleBackground}
              >
                <span>F/</span>
                <div className="inline-block w-4 text-left">
                  <SmartNumber
                    currentValue={String(contrastNumber)}
                    previousValue={String(contrastNumber)}
                  />
                </div>
              </button>
              <div className="flex shrink-0 gap-x-8">
                {navItems.map((item, idx) => (
                  <NavLink
                    to={item.href}
                    key={idx}
                    className="cursor-pointer whitespace-nowrap opacity-60 transition-opacity"
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          {/* Bottom Row */}
          <div className="flex items-center justify-between px-4">
            <button className="uppercase transition-opacity">Back</button>
            <div className="flex items-center gap-x-3">
              <SmartNumber
                currentValue={String(currentSection).padStart(2, "0")}
                previousValue={String(previousSection).padStart(2, "0")}
              />
              <span>//</span>
              <SmartNumber
                currentValue={String(totalOriginalSections).padStart(2, "0")}
                previousValue={String(previousTotal).padStart(2, "0")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;