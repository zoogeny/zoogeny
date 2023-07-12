import Footer from "@/components/footer";
import Header from "@/components/header";
import Section from "@/components/section";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-slate-50 text-slate-950">
      <Header />
      <Section>{children}</Section>
      <Footer />
    </main>
  );
}
