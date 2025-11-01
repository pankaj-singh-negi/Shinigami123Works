import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useSpring,
} from "framer-motion";
import Navbar from "./Navbar";

type HeroSectionProps = {
  scrollX: MotionValue<number>;
  background: string;
};

type SubSectionProps = {
  title: string;
  sectionNumber: number;
  isBottom: boolean;
  imageUrl?: string;
};

const HeroSection = ({ scrollX, background }: HeroSectionProps) => {
  const headingX1 = useTransform(scrollX, [0, -2000], [0, -300]);
  const headingX2 = useTransform(scrollX, [0, -2000], [0, -400]);

  return (
    <div className="relative h-full w-full overflow-hidden text-8xl font-bold mix-blend-difference">
      <motion.h1
        style={{ x: headingX1 }}
        className="absolute left-[30%] top-28 z-10 text-[#fcfaf5] mix-blend-difference"
      >
        CONVERSE
      </motion.h1>
      <motion.h1
        style={{ x: headingX2 }}
        className="absolute left-[40%] top-[25%] z-10 text-[#fcfaf5] mix-blend-difference"
      >
        ShinigamiWorks
      </motion.h1>
      <div
        className="flex h-full w-full"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="w-[46%] overflow-hidden bg-[url('/photo.jpg')] bg-cover"></div>
        <div className="relative w-[54%] overflow-hidden bg-white">
          <motion.div
            className="absolute inset-0 bg-black"
            initial={false}
            animate={{
              y: background === "dark" ? "-100%" : "0%",
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        </div>
      </div>
    </div>
  );
};

const SubSection = ({ isBottom, imageUrl }: SubSectionProps) => (
  <div className="relative h-full w-full overflow-hidden bg-white">
    <div
      className={`absolute left-0 right-0 z-10 mx-auto flex h-[60%] w-[50%] flex-col items-center justify-center ${
        isBottom ? "bottom-0" : "top-0"
      }`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: imageUrl ? undefined : "#ef4444",
      }}
    />
  </div>
);

const App = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [background, setBackground] = useState<"light" | "dark">("light");
  const [contrastNumber, setContrastNumber] = useState<number>(24);
  const totalOriginalSections = 13;

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionImages = ["/blue.jpg", "/rose.jpg"];

  const sections = [
    {
      id: 1,
      Component: HeroSection,
      width: 100,
    },
    ...Array.from({ length: totalOriginalSections - 1 }, (_, index) => ({
      id: index + 2,
      Component: () => (
        <SubSection
          title={`Subsection ${index + 1}`}
          sectionNumber={index + 2}
          isBottom={index % 2 === 0}
          imageUrl={sectionImages[index % sectionImages.length]}
        />
      ),
      width: 100,
    })),
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalScrollDistance = (totalOriginalSections - 1) * window.innerWidth;

  const x = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -totalScrollDistance]),
    {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    },
  );

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const sectionIndex = Math.min(
        Math.floor(value * totalOriginalSections) + 1,
        totalOriginalSections,
      );
      setCurrentSection(sectionIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, totalOriginalSections]);

  const toggleBackgroundAndContrast = () => {
    setBackground((prev) => {
      const newBg = prev === "light" ? "dark" : "light";
      if (newBg === "light") {
        setContrastNumber(24);
      } else {
        setContrastNumber(1.4);
      }
      return newBg;
    });
  };

  

  return (
    <div className="font-bokor relative">
      <Navbar
        currentSection={currentSection}
        totalOriginalSections={totalOriginalSections}
        onToggleBackground={toggleBackgroundAndContrast}
        contrastNumber={contrastNumber}      />
      <div
        ref={containerRef}
        style={{ height: `${totalOriginalSections * 100}vh` }}
        className="hide-vertical-scrollbar"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={{ x, transformStyle: "preserve-3d" }}
            className="relative flex h-full w-full gap-0 will-change-transform"
          >
            {sections.map((section) => {
              const { Component } = section;
              return (
                <div
                  key={section.id}
                  className="h-full flex-shrink-0 overflow-hidden"
                  style={{ width: "100.1vw" }}
                >
                  <Component scrollX={x} background={background} />
                </div>
              );
            })}
            <motion.div
              className="pointer-events-none absolute top-0 bg-black"
              style={{
                left: "100vw",
                width: `${(totalOriginalSections - 1) * 100}vw`,
                height: "100%",
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden",
              }}
              initial={false}
              animate={{
                y: background === "dark" ? "-100%" : "0%",
              }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default App;
