// AboutPage.jsx - Complete Professional Version
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Sparkles,
  Heart,
  ChevronRight,
  Quote,
  Award,
  Users,
  Calendar,
  Activity,
  Compass,
  Hand,
  Shield,
  Target,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import axios from "axios";
import BookConsultationButton from "../components/common/BookConsultationButton";

const AboutPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/experts`);
      
      if (response.data.success) {
        setExperts(response.data.experts);
      } else {
        setError("Failed to fetch experts");
      }
    } catch (error) {
      console.error("Error fetching experts:", error);
      setError("Error loading experts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Compass: Compass,
      Hand: Hand,
      Activity: Activity,
      Heart: Heart,
      Shield: Shield,
      Target: Target,
      Zap: Zap,
      Clock: Clock
    };
    return icons[iconName] || Compass;
  };

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Clients", color: "text-blue-500" },
    { icon: Calendar, value: "15+", label: "Years Experience", color: "text-green-500" },
    { icon: Star, value: "4.9", label: "Average Rating", suffix: "/5", color: "text-yellow-500" },
    { icon: Award, value: "25+", label: "Awards Won", color: "text-purple-500" }
  ];

  const philosophies = [
    { icon: Activity, title: "Holistic Healing", desc: "Integrating body, mind, and spirit for complete wellness", color: "from-green-500 to-emerald-600" },
    { icon: Compass, title: "Space Harmony", desc: "Creating balanced environments that nurture success", color: "from-blue-500 to-cyan-600" },
    { icon: Hand, title: "Self Discovery", desc: "Unlocking your true potential through ancient arts", color: "from-purple-500 to-pink-600" },
    { icon: Shield, title: "Authentic Wisdom", desc: "Time-tested practices passed through generations", color: "from-orange-500 to-red-600" },
    { icon: Target, title: "Personalized Guidance", desc: "Custom solutions tailored to your unique needs", color: "from-teal-500 to-emerald-600" },
    { icon: Zap, title: "Transformative Results", desc: "Real, measurable changes in your life journey", color: "from-yellow-500 to-orange-600" }
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Homemaker", text: "Anuja's Vastu consultation transformed my home's energy. Within weeks, I noticed positive changes in family harmony and peace.", rating: 5, image: null },
    { name: "Rahul Mehta", role: "Business Owner", text: "The numerology guidance helped me choose the perfect business name. My business has seen 40% growth since then!", rating: 5, image: null },
    { name: "Neha Gupta", role: "Software Engineer", text: "Himesh's palmistry reading gave me incredible clarity about my career path. I'm now pursuing my passion with confidence.", rating: 5, image: null },
    { name: "Amit Patel", role: "Architect", text: "The Vastu principles I learned have completely changed how I design spaces. My clients love the positive energy.", rating: 5, image: null },
    { name: "Sneha Reddy", role: "Yoga Practitioner", text: "Shrivya's guidance helped me deepen my practice. I feel more connected to myself than ever before.", rating: 5, image: null },
    { name: "Vikram Singh", role: "Entrepreneur", text: "The palmistry session revealed strengths I never knew I had. Highly recommended for anyone seeking direction.", rating: 5, image: null }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading our experts...</p>
          <p className="text-sm text-gray-400 mt-1">Preparing spiritual guidance for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-red-500 mb-4 font-medium">{error}</p>
          <button 
            onClick={fetchExperts} 
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-orange-50/30 to-red-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6 text-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-red-100/10 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Meet Our Spiritual Masters
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent"
          >
            Guiding You to Your
            <br />
            <span className="text-gray-800">Highest Self</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Three masters, three ancient sciences, one mission — to help you discover balance, 
            harmony, and purpose in every aspect of your life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <BookConsultationButton />
            <button className="px-6 py-3 border-2 border-red-500 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {experts.map((member, index) => {
          const ExpertIcon = getIconComponent(member.icon);
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={member._id}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 md:gap-16 items-center mb-24 last:mb-0`}
            >
              {/* Image Section with Decorative Elements */}
              <div className="lg:w-1/2 relative group">
                <div className={`absolute -inset-3 bg-gradient-to-r ${member.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700`}></div>
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-auto object-contain group-hover:scale-105 transition duration-700"
                  />
                  {/* Decorative Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 shadow-lg">
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>4.9 Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 space-y-6">
                <div className={`inline-flex items-center gap-2 ${member.bgColor} rounded-full px-4 py-2`}>
                  <ExpertIcon className={`w-4 h-4 ${member.iconColor}`} />
                  <span className={`text-sm font-semibold ${member.iconColor}`}>{member.role}</span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                  {member.name}
                  <div className={`w-20 h-1 bg-gradient-to-r ${member.color} mt-3 rounded-full`}></div>
                </h2>

                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(500+ reviews)</span>
                </div>

                <p className={`font-semibold text-lg ${member.iconColor}`}>{member.expertise}</p>

                <Quote className="w-8 h-8 text-gray-300" />

                <div className="text-gray-600 leading-relaxed space-y-4">
                  {member.intro ? (
                    member.intro.split('\n\n').slice(0, 2).map((paragraph, idx) => (
                      <p key={idx} className="text-base">{paragraph}</p>
                    ))
                  ) : (
                    <p>Expert in {member.role} with years of experience guiding people toward balance and harmony.</p>
                  )}
                </div>

                {/* Specialties Tags */}
                {member.specialties && member.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className={`text-xs px-3 py-1 rounded-full ${member.bgColor} ${member.iconColor} font-medium`}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${member.iconColor}`}>15+</div>
                    <div className="text-xs text-gray-500">Years Exp</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${member.iconColor}`}>500+</div>
                    <div className="text-xs text-gray-500">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${member.iconColor}`}>100%</div>
                    <div className="text-xs text-gray-500">Satisfaction</div>
                  </div>
                </div>

                <BookConsultationButton />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Thousands of lives transformed through ancient wisdom and modern guidance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition group"
              >
                <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition`} />
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</h3>
                <p className="mt-2 text-white/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Our Philosophy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ancient Wisdom for <span className="text-red-600">Modern Living</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Combining time-tested practices with contemporary understanding for lasting transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {philosophies.map((item, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-center border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 px-6 bg-gradient-to-br from-red-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              Client Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Real experiences from real people who transformed their lives with our guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition group"
              >
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-gray-200 mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rating Summary */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-gray-800">4.9</span>
              <span className="text-gray-500">out of 5</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">2,500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-6 text-center bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Begin Your Journey
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Life? 🌟
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Connect with our experts and take the first step toward a more balanced, harmonious, and purposeful life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <BookConsultationButton />
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Explore Services
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 text-white/70 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>Authentic Guidance</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;