import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";


// Component for individual digit with number flow animation
export const FlowDigit = ({ digit, direction = "up" }: { digit: string, direction?: "up" | "down" }) => (
  <div className="relative w-4 h-6 flex items-center justify-center overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.span
        key={digit}
        initial={{ 
          y: direction === "up" ? -24 : 24, 
          opacity: 0,
          scale: 0.8
        }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: 1
        }}
        exit={{ 
          y: direction === "up" ? 24 : -24, 
          opacity: 0,
          scale: 0.8
        }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="absolute inset-0 flex items-center justify-center font-bold"
      >
        {digit}
      </motion.span>
    </AnimatePresence>
  </div>
);

// Smart number component that animates only changing digits
export const SmartNumber = ({ 
  currentValue, 
  previousValue 
}: { 
  currentValue: string, 
  previousValue: string 
}) => {
  const current = currentValue.padStart(2, '0');
  const previous = previousValue.padStart(2, '0');
  
  const currentDigits = current.split('');
  const previousDigits = previous.split('');
  
  // Determine animation direction for each digit
  const getDirection = (currentDigit: string, previousDigit: string) => {
    const curr = parseInt(currentDigit);
    const prev = parseInt(previousDigit);
    
    // Handle rollover cases (9->0)
    if (prev === 9 && curr === 0) return "up";
    if (prev === 0 && curr === 9) return "down";
    
    return curr > prev ? "up" : "down";
  };

  return (
    <div className="flex">
      {currentDigits.map((digit, index) => (
        <FlowDigit 
          key={`digit-${index}`}
          digit={digit}
          direction={
            digit !== previousDigits[index] 
              ? getDirection(digit, previousDigits[index]) 
              : "up"
          }
        />
      ))}
    </div>
  );
};

// AM/PM component with flow animation
const FlowPeriod = ({ 
  currentPeriod, 
  previousPeriod 
}: { 
  currentPeriod: string, 
  previousPeriod: string 
}) => (
  <div className="relative w-8 h-6 flex items-center justify-center overflow-hidden ml-1">
    <AnimatePresence mode="wait">
      <motion.span
        key={currentPeriod}
        initial={{ 
          y: currentPeriod !== previousPeriod ? -24 : 0, 
          opacity: currentPeriod !== previousPeriod ? 0 : 1,
          scale: currentPeriod !== previousPeriod ? 0.8 : 1
        }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: 1
        }}
        exit={{ 
          y: 24, 
          opacity: 0,
          scale: 0.8
        }}
        transition={{ 
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
      >
        {currentPeriod}
      </motion.span>
    </AnimatePresence>
  </div>
);

const AnimatedClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previousTime, setPreviousTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousTime(currentTime);
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  // Extract time parts
  const getCurrentHours = () => {
    const hours = currentTime.getHours();
    return (hours % 12 || 12).toString();
  };

  const getPreviousHours = () => {
    const hours = previousTime.getHours();
    return (hours % 12 || 12).toString();
  };

  const getCurrentMinutes = () => currentTime.getMinutes().toString();
  const getPreviousMinutes = () => previousTime.getMinutes().toString();

  const getCurrentPeriod = () => currentTime.getHours() >= 12 ? 'PM' : 'AM';
  const getPreviousPeriod = () => previousTime.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className="flex items-center font-bold text-lg ">
      {/* Hours */}
      <SmartNumber 
        currentValue={getCurrentHours()}
        previousValue={getPreviousHours()}
      />

      {/* Separator with blinking animation */}
      <motion.span 
        className=" font-bold"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        :
      </motion.span>

      {/* Minutes */}
      <SmartNumber 
        currentValue={getCurrentMinutes()}
        previousValue={getPreviousMinutes()}
      />

      {/* AM/PM */}
      <FlowPeriod 
        currentPeriod={getCurrentPeriod()}
        previousPeriod={getPreviousPeriod()}
      />
    </div>
  );
};

export default AnimatedClock;