import Navbar from "@/components/Homepage/Navbar";
import Hero from "@/components/Homepage/Hero";
import Stats from "@/components/Homepage/Stats";
import Features from "@/components/Homepage/Features";
import InterviewerSignup from "@/components/Homepage/InterviewerSignup";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />

        {/* About Section - Brief inline description */}
        <section
          id="about"
          className="py-24 bg-white border-y border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-100 border-8 border-white">
                 <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                    alt="Collaborative Interview"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-lg font-medium opacity-90 mb-2">
                      Empowering the next generation
                    </p>
                    <p className="text-3xl font-bold">
                      Bridging the gap between knowledge and career success.
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">
                  Our Mission
                </h2>
                <h3 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  Designed by Developers, <br /> For Developers.
                </h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  DevPrep AI was founded on the belief that traditional
                  interview prep is broken. LeetCode alone isn't enough. You
                  need soft skills, architectural thinking, and the ability to
                  explain your decisions under pressure.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium">
                      Real-world interview simulations
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium">
                      Tailored feedback from industry veterans
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium">
                      End-to-end career guidance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InterviewerSignup />

        {/* CTA Section */}
        <section className="py-24 bg-brand-600 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-950 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
              Ready to crush your next interview?
            </h2>
            <p className="text-brand-100 text-xl mb-12 opacity-90">
              Join thousands of developers who have already landed roles at
              Google, Meta, and Amazon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-brand-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition shadow-2xl">
                Get Started for Free
              </button>
              <button className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition">
                View Pricing
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
