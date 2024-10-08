import { ReactNode, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./Coin.css";
import { cn } from "@/lib/utils";

interface CoinProps {
  canIClickPlease: boolean;
  sleep: boolean;
  funMode: boolean;
  clickValue: number;
  cooldown: number;
  handleClick(): void;
  children?: ReactNode;
}

interface NumberInfo {
  id: string;
  value: number;
  x: number;
  y: number;
}

const numberAnimationDurationMs = 1000;
const numberAnimationDurationSec = numberAnimationDurationMs / 1000;

const coinAppearence = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
  transition: {
    duration: 0.3,
    ease: [0, 0.71, 0.2, 1.01],
    scale: {
      type: "spring",
      damping: 10,
      stiffness: 100,
      restDelta: 0.001,
    },
  },
};

// const cooldownAppearence = {
//   initial: {
//     opacity: 0,
//     scale: 0.7,
//   },
//   animate: {
//     opacity: 1,
//     scale: 1,
//   },
//   exit: {
//     opacity: 0,
//     scale: 0.5,
//   },
//   transition: {
//     duration: 0.7,
//   },
// };

export const Coin = ({
  canIClickPlease,
  sleep,
  funMode,
  clickValue,
  // cooldown,
  handleClick,
  children,
}: CoinProps): JSX.Element => {
  const coinRef = useRef<HTMLParagraphElement>(null);
  const [buttonTransform, setButtonTransform] = useState({
    scale: 1,
    translateZ: 0,
    rotateX: 0,
    rotateY: 0,
  });
  const [numbers, setNumbers] = useState<NumberInfo[]>([]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    handleClick();
    if (coinRef.current) {
      const touch = event.touches[0];
      const rect = coinRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = touch.clientX - centerX;
      const offsetY = centerY - touch.clientY;

      const rotateXValue = offsetY * 0.1;
      const rotateYValue = offsetX * 0.1;

      setButtonTransform({
        scale: 1,
        translateZ: -5,
        rotateX: rotateXValue,
        rotateY: rotateYValue,
      });

      const randomNumberBetweenTenAndMinusTen =
        Math.floor(Math.random() * 21) - 10;

      const newNumber: NumberInfo = {
        id: `${Date.now()}`,
        value: clickValue,
        x: touch.clientX + randomNumberBetweenTenAndMinusTen,
        y: touch.clientY,
      };

      setNumbers((prevNumbers) => [...prevNumbers, newNumber]);

      // Remove the number after the animation duration
      setTimeout(() => {
        setNumbers((prevNumbers) =>
          prevNumbers.filter((number) => number.id !== newNumber.id),
        );
      }, numberAnimationDurationMs);
    }
  };
  const handleTouchEnd = () => {
    setButtonTransform({
      scale: 1,
      translateZ: 0,
      rotateX: 0,
      rotateY: 0,
    });
  };

  return (
    // <AnimatePresence mode="popLayout">
    <AnimatePresence>
      <motion.div className="root" key="1" {...coinAppearence}>
        <div
          className={cn("container", {
            funMode: funMode,
            sleep: sleep,
          })}
        >
          {children}
          <div
            ref={coinRef}
            className={cn("coin", "skin-default", {
              sleep: sleep,
              disabled: !canIClickPlease,
            })}
            onTouchStart={canIClickPlease ? handleTouchStart : undefined}
            onTouchEnd={canIClickPlease ? handleTouchEnd : undefined}
            style={{
              transform: `
                scale(${buttonTransform.scale})
                translateZ(${buttonTransform.translateZ}px)
                rotateX(${buttonTransform.rotateX}deg)
                rotateY(${buttonTransform.rotateY}deg)
              `,
              opacity: canIClickPlease ? 1 : 0.5,
            }}
          ></div>
        </div>
        {canIClickPlease && (
          <div>
            <AnimatePresence>
              {numbers.map((number) => {
                return (
                  <motion.div
                    key={number.id}
                    className="clickAmount"
                    initial={{ opacity: 1, y: number.y - 50, x: number.x }}
                    animate={{ opacity: 0, y: number.y - 200 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: numberAnimationDurationSec }}
                  >
                    {/* {number.value} */}
                    SIUU!!
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
