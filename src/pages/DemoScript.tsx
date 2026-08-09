import { Clapperboard, Info, Mic, MonitorPlay } from "lucide-react";
import { Container } from "@/components/Container";
import { PracticeMark } from "@/components/Logo";
import { DEMO_SCRIPT_META, DEMO_SCRIPT_NOTES, DEMO_SCRIPT_SCENES } from "@/data/demoScript";

export default function DemoScript() {
  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      <header className="border-b border-ink-900/8 bg-white/70 py-8">
        <Container className="flex items-center gap-3">
          <PracticeMark size={30} />
          <div>
            <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-terracotta-600">
              <Clapperboard size={13} /> Internal — not linked anywhere
            </p>
            <h1 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">{DEMO_SCRIPT_META.title}</h1>
          </div>
        </Container>
      </header>

      <Container className="mt-10 max-w-3xl">
        <p className="text-[13px] font-medium text-ink-500">{DEMO_SCRIPT_META.subtitle}</p>
        <p className="mt-1 text-[13px] text-ink-400">Target runtime {DEMO_SCRIPT_META.runtime} · scene-by-scene, screen action + voiceover line</p>

        <div className="mt-10 space-y-10">
          {DEMO_SCRIPT_SCENES.map((scene) => (
            <section key={scene.number}>
              <div className="flex items-baseline gap-3 border-b border-ink-900/10 pb-2.5">
                <span className="font-display text-2xl text-teal-700">{scene.number}</span>
                <h2 className="flex-1 text-[17px] font-semibold text-ink-900">{scene.title}</h2>
                <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[11.5px] font-medium text-ink-500">{scene.duration}</span>
              </div>

              <div className="mt-4 space-y-5">
                {scene.beats.map((beat, i) => (
                  <div key={i} className="rounded-2xl border border-ink-900/8 bg-white p-5">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cream-100 text-ink-500">
                        <MonitorPlay size={13} />
                      </span>
                      <p className="text-[13px] leading-relaxed text-ink-500">
                        <span className="font-semibold uppercase tracking-wide text-ink-400">On screen — </span>
                        {beat.onScreen}
                      </p>
                    </div>
                    <div className="mt-3.5 flex items-start gap-2.5 border-t border-ink-900/6 pt-3.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                        <Mic size={13} />
                      </span>
                      <p className="text-[14.5px] leading-relaxed text-ink-800">{beat.voiceover}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-800">
            <Info size={15} /> Notes for recording
          </p>
          <ul className="mt-3 space-y-2">
            {DEMO_SCRIPT_NOTES.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-700">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
