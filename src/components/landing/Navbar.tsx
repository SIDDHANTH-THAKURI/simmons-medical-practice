import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { PracticeLogo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";

const LINKS = [
  { label: "Patient Care", href: "#patients" },
  { label: "Practice Team", href: "#staff" },
  { label: "AI Assistant", href: "#assistant" },
  { label: "Security", href: "#security" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream-50/85 backdrop-blur-lg shadow-[0_1px_0_rgba(33,28,22,0.06)]" : "bg-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)}>
          <PracticeLogo size={34} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[14px] font-medium text-ink-700 hover:text-ink-900 transition-colors">
              {l.label}
            </a>
          ))}
          <Link to="/system-architecture" className="text-[14px] font-medium text-ink-700 hover:text-ink-900 transition-colors">
            System &amp; Architecture
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/portal">
            <Button variant="ghost" size="md">Log in</Button>
          </Link>
          <Link to="/portal">
            <Button variant="primary" size="md">Access Your Portal</Button>
          </Link>
        </div>

        <button className="lg:hidden text-ink-800" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden border-t border-ink-900/8 bg-cream-50"
        >
          <Container className="flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-700 hover:bg-ink-900/5">
                {l.label}
              </a>
            ))}
            <Link to="/system-architecture" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink-700 hover:bg-ink-900/5">
              System &amp; Architecture
            </Link>
            <div className="mt-2 flex flex-col gap-2 px-3">
              <Link to="/portal"><Button variant="secondary" className="w-full">Log in</Button></Link>
              <Link to="/portal"><Button variant="primary" className="w-full">Access Your Portal</Button></Link>
            </div>
          </Container>
        </motion.div>
      )}
    </motion.header>
  );
}
