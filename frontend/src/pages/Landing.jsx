import React, { useState } from "react";
import Stepper, { Step } from '../react-components/Stepper';
import StaggeredMenu from '../react-components/StaggeredMenu';

import { Link } from "react-router-dom";

// Mobile menu items based on your current menu
const menuItems = [
  { label: 'Features', ariaLabel: "Go to Features", link: '#features', type: 'anchor' },
  { label: 'How it Works', ariaLabel: "Go to How it Works", link: '#how-it-works', type: 'anchor' },
  { label: 'Docs', ariaLabel: "Visit Docs section", link: '#docs', type: 'anchor' },
  { label: 'Login', ariaLabel: "Go to Login", link: '/login', type: 'route' }, 
];

// Social items can be updated as needed, using your default example for demo:
const socialItems = [ 
  { label: 'Documentation', link: '#' }, 
];

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 bg-[#0a0f1c]/90 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-1.5 rounded-md">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Apilogs</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          <Link
            to="/register"
            className="bg-black text-white px-4 py-2 rounded-md font-medium transition-transform duration-150 active:scale-98 hover:scale-110 shadow-lg ring-1 ring-gray-500/50"
            style={{ display: 'inline-block' }}
          >
            Get Started
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>
 
      {menuOpen && (
        <div style={{ height: '100vh', background: '#1a1a1a', position: 'fixed', inset: 0, zIndex: 50 }}>
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials
            displayItemNumbering={true}
            menuButtonColor="#ffffff"
            openMenuButtonColor="#fff"
            changeMenuColorOnOpen={true}
            colors={['#B19EEF', '#5227FF']} 
            accentColor="#5227FF"
            open={menuOpen}
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
            renderItem={(item, idx) => {
              if (item.type === 'anchor') {
                return (
                  <a
                    key={item.label}
                    href={item.link}
                    aria-label={item.ariaLabel}
                    className="block w-full px-3 py-2 font-medium rounded hover:bg-black/10 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              } else if (item.type === 'route') {
                return (
                  <Link
                    key={item.label}
                    to={item.link}
                    aria-label={item.ariaLabel}
                    className={`block w-full px-3 py-2 font-medium rounded ${item.isPrimary ? "bg-black text-white hover:bg-neutral-700" : "hover:bg-black/10 hover:text-black/70"} transition text-center`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              } else {
                return null;
              }
            }}
          />
        </div>
      )}

      <main className="flex flex-col items-center"> 
        <section
          className="w-full min-h-[92vh] flex items-center justify-center bg-black relative overflow-hidden"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* BG PARTICLE/GRADIENT WHITE EFFECT */}
          <div className="pointer-events-none absolute inset-0 z-0">
            {/* Left white sweep (10-15% width, particles by blending transparent/white spots) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '3%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 70%, rgba(0,0,0,0) 100%)',
                filter: 'blur(10px)',
                zIndex: 1,
              }}
            />
            {/* Right white sweep */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '6%',
                height: '100%',
                background: 'linear-gradient(270deg, rgba(255,255,255,0.19) 0%, rgba(255,255,255,0.08) 70%, rgba(0,0,0,0) 100%)',
                filter: 'blur(19px)',
                zIndex: 1,
              }}
            />
            {/* A few white "particles" for a random look */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(i < 3 ? (7 + 5 * i) : (100 - (8 + 5 * (i - 3))))}%`,
                  top: `${15 + Math.random() * 70}%`,
                  width: `${8 + Math.random() * 12}px`,
                  height: `${8 + Math.random() * 14}px`,
                  borderRadius: '100%',
                  background: 'rgba(255,255,255,0.16)',
                  filter: 'blur(1.5px)',
                  opacity: 0.5 + 0.3 * Math.random(),
                  zIndex: 2,
                }}
              />
            ))}
            {/* Existing blue radial tint */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(37,99,235,0.10) 0%, transparent 70%)',
                zIndex: 0,
              }}
            />
          </div>
          <div className="w-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-14 py-16 sm:py-20 lg:py-12 z-10 relative max-w-[90%] mx-auto">
            <div className="relative flex flex-col items-center w-full">
              <p
                className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-5 text-center"
                style={{ color: 'rgba(151, 201, 243, 1)' }}
              >
                Real-Time API Observability
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.08] mb-6 tracking-tight text-center">
                <span
                  className="font-extrabold bebas-neue-regular"
                  style={{
                    textTransform: 'uppercase'
                  }}
                >
                  THE FASTEST WAY TO
                </span>
                <br />
                <em
                  className="not-italic font-light"
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontStyle: 'italic',
                    background:
                      'linear-gradient(90deg, #fff 0%, #a5b4fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  debug your backend
                </em>
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed mb-10 sm:mb-12 max-w-lg text-center"
                style={{ color: 'gray' }}
              >
                Monitor logs, errors, and incidents in real time. Apilogs gives developers instant visibility into system activity with a blazing-fast live dashboard.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <Link
                  to="/register"
                  className="cursor-pointer border-4 border-black bg-gray-500 transition-all duration-100 ease-in-out select-none active:pb-0 active:mb-[10px] active:translate-y-[10px] inline-block pb-2 sm:pb-[10px] sm:active:pb-0 sm:active:mb-[10px] sm:active:translate-y-[10px] w-full sm:w-auto"
                >
                  <div className="bg-[#dddddd] border-4 border-white w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-center">
                    <span className="text-base sm:text-[1.2rem] tracking-[0.5px] sm:tracking-[1px] text-black font-bold whitespace-nowrap">
                      Get Started Free →
                    </span>
                  </div>
                </Link>
                <Link
                  to="/login"
                  className="hidden sm:inline-block cursor-pointer border-4 border-black bg-gray-500 transition-all duration-100 ease-in-out select-none active:pb-0 active:mb-[10px] active:translate-y-[10px] pb-2 sm:pb-[10px] sm:active:pb-0 sm:active:mb-[10px] sm:active:translate-y-[10px] w-full sm:w-auto"
                >
                  <div className="bg-[#dddddd] border-4 border-white w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-center">
                    <span className="text-base sm:text-[1.2rem] tracking-[0.5px] sm:tracking-[1px] text-black font-bold whitespace-nowrap">
                      login
                    </span>
                  </div>
                </Link>
              </div>
              <p
                className="mt-6 text-xs text-center"
                style={{ color: '#475569' }}
              >
                No setup complexity. Start monitoring in minutes.
              </p>
            </div>
          </div>
        </section>
        
 
        <section id="features" className="w-full py-20 sm:py-32 px-4 bg-black border-t border-white/5">
          <div className="max-w-6xl mx-auto">

            {/* Section header */}
            <div className="mb-14 sm:mb-20">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-3">Why it matters</p>
              <h2
                className="text-3xl sm:text-4xl md:text-6xl font-extrabold bebas-neue-regular text-white leading-tight"
                style={{
                  textTransform: 'uppercase'
                }}
              >
                Built for developers<br />
                <em
                  className="not-italic font-light"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontStyle: 'italic',
                    background: 'linear-gradient(90deg,#fff 0%,#94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  who ship fast.
                </em>
              </h2>
            </div> 
            {(() => {
              const features = [
                {
                  num: '01', 
                  title: 'Debugging Errors',
                  desc: 'Stop guessing where the bug is. Trace errors back to the source instantly with full stack context.',
                  accent: '#ef4444',
                },
                {
                  num: '02', 
                  title: 'System Activity',
                  desc: 'Understand what your system is doing right now, not what it did yesterday. Every event timestamped.',
                  accent: '#6b8cff',
                },
                {
                  num: '03', 
                  title: 'Early Detection',
                  desc: 'Catch incidents before your customers do. Get alerted the moment metrics spike abnormally.',
                  accent: '#facc15',
                },
                {
                  num: '04', 
                  title: 'Service Failures',
                  desc: 'Track downtime and service health across your entire microservices architecture in one view.',
                  accent: '#a78bfa',
                },
              ];
              const [slide, setSlide] = React.useState(0);

              // Helper for touch interaction
              const touchStartX = React.useRef(0);
              const touchEndX = React.useRef(0);

              const handleTouchStart = (e) => {
                touchStartX.current = e.touches[0].clientX;
              };

              const handleTouchMove = (e) => {
                touchEndX.current = e.touches[0].clientX;
              };

              const handleTouchEnd = () => {
                if (touchStartX.current - touchEndX.current > 50 && slide < features.length - 1) {
                  setSlide(slide + 1);
                } else if (touchEndX.current - touchStartX.current > 50 && slide > 0) {
                  setSlide(slide - 1);
                }
              };

              return (
                <div className="relative w-full max-w-2xl mx-auto">
                  
                  <div
                    className="overflow-hidden " 
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${slide * 100}%)`
                      }}
                    >
                      {features.map((f, i) => (
                        <div
                          key={f.num}
                          className="min-w-full px-6 py-10 flex flex-col items-center justify-center"
                        >
                          <div
                            className="rounded-full w-14 h-14 flex items-center justify-center mb-5"
                            style={{ background: f.accent + "33" }}
                          >
                            <span
                              className="text-2xl font-bold"
                              style={{ color: f.accent }}
                            >
                              {f.num}
                            </span>
                          </div>
                          <h3 className="font-bold text-xl mb-3 text-white text-center">{f.title}</h3>
                          <p className="text-slate-300 text-center">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center mt-4 gap-2">
                    {features.map((_, idx) => (
                      <button
                        key={idx}
                        className={`h-2 w-2 rounded-full ${slide === idx ? "bg-white" : "bg-white/30"}`}
                        onClick={() => setSlide(idx)}
                        style={{ outline: "none", border: "none" }}
                        aria-label={`Go to feature ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows (for desktop) */}
                  <button
                    onClick={() => setSlide((s) => Math.max(s - 1, 0))}
                    disabled={slide === 0}
                    aria-label="Previous feature"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full focus:outline-none hover:bg-black transition disabled:opacity-40 disabled:pointer-events-none hidden sm:block"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSlide((s) => Math.min(s + 1, features.length - 1))}
                    disabled={slide === features.length - 1}
                    aria-label="Next feature"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full focus:outline-none hover:bg-black transition disabled:opacity-40 disabled:pointer-events-none hidden sm:block"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────── */}
        <section id="how-it-works" className="w-full py-20 sm:py-32 px-4 bg-black border-t border-white/5">
          <div className="max-w-6xl mx-auto">

            <div className="mb-14 sm:mb-20 text-center">
              <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-3">Workflow</p>
              <h2
                className="text-3xl sm:text-4xl md:text-6xl font-extrabold bebas-neue-regular text-white"
                style={{ letterSpacing: '-0.02em',textTransform: 'uppercase'  }}
              >
                Up and running<br />
                <em
                  className="not-italic font-light"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontStyle: 'italic',
                    background: 'linear-gradient(90deg,#fff 0%,#94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  in three steps.
                </em>
              </h2>
            </div>

            <div className="w-full max-w-3xl mx-auto px-0 sm:px-6 md:px-8 py-10 bg-[#0c1020] rounded-xl shadow-lg border border-blue-800/10 relative overflow-visible">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {[1,2,3].map((n, i) => (
                  <div
                    key={n}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-lg transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, #4338CA, #6366F1)`,
                      opacity: 0.85,
                      outline: '4px solid #fff', outlineOffset: '-5px',
                      transform: i === 0 ? 'translateY(8px)' : i === 2 ? 'translateY(8px)' : 'none',
                      zIndex: 2
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <Stepper
                initialStep={1}
                onStepChange={() => {}}
                onFinalStepCompleted={() => {}}
                backButtonText={
                  <>
                    <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    Previous
                  </>
                }
                nextButtonText={
                  <>
                    Next
                    <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </>
                }
                stepIndicatorClassName="hidden" // We'll use our own
                className="mt-12"
                stepHeaderClassName="text-blue-300 tracking-wider uppercase font-bold text-xs mb-1 text-center"
                stepContentClassName="text-center"
                stepActiveShadow
              >
                <Step>
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <circle cx="30" cy="30" r="30" fill="url(#paint0_linear)" />
                        <path d="M20 38V26.5C20 25.1193 21.1193 24 22.5 24H37.5C38.8807 24 40 25.1193 40 26.5V38" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="25" y="34" width="10" height="4" rx="2" fill="white" fillOpacity="0.18"/>
                        <defs>
                          <linearGradient id="paint0_linear" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6366F1"/>
                            <stop offset="1" stopColor="#4338CA"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold bebas-neue-regular text-white mb-2 tracking-tight">
                      Create a Project
                    </h2>
                    <p className="text-base sm:text-lg text-blue-100/85 leading-relaxed mt-1 max-w-md mx-auto">
                      Register and create a dedicated project space <br className="hidden sm:block"/>to monitor your specific application or service.
                    </p>
                  </div>
                </Step>
                <Step>
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <circle cx="30" cy="30" r="30" fill="url(#paint1_linear)" />
                        <path d="M20 27H40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                        <rect x="20" y="33" width="20" height="5" rx="2.5" fill="white" fillOpacity="0.18"/>
                        <path d="M24 22v-4M36 22v-4" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                        <defs>
                          <linearGradient id="paint1_linear" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#818CF8"/>
                            <stop offset="1" stopColor="#3730A3"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold bebas-neue-regular text-white mb-2 tracking-tight">
                      Send Events
                    </h2>
                    <p className="text-base sm:text-lg text-blue-100/85 leading-relaxed mt-1 max-w-md mx-auto">
                      Use our simple REST API or SDKs to send logs, errors, and custom events <br className="hidden sm:block"/>from your backend services.
                    </p>
                  </div>
                </Step>
                <Step>
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <circle cx="30" cy="30" r="30" fill="url(#paint2_linear)" />
                        <path d="M27 37h6v-6h3V23H24v8h3v6z" stroke="white" strokeWidth="2.4" strokeLinejoin="round" fill="white" fillOpacity="0.08"/>
                        <ellipse cx="30" cy="32" rx="11" ry="4.5" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.08"/>
                        <defs>
                          <linearGradient id="paint2_linear" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#06b6d4"/>
                            <stop offset="1" stopColor="#3b82f6"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold bebas-neue-regular text-white mb-2 tracking-tight">
                      Monitor Live
                    </h2>
                    <p className="text-base sm:text-lg text-blue-100/85 leading-relaxed mt-1 max-w-md mx-auto">
                      Watch events appear instantly in your dashboard.<br className="hidden sm:block"/>
                      Filter, search, and analyze issues in real-time.
                    </p>
                  </div>
                </Step>
              </Stepper>
            </div>
          </div>
        </section>

        {/* ── Code / Integration Section ───────────────────────── */}
        <section className="w-full py-20 sm:py-32 px-4 bg-black border-t border-white/5">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">Integration</p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold bebas-neue-regular text-white mb-5"
                style={{ letterSpacing: '-0.02em', transform: 'translateY(-0.1em)', textTransform: 'uppercase' }}
              >
                Drop-in,<br />
                <em
                  className="not-italic font-light"
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontStyle: 'italic',
                    background: 'linear-gradient(90deg,#fff 0%,#94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  zero drama.
                </em>
              </h2>
              <p className="text-white/40 text-base mb-10 leading-relaxed">
                No complex agents or sidecars. Send a standard HTTP POST whenever something important happens — that's all.
              </p>

              <div className="space-y-5">
                {[
                  { title: 'Standard JSON Payload', desc: "Send structured data that's easy to query later." },
                  { title: 'Secure Authentication',  desc: 'API keys ensure only your services can ingest data.' },
                  { title: 'Any Language',           desc: 'Node, Python, Go, Java, PHP — if it speaks HTTP, it works.' },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{f.title}</p>
                      <p className="text-white/35 text-sm mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — terminal card */}
            <div
              className="rounded-2xl overflow-hidden border border-white/10"
              style={{ background: '#0d0d0d', boxShadow: '0 0 60px rgba(0,0,0,0.7)' }}
            >
              {/* Terminal bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs font-mono text-white/30">POST /api/events/ingest/{"{projectId}"}</span>
              </div>
              {/* Code body */}
              <div className="p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
                <pre className="!m-0 text-white/60"><code>
<span className="text-purple-400">POST</span> /api/events/ingest/<span className="text-white/30">{"{projectId}"}</span>

<span className="text-white/25">Headers:</span>
  x-api-key: <span className="text-emerald-400">op_live_8374928374...</span>
  Content-Type: <span className="text-emerald-400">application/json</span>

<span className="text-white/25">Body:</span>
<span>{"{"}</span>
  &nbsp;<span className="text-sky-400">"service"</span>: <span className="text-emerald-400">"auth-service"</span>,
  <br/>&nbsp;<span className="text-sky-400">"severity"</span>: <span className="text-yellow-400">"ERROR"</span>,
  <br/>&nbsp;<span className="text-sky-400">"message"</span>: <span className="text-emerald-400">"User registration failed"</span>,
  <br/>&nbsp;<span className="text-sky-400">"environment"</span>: <span className="text-emerald-400">"production"</span>
<br/><span>{"}"}</span>
</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ──────────────────────────────────────── */}
        <section className="w-full py-20 sm:py-32 px-4 bg-black border-t border-white/5 relative overflow-hidden">
          {/* Soft glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(37,99,235,0.10) 0%, transparent 70%)',
            }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/25 mb-5">Get started today</p>
            <h2
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Start monitoring<br />
              <em
                className="not-italic font-light"
                style={{
                  fontFamily: "'Georgia', serif",
                  fontStyle: 'italic',
                  background: 'linear-gradient(90deg,#fff 0%,#64748b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                your application today.
              </em>
            </h2>
            <p className="text-white/35 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of developers who rely on Apilogs for real-time visibility into their production systems.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-full text-black font-bold text-sm tracking-wide bg-white hover:bg-slate-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] text-center"
              >
                Create Free Account →
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-full text-white/70 font-semibold text-sm tracking-wide border border-white/15 hover:border-white/35 hover:text-white transition-all text-center"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-[#0a0f1c] py-10 sm:py-12 px-4 border-t border-slate-900">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-1.5 rounded-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Apilogs</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">GitHub Repo</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">License</a>
            </div>
            
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Apilogs. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
