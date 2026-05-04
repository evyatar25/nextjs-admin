"use client";

const logos = [
  "/logos/elkana.png",
  "/logos/beer-yacov.png",
  "/logos/ashkelon.jpg",
  "/logos/beit-arie.png",
  "/logos/even-yeuda.png",
  "/logos/gan-yavne.png",
  "/logos/gderot.png",
  "/logos/gedera.png",
  "/logos/gezer.jpg",
  "/logos/hod-hasharon.png",
  "/logos/mevasert-tsion.png",
  "/logos/kiryat-ata.png",
  "/logos/kfar-yona.png",
  "/logos/karni-shomron.png",
  "/logos/kadima-tsoran.png",
  "/logos/rosh-haayin.png",
  "/logos/ramle.png",
  "/logos/oranit.png",
  "/logos/nesher.png",
  "/logos/migdal.png",
  "/logos/yeruham.png",
  "/logos/tel-mond.png",
  "/logos/shafir.png",
  "/logos/shaar-shomron.png",
];

export default function LogosMarquee() {
  return (
    <div className="relative overflow-hidden py-10">
      {/* fade בצדדים */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      {/* פס לוגואים */}
      <div className="flex w-max animate-marquee gap-16">
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="flex h-16 w-40 items-center justify-center opacity-70 transition hover:opacity-100"
          >
            <img src={logo} alt="logo" className="max-h-12 object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
