import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import PropertyCard from "../components/PropertyCard";
import { db } from "../firebase/config";
import { normalizeProperty } from "../utils/propertyHelpers";

const STATS = [
  { value: "₹52 Cr+", label: "Assets Listed" },
  { value: "2,400+", label: "Active Investors" },
  { value: "8.2%", label: "Avg. Rental Yield" },
  { value: "45+", label: "Verified Properties" },
];

const STEPS = [
  {
    step: "01",
    title: "Discover Properties",
    description:
      "Explore institutionally vetted residential, commercial, and mixed-use assets with clear yield projections.",
  },
  {
    step: "02",
    title: "Invest Fractionally",
    description:
      "Buy verified shares from ₹5,000 and gain exposure to premium property assets without full ownership.",
  },
  {
    step: "03",
    title: "Track Returns",
    description:
      "Monitor rental income, funding progress, and ownership certificates on your investor dashboard.",
  },
];

const BENEFITS = [
  {
    icon: FiTrendingUp,
    title: "Institutional Quality",
    description: "Every listing passes legal verification, due diligence, and admin review before going live.",
  },
  {
    icon: FiBarChart2,
    title: "Transparent Returns",
    description: "Clear rental yield, growth scores, and funding timelines — no hidden fees in our demo platform.",
  },
  {
    icon: FiShield,
    title: "Aligned Interests",
    description: "Properties are structured for fractional ownership with capped investor limits per asset.",
  },
  {
    icon: FiUsers,
    title: "Built for Individuals",
    description: "Access the same asset class as institutions with investments from ₹5,000.",
  },
];

