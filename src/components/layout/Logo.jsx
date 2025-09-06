import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = ({ children, className }) => {
  return (
    <Link href={"/"}>
      <h2
        className={cn(
          "text-2xl tracking-wider font-black text-primary uppercase",
          className
        )}
      >
        {children}
      </h2>
    </Link>
  );
};

export default Logo;
