import * as React from "react";
import { cva } from "class-variance-authority";

const cardVariants = cva("bg-background text-foreground", {
  variants: {
    elevation: {
      flat: "border",
      raised: "shadow-card",
    },
  },
  defaultVariants: {
    elevation: "flat",
  },
});

export function Card({
  className,
  elevation,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { elevation?: "flat" | "raised" }) {
  return <div className={cardVariants({ elevation, className })} {...props} />;
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}
