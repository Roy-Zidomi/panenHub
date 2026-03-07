import { Leaf, Handshake, ShieldCheck } from "lucide-react";

const aboutPoints = [
  {
    title: "Mendukung UMKM Lokal",
    description: "Aplikasi ini membantu UMKM memasarkan produk pangan dengan jangkauan yang lebih luas.",
    icon: Handshake,
  },
  {
    title: "Produk Segar Terpercaya",
    description: "Pembeli bisa menemukan bahan pangan segar yang dikurasi dengan standar kualitas terbaik.",
    icon: Leaf,
  },
  {
    title: "Pengalaman Belanja Aman",
    description: "Fitur pemesanan dirancang agar transaksi lebih nyaman, cepat, dan transparan.",
    icon: ShieldCheck,
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-gradient-to-b from-background to-muted/30 py-16 md:py-20"
    >
      <div className="container mx-auto px-4 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About</p> */}
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            About 
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          Belanja produk lokal makin mudah, ekonomi petani makin meroket.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aboutPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article
                key={point.title}
                className="rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
