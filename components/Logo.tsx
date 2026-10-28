import Image from "next/image";
import { brand, images } from "@/lib/content";

export function Logo({ className = "" }: { className?: string }) {
  // First "A" of the wordmark is rendered in the accent colour.
  const i = brand.name.indexOf("A");
  return (
    <span className={`logo ${className}`}>
      <Image
        src={images.logo.src}
        alt=""
        width={images.logo.width}
        height={images.logo.height}
        className="logo-mark"
        priority
      />
      <span aria-label={brand.name}>
        <span aria-hidden="true">
          {brand.name.slice(0, i)}
          <span className="logo-accent">{brand.name[i]}</span>
          {brand.name.slice(i + 1)}
        </span>
      </span>
    </span>
  );
}
