"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const HeroBG = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <section>
      <div
        className={cn(
          "transition-all relative flex h-auto flex-col items-center justify-center",
          className
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            // Aurora using only light brand colors
            "--aurora":
              `repeating-linear-gradient(100deg,
                oklch(0.3 0.04 250) 10%,   /* primary navy */
                oklch(0.93 0.03 80) 15%,   /* secondary beige */
                oklch(0.82 0.03 250) 20%,  /* accent warm gray-blue */
                oklch(0.85 0.04 70) 25%,   /* muted clay beige */
                oklch(0.3 0.04 250) 30%    /* primary navy */
              )`,

            "--white-gradient":
              "repeating-linear-gradient(100deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.6)_7%,transparent_10%,transparent_12%,rgba(255,255,255,0.6)_16%)",

            "--primary-navy": "oklch(0.3 0.04 250)",
            "--secondary-beige": "oklch(0.93 0.03 80)",
            "--accent-grayblue": "oklch(0.82 0.03 250)",
            "--muted-claybeige": "oklch(0.85 0.04 70)",
            "--white": "#fff",
            "--transparent": "transparent",
          }}
        >
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px]
              [background-image:var(--white-gradient),var(--aurora)]
              [background-size:300%,_200%]
              [background-position:50%_50%,50%_50%]
              opacity-50 blur-[10px] invert filter will-change-transform

              [--aurora:repeating-linear-gradient(100deg,
                var(--primary-navy)_10%,
                var(--secondary-beige)_15%,
                var(--accent-grayblue)_20%,
                var(--muted-claybeige)_25%,
                var(--primary-navy)_30%
              )]

              [--white-gradient:repeating-linear-gradient(100deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.6)_7%,var(--transparent)_10%,var(--transparent)_12%,rgba(255,255,255,0.6)_16%)]

              after:absolute after:inset-0
              after:[background-image:var(--white-gradient),var(--aurora)]
              after:[background-size:200%,_100%]
              after:[background-attachment:fixed]
              after:mix-blend-difference
              after:content-[""]`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </section>
  );
};
