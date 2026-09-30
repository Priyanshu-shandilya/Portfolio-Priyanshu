"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const PURPLE = "#7C5CE0";

// Small label above the heading (e.g. "02 · Skills")
const SECTION_NUMBER = "02";

type Skill = {
  name: string;
  logo: string;
};

type Category = {
  title: string;
  description: string;
  skills: Skill[];
};

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const frontendSkills: Skill[] = [
  { name: "React", logo: `${CDN}/react/react-original.svg` },
  { name: "Next.js", logo: `${CDN}/nextjs/nextjs-original.svg` },
  { name: "TypeScript", logo: `${CDN}/typescript/typescript-original.svg` },
  { name: "JavaScript", logo: `${CDN}/javascript/javascript-original.svg` },
  { name: "Tailwind CSS", logo: `${CDN}/tailwindcss/tailwindcss-original.svg` },
  { name: "HTML5", logo: `${CDN}/html5/html5-original.svg` },
  { name: "CSS3", logo: `${CDN}/css3/css3-original.svg` },
  { name: "Redux", logo: `${CDN}/redux/redux-original.svg` },
  { name: "Sass", logo: `${CDN}/sass/sass-original.svg` },
  { name: "Vue.js", logo: `${CDN}/vuejs/vuejs-original.svg` },
  { name: "Framer Motion", logo: `${CDN}/framermotion/framermotion-original.svg` },
  { name: "Vite", logo: `${CDN}/vitejs/vitejs-original.svg` },
];

const backendSkills: Skill[] = [
  { name: "Node.js", logo: `${CDN}/nodejs/nodejs-original.svg` },
  { name: "Express", logo: `${CDN}/express/express-original.svg` },
  { name: "Python", logo: `${CDN}/python/python-original.svg` },
  { name: "Django", logo: `${CDN}/django/django-plain.svg` },
  { name: "FastAPI", logo: `${CDN}/fastapi/fastapi-original.svg` },
  { name: "Java", logo: `${CDN}/java/java-original.svg` },
  { name: "Spring Boot", logo: `${CDN}/spring/spring-original.svg` },
  { name: "Go", logo: `${CDN}/go/go-original.svg` },
  { name: "PostgreSQL", logo: `${CDN}/postgresql/postgresql-original.svg` },
  { name: "MongoDB", logo: `${CDN}/mongodb/mongodb-original.svg` },
  { name: "MySQL", logo: `${CDN}/mysql/mysql-original.svg` },
  { name: "Redis", logo: `${CDN}/redis/redis-original.svg` },
];

const apiSkills: Skill[] = [
  { name: "REST APIs", logo: `${CDN}/postman/postman-original.svg` },
  { name: "GraphQL", logo: `${CDN}/graphql/graphql-plain.svg` },
  { name: "Postman", logo: `${CDN}/postman/postman-original.svg` },
  { name: "Firebase", logo: `${CDN}/firebase/firebase-plain.svg` },
  { name: "Socket.io", logo: `${CDN}/socketio/socketio-original.svg` },
  { name: "Swagger", logo: `${CDN}/swagger/swagger-original.svg` },
  { name: "Supabase", logo: `${CDN}/supabase/supabase-original.svg` },
  { name: "OAuth", logo: `${CDN}/okta/okta-original.svg` },
  { name: "Stripe", logo: `${CDN}/stripe/stripe-original.svg` },
  { name: "gRPC", logo: `${CDN}/grpc/grpc-plain.svg` },
];

