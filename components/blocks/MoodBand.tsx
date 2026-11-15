import { Img } from "@/components/ui/Img";
import { KMonogram } from "@/components/site/Logo";

/**
 * §5.0-7 — full-bleed 21:9 image band (~500px), no text, with the white K
 * monogram at 40% opacity bottom-left. Place one between two text sections.
 */
export function MoodBand({ id }: { id: string }) {
  return (
    <section className="relative w-full">
      <div className="relative h-[320px] md:h-[500px]">
        <Img id={id} sizes="100vw" position="center" />
        <KMonogram
          color="#ffffff"
          className="absolute bottom-8 left-6 h-12 w-auto opacity-40 md:bottom-10 md:left-10 md:h-16"
        />
      </div>
    </section>
  );
}
