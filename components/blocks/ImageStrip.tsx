import { Img } from "@/components/ui/Img";

/**
 * §5.0-3 — full-bleed row of 4–5 images (4:5, no radius), ~3.5 visible on
 * desktop. Static: no auto-play, no arrows. On mobile it is a horizontal
 * scroll-snap row swiped by hand.
 */
export function ImageStrip({ ids }: { ids: string[] }) {
  return (
    <section className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex snap-x snap-mandatory">
        {ids.map((id) => (
          <div
            key={id}
            className="relative aspect-[4/5] w-[72vw] shrink-0 snap-start sm:w-[42vw] md:w-[28.57vw]"
          >
            <Img id={id} sizes="(max-width: 640px) 72vw, (max-width: 768px) 42vw, 29vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
