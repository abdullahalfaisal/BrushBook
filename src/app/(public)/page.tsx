import Link from "next/link"
import { getSupabase } from "@/lib/supabase"
import ServiceCard from "@/components/ServiceCard"
import AnimatedSection from "@/components/AnimatedSection"
import Testimonials from "@/components/Testimonials"
import GallerySection from "@/components/GallerySection"
import { Shield, Star, Clock, ArrowRight, CheckCircle, ChevronDown, Home, ThumbsUp } from "lucide-react"

export const dynamic = "force-dynamic"

const features = [
  {
    icon: Shield,
    title: "Prep Work You Can't See — But You'll Feel",
    desc: "We use premium drop cloths, furniture covers, and dust barriers. Every switch plate removed, every crack caulked, every surface sanded before the first coat.",
  },
  {
    icon: Star,
    title: "Sherwin-Williams Paint — Included",
    desc: "No upcharges for premium paint. We use Duration & SuperPaint from Sherwin-Williams — one of the most durable, washable finishes on the market.",
  },
  {
    icon: Clock,
    title: "We Leave It Cleaner Than We Found It",
    desc: "Full cleanup daily — no dried paint spots, no dusty floors, no forgotten tools. We treat your home like our own.",
  },
]

const faqs = [
  { q: "How long does a typical room take?", a: "Most bedrooms and living rooms take 1–2 days. Kitchens and cabinets run 2–4 days. We'll give you a precise timeline during your free quote." },
  { q: "Do I need to move my furniture?", a: "We move and protect all furniture with shrink wrap and pads. Large items we can work around. You don't need to lift a finger." },
  { q: "What paint brands do you use?", a: "We're a Sherwin-Williams preferred contractor. We use Duration and SuperPaint — washable, scuff-resistant, and backed by a lifetime warranty." },
  { q: "Do you offer a warranty on your work?", a: "Yes. All interior work comes with a 2-year workmanship warranty. If a painted surface chips, peels, or cracks due to our application, we fix it free." },
  { q: "How do you handle quotes and pricing?", a: "We provide a fixed-price quote after walking your space — no hourly surprises. Most quotes are completed within 24 hours of the site visit." },
]

export default async function HomePage() {
  const supabase = getSupabase()
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("name")

  return (
    <>
      <section className="hero-noise relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-mid to-stone-800 text-white">
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:pt-24">
          <h1 className="animate-fade-up text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Protect &amp; Beautify
            <br />
            <span className="text-shimmer">Your Home</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-400" style={{ animationDelay: "0.1s" }}>
            Professional interior and exterior painting. Premium Sherwin-Williams paint, meticulous prep, and a 2-year workmanship guarantee.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/book/interior-painting"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brass px-8 py-3.5 text-sm font-semibold text-brand-dark shadow-lg shadow-brass/30 transition hover:bg-white hover:shadow-xl sm:w-auto animate-pulse-glow"
            >
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View Our Services
            </Link>
          </div>
          <div className="animate-fade-up mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brass">
                <Home className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-brass">500+</div>
              <div className="text-stone-400">Homes Painted</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brass">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-brass">12</div>
              <div className="text-stone-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brass">
                <ThumbsUp className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-brass">98%</div>
              <div className="text-stone-400">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brass">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-brass">2 yr</div>
              <div className="text-stone-400">Workmanship Warranty</div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section id="services" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <span className="inline-block rounded-full bg-stone-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500">
                Craftsmanship
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                Our Services
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-stone-500">
                Expert painting and decorating services tailored to your property
              </p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
              {services?.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>
            {(!services || services.length === 0) && (
              <p className="mt-12 text-center text-stone-400">
                No services available at the moment. Please check back later.
              </p>
            )}
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section id="portfolio" className="bg-cream py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500 shadow-sm">
                  Our Work
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                  Recent Projects
                </h2>
                <p className="mt-3 text-stone-500">
                  Browse our portfolio of completed projects. From cozy living rooms to commercial spaces, see the quality our team delivers.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <GallerySection />
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section id="testimonials" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <span className="inline-block rounded-full bg-stone-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500">
                Testimonials
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                What Our Customers Say
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-stone-500">
                Real feedback from homeowners, designers, and businesses who trusted us with their spaces.
              </p>
            </div>
            <div className="mt-8">
              <Testimonials />
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section id="why-us" className="bg-cream py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500 shadow-sm">
                Why Choose Us
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                Quality & Care
              </h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-xl border border-stone-200/60 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brass/5 blur-xl transition-all group-hover:scale-[3] group-hover:opacity-100" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-rose-500/20 text-brass shadow-sm transition group-hover:bg-gradient-to-br group-hover:from-brass group-hover:to-sage group-hover:text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-semibold text-brand-dark">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section id="faq" className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center">
              <span className="inline-block rounded-full bg-stone-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500">
                FAQ
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
                Common Questions
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-stone-500">
                Everything you need to know before your free consultation.
              </p>
            </div>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group cursor-pointer rounded-xl border border-stone-200 transition hover:border-stone-300 hover:bg-stone-50">
                  <summary className="flex items-center justify-between px-6 py-4 text-sm font-semibold text-brand-dark">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 text-stone-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-4 text-sm leading-relaxed text-stone-500">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Ready to Transform Your Space?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-500">
              Book a free consultation with our team. No obligation, just expert advice.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/book/interior-painting"
                className="inline-flex items-center gap-2 rounded-full bg-brass px-8 py-3.5 text-sm font-semibold text-brand-dark shadow-lg shadow-brass/30 transition hover:bg-white hover:shadow-xl"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-8 py-3.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </>
  )
}
