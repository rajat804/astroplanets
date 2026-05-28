// ContactPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";

import SocialMediaSection from "../components/SocialMediaSection";
import BookConsultationButton from "../components/common/BookConsultationButton";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      details: ["contact.astroplanets@gmail.com"],
      link: "mailto:contact.astroplanets@gmail.com",
      color: "from-red-50 to-orange-50"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      details: ["+91 91751 96579", "+91 99107 55649"],
      link: "tel:+919175196579",
      color: "from-orange-50 to-red-50"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Visit Us",
      details: ["Astro Planets Store, Noida Sector 62, UP"],
      link: "#",
      color: "from-red-50 to-amber-50"
    }
  ];

  const faqs = [
    {
      q: "How quickly do you respond to inquiries?",
      a: "We typically respond within 24-48 hours during business days."
    },
    {
      q: "Do you offer consultations?",
      a: "Yes! We offer personalized consultations via video call. Book through our services page."
    },
    {
      q: "Can I visit your physical store?",
      a: "Absolutely! Our store is open Monday-Saturday, 10 AM - 7 PM. Walk-ins are welcome!"
    }
  ];

  // Social Media Links
  const socialLinks = [
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Facebook",
      url: "https://facebook.com/astroplanets",
      color: "hover:bg-blue-600"
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "Instagram",
      url: "https://instagram.com/astroplanets",
      color: "hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600"
    },
    {
      icon: <Twitter className="w-6 h-6" />,
      name: "Twitter",
      url: "https://twitter.com/astroplanets",
      color: "hover:bg-sky-500"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      name: "LinkedIn",
      url: "https://linkedin.com/company/astroplanets",
      color: "hover:bg-blue-700"
    },
  ];

  return (
    <div className="bg-offWhite text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 text-center bg-gradient-to-br from-red-50 via-orange-50 to-offWhite">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Get in Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions, feedback, or want to collaborate? We'd love to hear from you.
            Our team is here to help you on your cosmic journey.
          </p>
        </motion.div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-6">We'll get back to you within 24 hours</p>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">Message sent successfully! We'll contact you soon.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-xl bg-orange-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${errors.name ? 'border-red-500' : 'border-orange-200'
                    }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 border rounded-xl bg-orange-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${errors.email ? 'border-red-500' : 'border-orange-200'
                    }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className={`w-full px-4 py-3 border rounded-xl bg-orange-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${errors.subject ? 'border-red-500' : 'border-orange-200'
                    }`}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  className={`w-full px-4 py-3 border rounded-xl bg-orange-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none ${errors.message ? 'border-red-500' : 'border-orange-200'
                    }`}
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Connect With Us</h3>
              <p className="text-gray-600 text-sm">We're here to answer your questions</p>
            </div>

            {contactInfo.map((info, idx) => (
              <motion.a
                key={idx}
                href={info.link}
                target={info.title === "Visit Us" ? "_blank" : "_self"}
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                className={`block bg-gradient-to-r ${info.color} p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-orange-100 group`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-red-500 group-hover:scale-110 transition">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 mt-1">{detail}</p>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-orange-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Clock className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Business Hours</h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p>Saturday: 10:00 AM - 5:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Frequently Asked <span className="text-red-600">Questions</span>
            </h2>
            <p className="text-gray-600">Find quick answers to common questions</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-offWhite rounded-xl p-6 border border-orange-100 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800 mb-3">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SocialMediaSection />

      {/* Let's Connect Section with Social Media */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-red-600 to-red-700 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-4">Let's Connect 🌟</h2>
          <p className="mb-10 text-lg text-white/90">
            Have a project in mind or just want to say hi? Reach out today!
          </p>

          {/* Social Media Icons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 transition-all ${social.color}`}
              >
                <div className="text-2xl md:text-3xl">
                  {social.icon}
                </div>
              </motion.a>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-white text-red-600 font-semibold rounded-xl shadow-lg hover:bg-orange-50 transition"
            >
              <BookConsultationButton />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Join Newsletter
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactPage;