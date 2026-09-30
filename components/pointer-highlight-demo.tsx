import { PointerHighlight } from "@/components/ui/pointer-highlight";

export function PointerHighlightSection() {
  return (
    <section className="relative z-10 bg-[#FFFFFF] px-6 py-20">
      <div className="mx-auto max-w-lg text-center text-2xl font-bold tracking-tight md:text-4xl">
        The best way to grow is to
        <PointerHighlight>
          <span>Project Yourself</span>
        </PointerHighlight>
      </div>
    </section>
  );
}

export default PointerHighlightSection;