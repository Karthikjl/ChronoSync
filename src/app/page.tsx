import { EpochConverter } from "@/components/epoch-converter";
import { WorldClock } from "@/components/world-clock";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            ChronoSync
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your friendly neighborhood time utility.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EpochConverter />
          <WorldClock />
        </div>
        
        <footer className="mt-12 text-center text-muted-foreground text-sm">
          <p>Powered by Next.js, shadcn/ui, and the World Time API.</p>
        </footer>
      </div>
    </main>
  );
}
