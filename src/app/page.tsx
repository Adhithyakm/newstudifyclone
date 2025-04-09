"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Inter, Montserrat } from "next/font/google";

// Load fonts
const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"] });

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to StudiFy",
      description:
        "Your comprehensive college learning platform designed to elevate your academic journey",
      bgImage: "bg-[url('/images/abstract-bg-1.jpg')]",
      overlay: "bg-white/80",
    },
    {
      title: "Interactive Live Sessions",
      description:
        "Engage in real-time classes with professors and alumni. Get your doubts cleared instantly.",
      bgImage: "bg-[url('/images/abstract-bg-2.jpg')]",
      overlay: "bg-white/80",
    },
    {
      title: "AI-Powered Assistance",
      description:
        "Our smart chatbot is available 24/7 to answer your questions and guide your studies.",
      bgImage: "bg-[url('/images/abstract-bg-3.jpg')]",
      overlay: "bg-white/80",
    },
    {
      title: "Comprehensive Study Materials",
      description:
        "Access notes, presentations, and resources for all subjects in one place.",
      bgImage: "bg-[url('/images/abstract-bg-4.jpg')]",
      overlay: "bg-white/80",
    },
    {
      title: "Skill Development",
      description:
        "Enhance your aptitude with quizzes and skill-building exercises tailored for college students.",
      bgImage: "bg-[url('/images/abstract-bg-5.jpg')]",
      overlay: "bg-white/80",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${inter.className}`}>
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-sm py-4 px-6 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
            S
          </div>
          <h1
            className={`text-2xl font-bold text-gray-800 ${montserrat.className}`}
          >
            StudiFy
          </h1>
        </div>
        <Link
          href="/login"
          className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md flex items-center space-x-2 ${montserrat.className} font-semibold`}
        >
          <span>Get Started</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </nav>

      {/* Main Slideshow */}
      <div className="flex-grow relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              slide.bgImage
            } bg-cover bg-center ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className={`absolute inset-0 ${slide.overlay}`}></div>

            <div className="relative z-10 h-full flex items-center justify-center px-4">
              <div className="text-center max-w-2xl space-y-6">
                <h1
                  className={`text-4xl md:text-5xl font-bold text-gray-800 ${montserrat.className}`}
                >
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex justify-center space-x-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === currentSlide
                          ? "bg-blue-600 w-6"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm py-6 text-center border-t border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 mb-2">
            © {new Date().getFullYear()} StudiFy
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
