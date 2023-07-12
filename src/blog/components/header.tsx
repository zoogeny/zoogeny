import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex m-auto justify-center items-center gap-4 pt-8 pb-10 bg-slate-200">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/zoogeny-logo-white-bg.svg"
            alt="Zoogeny Logo"
            width={64}
            height={64}
            priority
          />
        </Link>
        <h2 className="font-bold sm:text-4xl text-2xl text-slate-950">
          Zoogeny
        </h2>
      </div>

      <nav className="flex gap-4 mt-2 text-slate-900">
        <Link href="/blog">Blog</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
