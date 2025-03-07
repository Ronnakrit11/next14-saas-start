import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";

interface EmptyPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-1 items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}

interface EmptyPlaceholderIconProps {
  name: keyof typeof Icons;
  className?: string;
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({
  name,
  className,
}: EmptyPlaceholderIconProps) {
  const Icon = Icons[name];

  if (!Icon) {
    return null;
  }

  return (
    <div className="flex items-center justify-center rounded-full bg-muted p-5">
      <Icon className={cn("size-10", className)} />
    </div>
  );
};

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("mt-5 font-heading text-2xl font-bold", className)}
      {...props}
    />
  );
};

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mb-5 mt-1.5 text-center text-sm font-normal leading-6 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};