const PROPERTY_TYPES = [
  {
    id: "residential",
    title: "Residential",
    description: "Premium apartments and homes in high-demand metros with stable rental occupancy.",
    image: "https://images.unsplash.com/photo-1565182999561-5c4d0e97c58e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "commercial",
    title: "Commercial",
    description: "Grade-A office and retail spaces offering stronger yields and longer lease tenures.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "mixed",
    title: "Mixed Use",
    description: "Diversified assets combining residential and commercial income streams in one investment.",
    image: "https://images.unsplash.com/photo-1553456558-aff63285bdd2?auto=format&fit=crop&w=900&q=80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const heroRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const propertiesQuery = query(
          collection(db, "properties"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const snapshot = await getDocs(propertiesQuery);
        setFeatured(
          snapshot.docs.map((docSnap) =>
            normalizeProperty({ id: docSnap.id, ...docSnap.data() })
          )
        );
      } catch {
        setFeatured([]);
      }
    };

    loadFeatured();
  }, []);

  const { isAuthenticated } = useAuth();

  // small animated counter hook
  function useCount(target, duration = 900) {
    const [n, setN] = useState(0);
    useEffect(() => {
      let start = null;
      const from = 0;
      const to = Number(String(target).replace(/[^0-9.]/g, "")) || target;
      const raf = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setN(Math.round(from + (to - from) * progress));
        if (progress < 1) requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      return () => {};
    }, [target, duration]);
    return n;
  }

  const handleHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    // small translate values
    el.style.setProperty('--px', `${dx * 18}px`);
    el.style.setProperty('--py', `${dy * 12}px`);
  };

  return (
    <div>
      <section ref={heroRef} onMouseMove={handleHeroMove} className="relative overflow-hidden hero-bg text-white">
        <div className="absolute inset-0 bg-[var(--navy)]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/75 via-[var(--navy)]/60 to-[var(--navy)]/30" />

        {/* Decorative SVG blobs */}
        <svg className="accent-blob hero-accent-1" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(180,150,80,0.12)" />
              <stop offset="100%" stopColor="rgba(10,30,70,0.14)" />
            </linearGradient>
          </defs>
          <g fill="url(#g1)">
            <ellipse cx="320" cy="90" rx="260" ry="120" />
          </g>
        </svg>

        <svg className="accent-blob hero-accent-2" viewBox="0 0 450 300" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(200,200,220,0.06)" />
              <stop offset="100%" stopColor="rgba(10,30,70,0.06)" />
            </linearGradient>
          </defs>
          <g fill="url(#g2)">
            <rect x="10" y="10" rx="36" ry="36" width="420" height="220" />
          </g>
        </svg>

        <div className="page-container relative section-pad">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            animate="visible"
            variants={fadeUp}
            className="grid gap-10 lg:grid-cols-[1.5fr_minmax(320px,1fr)] items-start"
          >
            <span className="badge badge-gold mb-6 inline-flex">
              Fractional Real Estate Platform
            </span>
            <p className="text-sm uppercase tracking-[0.36em] text-white/60">
              Manager to modern property investments
            </p>
            <h1 className="heading-display hero-heading mt-4 text-4xl md:text-6xl lg:text-7xl">
              Invest in premium real estate with institutional-grade transparency.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Own verified fractional shares in residential, commercial, and mixed-use properties.
              Track your portfolio, manage ownership, and receive digital investment reports.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <button
                type="button"
                onClick={() => navigate("/marketplace")}
                className="btn btn-primary btn-lg pulse shimmer relative overflow-hidden"
              >
                Explore Properties
                <FiArrowRight className="ml-2" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/calculator")}
                className="btn btn-outline btn-lg !border-white/30 !text-white hover:!border-[var(--gold-light)] hover:!bg-white/10 hover:!text-[var(--gold-light)]"
              >
                Calculate Returns
              </button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
              {["SEBI-style disclosures", "Verified property diligence", "Monthly rent tracking"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <FiCheckCircle className="text-[var(--gold-light)]" />
                    {item}
                  </li>
                )
              )}
            </ul>

            {/* Removed 'Why choose us' per user request */}
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-white">
        <div className="page-container section-pad">
          <div className="grid gap-8 lg:grid-cols-5 lg:items-center">
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
                Trusted by investors
              </p>
              <h2 className="heading-section mt-4">
                Backed by institutional-grade process and digital investor tools.
              </h2>
              <p className="mt-4 text-muted">
                Our demo platform brings fractional ownership to verified property assets, supported by clear disclosures,
                funding dashboards, and secure investment workflows.
              </p>
            </div>
            <div className="lg:col-span-3">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map((stat, idx) => {
                  // numeric target for simple animated counts
                  const raw = String(stat.value).replace(/[^0-9]/g, "");
                  const target = raw ? Number(raw) : stat.value;
                  const count = useCount(target, 900 + idx * 120);
                  return (
                    <motion.div key={stat.label} className="rounded-3xl border border-[var(--border)] bg-[var(--cream)] p-6 text-center"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.12 }}
                    >
                      <p className="stat-value">{typeof target === 'number' ? (count >= target ? stat.value : `${count}${stat.value.replace(/[0-9]/g,'')}`) : stat.value}</p>
                      <p className="stat-label mt-2">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section-pad bg-[var(--cream)]">
          <div className="page-container">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="divider-gold mb-4" />
                <h2 className="heading-section">Featured Opportunities</h2>
                <p className="mt-2 text-muted">
                  Hand-picked verified properties currently open for fractional investment.
                </p>
              </div>
              <Link to="/marketplace" className="btn btn-outline">
                View All Properties
                <FiArrowRight />
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad bg-white">
        <div className="page-container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="divider-gold mx-auto mb-4" />
            <h2 className="heading-section">How it works</h2>
            <p className="mt-3 text-muted">
              A simple path from property discovery to income tracking.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.step} className="card card-hover p-8">
                <span className="font-display text-5xl font-bold text-[var(--gold-pale)]">
                  {step.step}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-[var(--navy)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[var(--cream)]">
        <div className="page-container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="divider-gold mb-4" />
              <h2 className="heading-section">
                Where investing meets <span className="text-[var(--gold)]">technology</span>
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Use digital reporting, real-time funding updates, and guided insights to manage your portfolio with confidence.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Digital reports</p>
                  <p className="mt-3 text-sm text-muted">Access yield, funding, and ownership data in one dashboard.</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Transparent fees</p>
                  <p className="mt-3 text-sm text-muted">No hidden charges in this demo — just clear costs and share pricing.</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Verified assets</p>
                  <p className="mt-3 text-sm text-muted">Every listing is reviewed before going live on the marketplace.</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Investor alignment</p>
                  <p className="mt-3 text-sm text-muted">Ownership is structured to keep investor interests aligned with asset performance.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="card p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--gold-pale)] text-[var(--gold)]">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-[var(--navy)]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="page-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="divider-gold mx-auto mb-4" />
            <h2 className="heading-section">Invest Across Asset Classes</h2>
            <p className="mt-3 text-muted">
              Residential, commercial, and mixed-use opportunities for portfolio diversification.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {PROPERTY_TYPES.map((type) => (
              <article key={type.id} className="card card-hover overflow-hidden">
                <img src={type.image} alt={type.title} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold text-[var(--navy)]">{type.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{type.description}</p>
                  <button
                    type="button"
                    onClick={() => navigate(`/marketplace?category=${type.id}`)}
                    className="btn btn-outline mt-5 w-full"
                  >
                    Browse {type.title}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--navy)] py-16 text-white">
        <div className="page-container text-center">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Ready to build your real estate portfolio?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/65">
            Join a demo platform designed for clear investment decisions, digital portfolio tracking, and seamless property access.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {/** Hide the register CTA when the user is authenticated */}
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
            )}
            <Link
              to="/marketplace"
              className="btn btn-outline btn-lg !border-white/30 !text-white hover:!border-[var(--gold-light)] hover:!text-[var(--gold-light)]"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
