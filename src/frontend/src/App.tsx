import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ChevronDown,
  Clock,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type * as THREE from "three";
import { useGetAllReviews, useSubmitReview } from "./hooks/useQueries";

// ─── Gold Particles Three.js ───────────────────────────────────────────────
function GoldParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      spd[i] = 0.2 + Math.random() * 0.4;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.008;
      pos[i * 3] += Math.sin(t * speeds[i] + i) * 0.003;
      if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6;
    }
    geo.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#C8A24A"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function SparkleParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    (pointsRef.current.material as THREE.PointsMaterial).opacity =
      0.4 + Math.sin(t * 1.5) * 0.3;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#F2DFA6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Section Fade Hook ──────────────────────────────────────────────────────
function useSectionFade() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1 },
    );
    for (const el of document.querySelectorAll(".section-fade")) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`transition-transform hover:scale-110 ${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={20}
            className={
              star <= value ? "fill-gold text-gold" : "text-muted-foreground"
            }
            style={{
              color: star <= value ? "#C8A24A" : undefined,
              fill: star <= value ? "#C8A24A" : "none",
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Services Data ─────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "facial",
    name: "Facial & Skin Care",
    desc: "Deep cleansing, anti-aging & brightening facials for radiant, glowing skin",
    price: "₹299 onwards",
    img: "/assets/generated/service-facial.dim_800x600.jpg",
  },
  {
    id: "bridal",
    name: "Bridal Makeup",
    desc: "Complete bridal packages with trial session, HD makeup & finishing",
    price: "₹2,999 onwards",
    img: "/assets/generated/service-bridal.dim_800x600.jpg",
  },
  {
    id: "hair",
    name: "Hair Styling",
    desc: "Haircuts, color, keratin treatment, blowout & styling for every occasion",
    price: "₹199 onwards",
    img: "/assets/generated/service-hair.dim_800x600.jpg",
  },
  {
    id: "mehendi",
    name: "Mehendi / Henna",
    desc: "Bridal & party mehendi with intricate designs by expert artists",
    price: "₹199 onwards",
    img: "/assets/generated/service-mehendi.dim_800x600.jpg",
  },
  {
    id: "threading",
    name: "Threading & Waxing",
    desc: "Eyebrow threading, facial hair removal & full-body waxing services",
    price: "₹30 onwards",
    img: "/assets/generated/service-threading.dim_800x600.jpg",
  },
  {
    id: "nails",
    name: "Nail Art",
    desc: "Manicure, pedicure, nail extensions & creative nail art designs",
    price: "₹149 onwards",
    img: "/assets/generated/service-nails.dim_800x600.jpg",
  },
];

const SAMPLE_REVIEWS = [
  {
    name: "Priya Sharma",
    comment:
      "Absolutely amazing experience! The bridal makeup was flawless and the mehendi designs were stunning. Highly recommend Surbhi Creation!",
    rating: BigInt(5),
  },
  {
    name: "Neha Joshi",
    comment:
      "Best parlour in Haldwani! The facial treatment left my skin glowing for weeks. Very professional and hygienic environment.",
    rating: BigInt(5),
  },
  {
    name: "Kavya Pant",
    comment:
      "Got my hair coloring done here and I love the results. The staff is very skilled and welcoming. Will definitely come back!",
    rating: BigInt(4),
  },
];

const GALLERY_IMAGES = [
  {
    key: "interior1",
    src: "/assets/generated/parlour-interior1.dim_800x600.jpg",
    alt: "Parlour Interior",
    className: "col-span-1 row-span-2",
  },
  {
    key: "bridal",
    src: "/assets/generated/service-bridal.dim_800x600.jpg",
    alt: "Bridal Makeup",
    className: "col-span-1 row-span-1",
  },
  {
    key: "facial",
    src: "/assets/generated/service-facial.dim_800x600.jpg",
    alt: "Facial Treatment",
    className: "col-span-1 row-span-1",
  },
  {
    key: "interior2",
    src: "/assets/generated/parlour-interior2.dim_800x600.jpg",
    alt: "Parlour Interior 2",
    className: "col-span-2 row-span-1",
  },
  {
    key: "hero",
    src: "/assets/generated/parlour-hero.dim_1600x900.jpg",
    alt: "Surbhi Creation",
    className: "col-span-1 row-span-1",
  },
];

const NAV_ITEMS = ["HOME", "SERVICES", "GALLERY", "REVIEWS", "CONTACT"];

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  useSectionFade();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: reviews, isLoading: reviewsLoading } = useGetAllReviews();
  const submitReview = useSubmitReview();

  const [reviewForm, setReviewForm] = useState({
    name: "",
    comment: "",
    rating: 5,
  });
  const [submitted, setSubmitted] = useState(false);

  const displayReviews =
    reviews && reviews.length > 0 ? reviews : SAMPLE_REVIEWS;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await submitReview.mutateAsync(reviewForm);
      toast.success("Thank you for your review!");
      setSubmitted(true);
      setReviewForm({ name: "", comment: "", rating: 5 });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background font-lato">
      <Toaster />

      {/* ── STICKY HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream-light/95 backdrop-blur-sm border-b border-gold/20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
            <span className="font-playfair font-bold text-lg text-parlour-brown tracking-wide">
              SURBHI <span className="text-gold">CREATION</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                data-ocid={`nav.${item.toLowerCase()}.link`}
                onClick={() => scrollTo(item.toLowerCase())}
                className="font-lato text-xs tracking-widest text-parlour-muted hover:text-gold transition-colors uppercase"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="nav.book_now.button"
              onClick={() => scrollTo("contact")}
              className="gold-sheen hidden md:block px-5 py-2 bg-gold text-white text-xs font-lato tracking-widest uppercase rounded font-bold hover:-translate-y-0.5 transition-transform shadow-gold"
            >
              BOOK NOW
            </button>
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X size={20} className="text-parlour-brown" />
              ) : (
                <Menu size={20} className="text-parlour-brown" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-cream-light border-t border-gold/20 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-4">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => scrollTo(item.toLowerCase())}
                    className="text-left font-lato text-xs tracking-widest text-parlour-muted hover:text-gold transition-colors uppercase"
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => scrollTo("contact")}
                  className="gold-sheen w-full py-2 bg-gold text-white text-xs font-lato tracking-widest uppercase rounded font-bold"
                >
                  BOOK NOW
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/generated/parlour-hero.dim_1600x900.jpg')`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-parlour-brown/50" />

        {/* Three.js Canvas */}
        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <GoldParticles />
            <SparkleParticles />
          </Canvas>
        </div>

        {/* Hero Text */}
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-lato text-gold-light tracking-[0.4em] text-sm uppercase mb-4"
          >
            Welcome to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-playfair text-5xl md:text-7xl font-bold text-gold tracking-wide mb-3"
            style={{ textShadow: "0 2px 20px rgba(200,162,74,0.4)" }}
          >
            SURBHI CREATION
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-playfair text-2xl md:text-3xl text-cream-light italic mb-4"
          >
            Elegance Unveiled
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-lato text-cream-dark text-base tracking-widest mb-10"
          >
            YOUR BEAUTY, OUR PASSION
          </motion.p>
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            data-ocid="hero.primary_button"
            onClick={() => scrollTo("services")}
            className="gold-sheen px-10 py-4 bg-gold text-white font-lato font-bold tracking-[0.2em] uppercase text-sm rounded hover:-translate-y-1 transition-transform shadow-gold"
          >
            Explore Services
          </motion.button>
        </div>

        {/* Scroll Down Arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-cream-light/60 text-xs font-lato tracking-widest">
            SCROLL
          </span>
          <ChevronDown size={24} className="text-gold animate-scroll-bounce" />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="section-fade text-center mb-16">
            <p className="font-lato text-gold text-xs tracking-[0.4em] uppercase mb-3">
              What We Offer
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-parlour-brown font-bold">
              OUR PREMIER <span className="text-gold">SERVICES</span>
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                data-ocid={`services.item.${i + 1}`}
                className="section-fade bg-card rounded-lg overflow-hidden shadow-xs hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 group border border-border"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="overflow-hidden h-48">
                  <img
                    src={service.img}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-playfair text-xl text-parlour-brown font-bold mb-2">
                    {service.name}
                  </h3>
                  <p className="font-lato text-sm text-parlour-muted mb-4 leading-relaxed">
                    {service.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="bg-gold/10 text-gold font-lato font-bold text-sm px-3 py-1 rounded-full border border-gold/30">
                      {service.price}
                    </span>
                    <button
                      type="button"
                      data-ocid={`services.book_now.button.${i + 1}`}
                      onClick={() => scrollTo("contact")}
                      className="gold-sheen font-lato text-xs tracking-widest uppercase px-4 py-2 bg-parlour-brown text-cream-light rounded hover:bg-gold transition-colors font-bold"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <div className="section-fade text-center mb-16">
            <p className="font-lato text-gold text-xs tracking-[0.4em] uppercase mb-3">
              A Peek Inside
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-parlour-brown font-bold">
              OUR <span className="text-gold">PARLOUR</span>
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          <div className="section-fade grid grid-cols-3 grid-rows-2 gap-3 h-[500px] md:h-[600px]">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={img.key}
                data-ocid={`gallery.item.${i + 1}`}
                className={`overflow-hidden rounded-lg ${img.className} group cursor-pointer`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="section-fade text-center mb-16">
            <p className="font-lato text-gold text-xs tracking-[0.4em] uppercase mb-3">
              What They Say
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-parlour-brown font-bold">
              CLIENT <span className="text-gold">REVIEWS</span>
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          {/* Reviews Grid */}
          {reviewsLoading ? (
            <div
              data-ocid="reviews.loading_state"
              className="flex justify-center py-16"
            >
              <Loader2 className="animate-spin text-gold" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {displayReviews.map((review, i) => (
                <div
                  key={review.name}
                  data-ocid={`reviews.item.${i + 1}`}
                  className="section-fade bg-card border border-border rounded-lg p-6 hover:shadow-card-hover transition-shadow"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <StarRating value={Number(review.rating)} />
                  <p className="font-lato text-sm text-parlour-muted mt-3 mb-4 italic leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <p className="font-playfair font-bold text-parlour-brown text-sm">
                    — {review.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          <div className="section-fade max-w-xl mx-auto bg-card border border-border rounded-lg p-8">
            <h3 className="font-playfair text-2xl text-parlour-brown font-bold mb-2 text-center">
              Share Your Experience
            </h3>
            <p className="font-lato text-sm text-parlour-muted text-center mb-6">
              We'd love to hear from you
            </p>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  data-ocid="reviews.success_state"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 bg-gold/10 border border-gold/30 rounded text-center text-gold font-lato text-sm font-bold"
                >
                  ✨ Thank you for your wonderful review!
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label
                  htmlFor="review-name"
                  className="font-lato text-xs tracking-widest uppercase text-parlour-muted mb-1.5 block"
                >
                  Your Name
                </label>
                <Input
                  id="review-name"
                  data-ocid="reviews.input"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Enter your name"
                  className="border-border focus:border-gold focus:ring-gold bg-background"
                />
              </div>
              <div>
                <p className="font-lato text-xs tracking-widest uppercase text-parlour-muted mb-1.5">
                  Rating
                </p>
                <StarRating
                  value={reviewForm.rating}
                  onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))}
                />
              </div>
              <div>
                <label
                  htmlFor="review-comment"
                  className="font-lato text-xs tracking-widest uppercase text-parlour-muted mb-1.5 block"
                >
                  Your Review
                </label>
                <Textarea
                  id="review-comment"
                  data-ocid="reviews.textarea"
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((p) => ({ ...p, comment: e.target.value }))
                  }
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="border-border focus:border-gold focus:ring-gold bg-background resize-none"
                />
              </div>
              <Button
                type="submit"
                data-ocid="reviews.submit_button"
                disabled={submitReview.isPending}
                className="gold-sheen w-full bg-gold hover:bg-gold-dark text-white font-lato font-bold tracking-widest uppercase text-xs py-3 h-auto rounded"
              >
                {submitReview.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 bg-parlour-brown">
        <div className="max-w-6xl mx-auto px-4">
          <div className="section-fade text-center mb-16">
            <p className="font-lato text-gold text-xs tracking-[0.4em] uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-cream-light font-bold">
              CONNECT WITH <span className="text-gold">US</span>
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          <div className="section-fade grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone size={20} className="text-gold" />
                </div>
                <div>
                  <p className="font-lato text-xs tracking-widest uppercase text-gold mb-1">
                    Call Us
                  </p>
                  <a
                    href="tel:+910279989578"
                    data-ocid="contact.phone.link"
                    className="font-playfair text-xl text-cream-light hover:text-gold transition-colors"
                  >
                    +91-08279989578
                  </a>
                  <p className="font-lato text-sm text-cream-dark/60 mt-1">
                    For bookings & enquiries
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={20} className="text-gold" />
                </div>
                <div>
                  <p className="font-lato text-xs tracking-widest uppercase text-gold mb-1">
                    Location
                  </p>
                  <p className="font-playfair text-xl text-cream-light">
                    Near Keshav Plaza
                  </p>
                  <p className="font-lato text-sm text-cream-dark/70 mt-1">
                    Halduchaur, Haldwani
                    <br />
                    Uttarakhand 263142
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock size={20} className="text-gold" />
                </div>
                <div>
                  <p className="font-lato text-xs tracking-widest uppercase text-gold mb-1">
                    Working Hours
                  </p>
                  <p className="font-lato text-sm text-cream-dark/80">
                    <span className="text-cream-light font-bold">
                      Mon – Sat:
                    </span>{" "}
                    9:00 AM – 8:00 PM
                    <br />
                    <span className="text-cream-light font-bold">Sunday:</span>{" "}
                    10:00 AM – 6:00 PM
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-ocid="contact.book_now.button"
                onClick={() => scrollTo("reviews")}
                className="gold-sheen mt-4 px-8 py-3 bg-gold text-white font-lato font-bold tracking-widest uppercase text-xs rounded hover:-translate-y-0.5 transition-transform shadow-gold"
              >
                Book an Appointment
              </button>
            </div>

            {/* Google Maps */}
            <div className="rounded-lg overflow-hidden h-80 border-2 border-gold/30">
              <iframe
                title="Surbhi Creation Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3481.0!2d79.5224!3d29.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zKeshav+Plaza+Halduchaur+Haldwani!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-parlour-brown border-t border-gold/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                  <span className="text-white text-xs font-bold">SC</span>
                </div>
                <span className="font-playfair font-bold text-lg text-cream-light">
                  SURBHI <span className="text-gold">CREATION</span>
                </span>
              </div>
              <p className="font-lato text-sm text-cream-dark/60 italic">
                Your Beauty, Our Passion
              </p>
            </div>

            {/* Nav Links */}
            <div>
              <p className="font-lato text-xs tracking-widest uppercase text-gold mb-4">
                Quick Links
              </p>
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => scrollTo(item.toLowerCase())}
                    className="block font-lato text-sm text-cream-dark/60 hover:text-gold transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Mini */}
            <div>
              <p className="font-lato text-xs tracking-widest uppercase text-gold mb-4">
                Contact
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+910279989578"
                  className="flex items-center gap-2 font-lato text-sm text-cream-dark/60 hover:text-gold transition-colors"
                >
                  <Phone size={14} /> +91-08279989578
                </a>
                <p className="flex items-start gap-2 font-lato text-sm text-cream-dark/60">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  Near Keshav Plaza, Halduchaur, Haldwani, Uttarakhand 263142
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gold/10 pt-6 text-center">
            <p className="font-lato text-xs text-cream-dark/40">
              © {new Date().getFullYear()} Surbhi Creation. Made with ❤️ in
              Haldwani.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                Built with caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
