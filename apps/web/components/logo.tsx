import Link from "next/link";
import { Separator } from "@workspace/ui/components/separator";

const Logo = () => {
  return (
    <div className="flex items-center text-dark dark:text-light font-semibold text-lg tracking-tight">
      <Link className="hover:underline" href="/">
        store
      </Link>
      <Separator orientation="vertical" className="rotate-[19deg]" />
      <a href={"https://idolo.dev"} className="hover:underline">
        idolo.dev
      </a>
    </div>
  );
};

export default Logo;
