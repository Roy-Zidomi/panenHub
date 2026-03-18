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
      className="scroll-mt-24 py-8 md:py-10"
    >
      <div className="container mx-auto px-4 sm:px-8">
        <div className="reveal-up mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Tentang PanenHub
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Belanja produk lokal makin mudah, ekonomi petani makin tumbuh.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aboutPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <article
                key={point.title}
                className={[
                  "surface-panel interactive-lift reveal-up rounded-2xl p-6",
                  index === 0 ? "reveal-delay-1" : index === 1 ? "reveal-delay-2" : "reveal-delay-3",
                ].join(" ")}
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
