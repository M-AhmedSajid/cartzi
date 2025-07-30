import { cn } from "@/lib/utils";

const Title = ({ children, className }) => {
  return (
    <h2 className={cn("text-2xl font-semibold", className)}>{children}</h2>
  );
};

export default Title;
