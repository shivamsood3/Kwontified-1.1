/* Real client logos pulled from the brand's asset library. */
const logos = [
  { name: "Timberland", file: "/assets/clients/timberland.svg" },
  { name: "Kipling", file: "/assets/clients/kipling.svg" },
  { name: "Vilebrequin", file: "/assets/clients/vilebrequin.png" },
  { name: "TULA", file: "/assets/clients/tula.svg" },
  { name: "Moon Juice", file: "/assets/clients/moon-juice.png" },
  { name: "Trish McEvoy", file: "/assets/clients/trish-mcevoy.svg" },
  { name: "Pelagic", file: "/assets/clients/pelagic.png" },
  { name: "Fair Harbor", file: "/assets/clients/fair-harbor.svg" },
];

export function LogoCloud({
  heading = "Trusted by leading brands for over a decade",
}: {
  heading?: string;
}) {
  return (
    <div>
      <p className="text-center text-sm text-muted">{heading}</p>
      <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-4">
        {logos.map((l) => (
          <div key={l.name} className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={l.file}
              alt={l.name}
              className="h-8 w-auto max-w-[150px] object-contain opacity-90 transition hover:opacity-100"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
