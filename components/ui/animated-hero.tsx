"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const features = [
  {
    text: "Faster than light",
    status: "default",
  },
  {
    text: "Customizable",
    status: "success",
  },
  {
    text: "Keep your loved ones safe",
    status: "default",
  },
];

export function AnimatedHero() {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prevFeature) => (prevFeature + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
      <Button
        className="group gap-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-900 text-white hover:shadow-[0_0_0_3px_rgba(168,85,247,0.4)]"
        size="lg"
      >
        <span>Try it now</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Button>

      <div className="relative flex h-[40px] items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute flex items-center gap-2"
          >
            <div
              className={cn(
                "flex size-6 items-center justify-center rounded-full",
                features[currentFeature].status === "success"
                  ? "bg-green-500"
                  : "bg-purple-500",
              )}
            >
              <Check className="size-4 text-white" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {features[currentFeature].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}