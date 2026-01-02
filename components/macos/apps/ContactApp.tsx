"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Linkedin, Twitter, Github } from "lucide-react";
import { useState } from "react";

export default function ContactApp() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  return (
    <div className="h-full overflow-auto bg-[#0a0a0b]">
      {/* Hero - Minimal */}
      <div 
        className="relative h-40 flex items-center justify-center border-b border-white/5"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
        }}
      >
        <div className="relative text-center px-8">
          <motion.h1 
            className="text-2xl font-medium text-white mb-2 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            className="text-white/50 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            We&apos;d love to hear from you
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="your@email.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Company</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="Your company"
                  value={formState.company}
                  onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Message</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors h-20 resize-none"
                  placeholder="How can we help?"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">Contact Information</h2>
            
            <div className="space-y-3 mb-6">
              {[
                { icon: Mail, label: "Email", value: "hello@sapira.ai" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Location", value: "San Francisco, CA" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-md border border-white/5">
                  <item.icon className="w-4 h-4 text-white/40" strokeWidth={1.5} />
                  <div>
                    <p className="text-white/40 text-xs">{item.label}</p>
                    <p className="text-white/80 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">Follow Us</h3>
            <div className="flex items-center gap-2">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-md border border-white/5 flex items-center justify-center hover:border-white/10 hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
