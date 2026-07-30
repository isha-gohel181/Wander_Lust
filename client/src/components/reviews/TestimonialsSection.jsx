import React from "react";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Thompson",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Wanderlust made our dream vacation a reality. The booking process was seamless, and the property exceeded our expectations. We couldn't have asked for a better experience!",
  },
  {
    name: "James Mitchell",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The variety of properties available is incredible. From cozy cabins to luxury villas, I found the perfect place for every trip. Highly recommend to anyone looking for unique stays.",
  },
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "As a solo traveler, safety and comfort are my top priorities. Wanderlust's verified properties and transparent reviews gave me peace of mind throughout my journey.",
  },
  {
    name: "Michael Chen",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    text: "What sets Wanderlust apart is the quality of their hosts. Every interaction was warm and professional. I've discovered places I would never have found on my own.",
  },
  {
    name: "Emma Wilson",
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Our family vacation was absolutely magical thanks to Wanderlust. The booking was easy, the communication was excellent, and the property was exactly as described.",
  },
  {
    name: "Carlos Garcia",
    location: "Barcelona, Spain",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "I've been using Wanderlust for over two years now, and they never disappoint. Their customer service is outstanding, and the properties are always top-notch.",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-wanderlust-500 text-wanderlust-500" : "fill-gray-200 text-gray-200"
        }`}
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block text-wanderlust-500 font-semibold text-sm tracking-wide uppercase mb-3">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from travelers who found their perfect getaway with us.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-wanderlust-100"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-wanderlust-100 group-hover:text-wanderlust-200 transition-colors duration-300" />

              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 ring-2 ring-wanderlust-100 ring-offset-2">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback className="bg-wanderlust-100 text-wanderlust-700">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <StarRating rating={testimonial.rating} />

              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
