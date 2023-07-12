export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="m-auto min-w-[200px] max-w-[750px] min-h-[calc(100vh-225px)] px-8 py-8">
      {children}
    </section>
  );
}
