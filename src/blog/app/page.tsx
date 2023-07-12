import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-50% from-black to-slate-900">
      <div className="flex flex-col items-center p-16 gap-1">
        <h1 className="font-bold text-4xl">Zoogeny</h1>
        <Image
          src="/zoogeny-logo-white-bg.svg"
          alt="Zoogeny Logo"
          width={512}
          height={512}
          priority
        />

        <div className="flex gap-2">
          <Link href="/blog">Blog</Link>|<Link href="/about">About</Link>
        </div>
      </div>
    </main>
  );
}
