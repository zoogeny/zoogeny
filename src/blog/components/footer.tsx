import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="p-8 flex gap-1.5 items-center justify-center bg-gradient-to-b from-slate-50 to-slate-200">
      <Link className="flex gap-2 items-center" href="/">
        <Image
          src="/zoogeny-logo-white-bg.svg"
          alt="Zoogeny Logo"
          width={24}
          height={24}
          priority
        />

        <h2 className="font-semibold text-slate-950">Zoogeny</h2>
      </Link>
      <span className="text-slate-800 text-xs pt-0.5">
        © 2023. All Rights Reserved.
      </span>
    </footer>
  );
}