const toolsSkills: Skill[] = [
  { name: "Git", logo: `${CDN}/git/git-original.svg` },
  { name: "Docker", logo: `${CDN}/docker/docker-original.svg` },
  { name: "AWS", logo: `${CDN}/amazonwebservices/amazonwebservices-original.svg` },
  { name: "GCP", logo: `${CDN}/googlecloud/googlecloud-original.svg` },
  { name: "GitHub Actions", logo: `${CDN}/githubactions/githubactions-original.svg` },
  { name: "Linux", logo: `${CDN}/linux/linux-original.svg` },
  { name: "VS Code", logo: `${CDN}/vscode/vscode-original.svg` },
  { name: "Figma", logo: `${CDN}/figma/figma-original.svg` },
  { name: "Kubernetes", logo: `${CDN}/kubernetes/kubernetes-plain.svg` },
  { name: "Nginx", logo: `${CDN}/nginx/nginx-original.svg` },
  { name: "Jenkins", logo: `${CDN}/jenkins/jenkins-line.svg` },
  { name: "Vercel", logo: `${CDN}/vercel/vercel-original.svg` },
];

const categories: Category[] = [
  {
    title: "Frontend development",
    description:
      "Building fast, responsive, and pixel-perfect interfaces with React and Next.js. I focus on clean component architecture, accessible markup, and smooth animations that make products feel polished from the very first interaction.",
    skills: frontendSkills,
  },
  {
    title: "Backend development",
    description:
      "Designing reliable server-side systems and data models. From Node.js and Express to Python and Java, I build APIs and services that scale, stay secure, and hold up under real production load.",
    skills: backendSkills,
  },
  {
    title: "APIs & integrations",
    description:
      "Architecting and consuming REST and GraphQL APIs, wiring up real-time features with WebSockets, and documenting endpoints so teams can integrate quickly and confidently.",
    skills: apiSkills,
  },
  {
    title: "Tools & DevOps",
    description:
      "Shipping with confidence using Git workflows, Docker containers, and CI/CD pipelines on AWS and GCP. Comfortable across Linux environments and design tools to take a project from idea to deployment.",
    skills: toolsSkills,
  },
];

// =====================================================
// Skill chip (falls back to a letter if a logo fails)
// =====================================================

function SkillChip({ skill }: { skill: Skill }) {
  const [failed, setFailed] = useState(false);

  return (
    <li className="inline-flex items-center gap-2.5 rounded-full border border-[#E4E1DA] bg-[#FBFAF8] py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-[#2A2A2A] transition-colors duration-300 hover:border-[#7C5CE0]/50 hover:bg-white sm:text-sm">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
        {failed ? (
          <span
            className="text-[11px] font-semibold"
            style={{ color: PURPLE }}
            aria-hidden="true"
          >
            {skill.name.charAt(0)}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={skill.logo}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-4 w-4 object-contain"
          />
        )}
      </span>

      {skill.name}
    </li>
  );
}

// =====================================================
// Section
// =====================================================

export function SkillsShowcase() {
  const reduceMotion = useReducedMotion();

  const reveal = {
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  } as const;

  return (
    <section className="relative z-10 px-5 py-20 text-[#1A1A1A] sm:px-8 md:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Label + headline */}

        <motion.div {...reveal}>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8A8A8A] sm:text-[13px]">
            {SECTION_NUMBER} · Skills
          </p>

          <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Skills I&apos;ve learned{" "}
            <em className="italic" style={{ color: PURPLE }}>
              along the way.
            </em>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-[1.75] text-[#666] sm:text-lg">
            A snapshot of the languages, frameworks, and tools I reach for,
            across frontend, backend, APIs, and everything in between.
          </p>
        </motion.div>

        {/* Categories */}

        <div className="mt-14 sm:mt-16 lg:mt-20">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              {...reveal}
              className="grid gap-6 border-t border-[#E4E1DA] py-10 sm:py-12 lg:grid-cols-12 lg:gap-x-12"
            >
              <div className="lg:col-span-5">
                <h3 className="font-serif text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                  {category.title}
                </h3>

                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#6B6B6B]">
                  {category.description}
                </p>
              </div>

              <ul
                role="list"
                aria-label={`${category.title} skills`}
                className="flex flex-wrap content-start gap-2 sm:gap-2.5 lg:col-span-7"
              >
                {category.skills.map((skill) => (
                  <SkillChip key={skill.name} skill={skill} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsShowcase;