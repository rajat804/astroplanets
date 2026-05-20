// ServicesPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FaCheck, FaStar, FaChevronDown } from "react-icons/fa";
import BookConsultationButton from "../components/common/BookConsultationButton";
/* ---------- Helpers ---------- */
const Accent = ({ children }) => (
  <span className="text-green-600">{children}</span>
);

const CTA = ({ children, className = "", ...rest }) => (
  <button
    {...rest}
    className={
      "inline-flex items-center gap-3 px-5 py-2 rounded-2xl font-semibold shadow-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition " +
      className
    }
  >
    {children}
  </button>
);

/* ---------- HERO ---------- */
const Hero = () => {

  const { user } = useAuth();

  return (
    <section className="relative bg-gradient-to-b from-orange-50/50 to-offWhite py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Talk to our experts about <Accent>Astro, Numero, Vastu, Yoga</Accent> & more
        </h1>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          From astrology to vastu, numerology, and personalized wellness — find
          the right guidance and tools crafted for your journey.
        </p>

        <div className="mt-6">
          <BookConsultationButton
            prefillData={{
              name: user?.name || "",
              email: user?.email || "",
              phone: user?.phone || "",
            }}
          />
        </div>
      </div>
    </section>
  );
};

/* ---------- SERVICE CATEGORIES ---------- */
const Categories = () => {
  const cats = [
    {
      name: "Astrology Readings",
      desc: "Get clarity on career, relationships, and life path.",
      img: "https://images.unsplash.com/photo-1622649517030-0e0597f5b6a1",
    },
    {
      name: "Numerology Insights",
      desc: "Decode your life numbers and cycles with expert reports.",
      img: "https://images.unsplash.com/photo-1605170439002-22c3da6a142a",
    },
    {
      name: "Vastu Consultations",
      desc: "Balance your space with ancient architectural wisdom.",
      img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    },
    {
      name: "Wellness & Yoga",
      desc: "Mind-body harmony through guided practices.",
      img: "https://images.unsplash.com/photo-1554344056-591b3d3f197d",
    },
  ];

  return (
    <section className="py-14 bg-offWhite">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Service Categories</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden hover:-translate-y-1 transition border border-orange-100"
            >
              <img
                src={c.img}
                alt={c.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {c.name}
                </h3>
                <p className="text-gray-600 text-sm">{c.desc}</p>
                <button className="mt-3 text-red-600 font-semibold text-sm hover:text-red-700 transition">
                  Learn more →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



/* ---------- PRICING PACKAGES ---------- */
const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "₹999",
      features: ["15-min consultation", "1 follow-up email", "Basic notes"],
      popular: false,
    },
    {
      name: "Premium",
      price: "₹2,999",
      features: [
        "60-min consultation",
        "Detailed chart report",
        "Priority booking",
        "Free gemstone guide",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "₹5,999",
      features: [
        "90-min session",
        "Full written report",
        "3 follow-up emails",
        "Exclusive remedies kit",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Flexible Packages</h2>
        <p className="text-gray-600 mt-2">
          Choose a plan that suits your journey best.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-2xl transition ${
                p.popular 
                  ? "bg-gradient-to-br from-red-50 to-offWhite border-2 border-red-200" 
                  : "bg-offWhite border border-orange-100"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
              <div className="text-3xl font-extrabold text-red-600 mt-2">
                {p.price}
              </div>
              <ul className="mt-4 text-sm space-y-2 text-gray-600 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <FaCheck className="text-red-500 text-xs" /> {f}
                  </li>
                ))}
              </ul>
              <CTA className="mt-6">Choose Plan</CTA>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


/* ---------- FAQ ---------- */
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: "How do I book a consultation?",
      a: "Simply select your desired service, pick a slot, and checkout securely online.",
    },
    {
      q: "Are remedies included?",
      a: "Basic remedies are shared during sessions. Premium kits are available in our shop.",
    },
    {
      q: "Can I reschedule?",
      a: "Yes, up to 24 hours before your session without extra charge.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, UPI, and net banking through secure payment gateways.",
    },
  ];

  return (
    <section className="py-16 bg-offWhite">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Frequently Asked</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 cursor-pointer border border-orange-100 hover:shadow-md transition"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex justify-between w-full items-center font-semibold text-gray-800"
              >
                {f.q}
                <FaChevronDown
                  className={`transition text-red-500 ${
                    open === i ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-sm text-gray-600"
                  >
                    {f.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- MAIN PAGE ---------- */
const ServicesPage = () => {
  return (
    <main className="bg-offWhite">
      <Hero />
      <Categories />
      <Pricing />
      <FAQ />
    </main>
  );
};

export default ServicesPage;