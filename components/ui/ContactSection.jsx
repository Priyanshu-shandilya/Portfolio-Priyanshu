"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";

const EMAIL = "priyanshushandilya7@gmail.com";

const SECTION_NUMBER = "06";

const RESUME_URL = "/resume.pdf";
const PURPLE = "#7C5CE0";


function GithubIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.27ZM5.32 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.54 20.45H7.1V8.99H3.54v11.46Z" />
    </svg>
  );
}


const LINKS = [
  {
    label: "GitHub",
    detail: "@Priyanshu-shandilya",
    href: "https://github.com/Priyanshu-shandilya",
    icon: GithubIcon,
    external: true,
  },
  {
    label: "LinkedIn",
    detail: "in/priyanshu-shandilya",
    href: "https://www.linkedin.com/in/priyanshu-shandilya-a321b131b/",
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: "Resume",
    detail: "PDF, opens a download",
    href: RESUME_URL,
    icon: Download,
    external: false,
  },
];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CE0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F5F1]";


export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);

      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };
  return (
    <section
      ref={ref}
      id="contact"
      className="relative z-10 border-t border-[#E4E1DA] px-6 py-24 text-[#1A1A1A] md:py-32"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-6xl"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.3em] text-[#8A8A8A]">
          {SECTION_NUMBER} · Get in touch
        </p>
        <h2 className="mt-6 font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Let&apos;s build something
          <br />
          <em className="italic" style={{ color: PURPLE }}>
            worth shipping.
          </em>
        </h2>
        <div className="mt-14 grid items-start gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <p className="max-w-xl text-lg leading-[1.75] md:text-[21px]">
              I&apos;m currently looking for a{" "}
              <span style={{ color: PURPLE }}>full-time Software Engineer Role</span>, and
              I&apos;m open to internships and collaborations too. If
              you&apos;re building something that has to work beyond the demo,
              I&apos;d like to hear about it.
            </p>
            <p className="mt-6 max-w-xl text-base leading-[1.8] text-[#666] md:text-lg">
              Send a short note with what you&apos;re working on and what you
              need. I read every message and reply personally.
            </p>

            <p
              className="mt-10 text-[15px]"
              style={{ color: PURPLE }}
            >
              Hello → idea → build → ship ✦
            </p>
          </div>


          <div className="rounded-2xl border border-[#E4E1DA] bg-[#FBFAF8] p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_10px_30px_-18px_rgba(0,0,0,0.18)] sm:p-8">
            <p className="text-[15px] text-[#6B6B6B]">
              The quickest way to reach me
            </p>

            <a
              href={`mailto:${EMAIL}`}
              className={`mt-3 block break-all rounded-sm text-xl font-medium transition-colors hover:text-[#7C5CE0] sm:text-2xl ${FOCUS}`}
            >
              {EMAIL}
            </a>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={copyEmail}
                className={`inline-flex items-center gap-2 rounded-full border border-[#E4E1DA] bg-white px-4 py-2 text-sm font-medium text-[#3A3A3A] transition-colors hover:border-[#7C5CE0] hover:text-[#7C5CE0] ${FOCUS}`}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy address"}
              </button>

              <span className="sr-only" role="status" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <a
              href={`mailto:${EMAIL}`}
              className={`group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#141414] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-[#7C5CE0] ${FOCUS}`}
            >
              Send an email
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        {/* Links */}

        <div className="mt-20 grid gap-x-10 gap-y-10 border-t border-[#E4E1DA] pt-10 sm:grid-cols-3">
          {LINKS.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { download: true })}
                className={`group block rounded-sm ${FOCUS}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 font-serif text-3xl font-medium transition-colors group-hover:text-[#7C5CE0]">
                    <span className="text-[#8A8A8A] transition-colors group-hover:text-[#7C5CE0]">
                      <Icon size={20} />
                    </span>
                    {link.label}
                  </span>

                  <ArrowUpRight
                    size={20}
                    className="text-[#8A8A8A] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#7C5CE0]"
                  />
                </div>

                <p className="mt-1.5 text-[15px] text-[#6B6B6B]">
                  {link.detail}
                </p>
              </a>
            );
          })}
        </div>

        {/* Footer */}

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-[#E4E1DA] pt-6 text-sm text-[#8A8A8A] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Priyanshu Shandilya. Designed and
            built by me.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className={`rounded-sm transition-colors hover:text-[#7C5CE0] ${FOCUS}`}
          >
            Back to top ↑
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default ContactSection;