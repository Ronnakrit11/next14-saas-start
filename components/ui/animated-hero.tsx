"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { UpgradeBanner } from "./upgrade-banner";



function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Fair", "Secure", "Fast", ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-4 lg:py-7  ">
         
          <div className="flex flex-col gap-2">
          <UpgradeBanner/>
          
          
          
          <br />
            <h1 className="font-regular max-w-2xl text-center text-4xl tracking-tighter md:text-6xl">
              
              <span className="text-spektr-cyan-50">Make Your Deal </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
<br />
            <p className="max-w-2xl text-center text-l leading-relaxed tracking-tight text-muted-foreground md:text-xl">
              จบทุกปัญหาในการจ้างงาน ปัญหาการโดนโกง 
              ทิ้งงาน  ปลอดภัยทั้งผู้จ้างเเละผู้รับจ้าง 
            </p>
          </div>
          <div className="flex flex-row gap-3">
             <Link
            href="https://www.facebook.com/experts8academy">
            <Button size="lg" className="gap-4" variant="outline">
              Contact <PhoneCall className="size-4" />
            </Button></Link>
            <a href="/register">
            <Button size="lg" className="gap-4">
              Sign up  <MoveRight className="size-4" />
            </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };