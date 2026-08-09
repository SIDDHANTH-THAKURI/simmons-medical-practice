import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { PracticeLogo, AbcLogo } from "@/components/Logo";
import { CLINIC_INFO, ABC_PARTNERS_INFO } from "@/data/clinicInfo";

export function Footer() {
  return (
    <footer className="border-t border-ink-900/8 bg-ink-900 pt-16 pb-8 text-white/70">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <PracticeLogo size={32} className="[&_p]:text-white" />
            <p className="mt-4 text-[13px] leading-relaxed text-white/50">
              General practice care for Toowong and the inner west — bulk-billed, patient-first, and easy to reach.
            </p>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-white/40">Simmons Medical Practice</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> {CLINIC_INFO.address}</li>
              <li className="flex items-center gap-2"><Phone size={15} className="shrink-0" /> {CLINIC_INFO.phone}</li>
              <li className="flex items-center gap-2"><Mail size={15} className="shrink-0" /> {CLINIC_INFO.email}</li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-white/40">Portal</p>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li><Link to="/portal" className="hover:text-white transition-colors">Patient login</Link></li>
              <li><Link to="/portal" className="hover:text-white transition-colors">Staff login</Link></li>
              <li><Link to="/system-architecture" className="hover:text-white transition-colors">System &amp; architecture</Link></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security &amp; compliance</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-white/40">Built &amp; secured by</p>
            <div className="mt-4">
              <AbcLogo size={30} dark />
            </div>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> {ABC_PARTNERS_INFO.address}</li>
              <li className="flex items-center gap-2"><Phone size={15} className="shrink-0" /> {ABC_PARTNERS_INFO.phone}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[12px] text-white/40 sm:flex-row">
          <p>© 2026 Simmons Medical Practice. Portal designed &amp; built by ABC Partners.</p>
          <div className="flex items-center gap-5">
            <span className="cursor-default">Privacy Policy</span>
            <span className="cursor-default">Terms of Use</span>
            <span className="cursor-default">Notifiable Data Breach Statement</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
