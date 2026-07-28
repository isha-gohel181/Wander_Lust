// client/src/pages/AboutUs.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Globe, Heart, Shield, Sparkles, Users, MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Happy Travelers", value: "50K+" },
  { label: "Destinations", value: "120+" },
  { label: "Verified Hosts", value: "8K+" },
  { label: "5-Star Reviews", value: "200K+" },
];

const values = [
  {
    icon: Heart,
    title: "Passion for Travel",
    description:
      "We believe travel is more than a trip — it's a transformation. Every journey is a chance to discover the world and yourself.",
    color: "from-rose-400 to-pink-500",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Your safety is our priority. Every host and property is verified, so you can explore with complete peace of mind.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Globe,
    title: "Global Community",
    description:
      "We connect curious travelers with welcoming hosts across 120+ destinations — bridging cultures and creating lifelong memories.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Unique Experiences",
    description:
      "From beachfront villas to mountain cabins, we curate one-of-a-kind stays that you won't find anywhere else.",
    color: "from-amber-400 to-orange-500",
  },
];

const team = [
  {
    name: "Aria Patel",
    role: "Co-Founder & CEO",
    bio: "Former backpacker turned entrepreneur. Aria has visited 60+ countries and built Wanderlust to share that joy with the world.",
    initials: "AP",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Marcus Chen",
    role: "Co-Founder & CTO",
    bio: "Tech visionary with a love for adventure. Marcus architects the platform that powers millions of seamless travel experiences.",
    initials: "MC",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    name: "Sofia Rivera",
    role: "Head of Community",
    bio: "A hospitality expert who believes every traveler deserves to feel at home, wherever in the world they roam.",
    initials: "SR",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    name: "James Okafor",
    role: "Head of Design",
    bio: "Award-winning designer passionate about crafting beautiful interfaces that make travel planning an absolute delight.",
    initials: "JO",
    gradient: "from-emerald-500 to-teal-600",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <MapPin className="w-4 h-4" /> Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            We Live &amp; Breathe{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              Travel
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed mb-10">
            Wanderlust was born from a simple idea — that every person deserves
            an extraordinary place to stay and a story worth telling. We're on a
            mission to make the world feel a little smaller, and a lot more
            wonderful.
          </p>
          <Link to="/search">
            <Button
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-full px-8 py-3 shadow-lg transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Explore Destinations
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-indigo-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-indigo-200 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-snug">
              Connecting People Through the{" "}
              <span className="text-indigo-600">Joy of Discovery</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Founded in 2022, Wanderlust started as a small team of travel
              enthusiasts frustrated by impersonal booking experiences. We set
              out to build a platform that truly understood the traveler — one
              that felt as personal as asking a friend for a recommendation.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Today, we're proud to serve over 50,000 travelers and 8,000 hosts
              worldwide, helping them create authentic connections and
              unforgettable memories in 120+ destinations across the globe.
            </p>
          </div>

          {/* Visual card grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "🏖️", label: "Beach Escapes", count: "2,400+ stays" },
              { emoji: "🏔️", label: "Mountain Retreats", count: "1,800+ stays" },
              { emoji: "🏙️", label: "City Apartments", count: "3,200+ stays" },
              { emoji: "🌿", label: "Nature Hideaways", count: "1,100+ stays" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gradient-to-br from-slate-50 to-indigo-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                <p className="text-indigo-500 text-xs mt-1">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Our Core Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            The People Behind It
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Meet Our Team
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            A passionate group of travelers, designers, and engineers united by
            a shared love for exploration.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="text-center group"
            >
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}
              >
                {member.initials}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
              <p className="text-indigo-500 text-sm font-medium mt-0.5 mb-3">
                {member.role}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="w-10 h-10 mx-auto mb-5 text-yellow-300 fill-yellow-300" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of travelers who've already discovered their perfect
            stay with Wanderlust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold rounded-full px-8 py-3 shadow-lg transition-all"
              >
                Browse Stays
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 font-semibold rounded-full px-8 py-3 transition-all"
              >
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
