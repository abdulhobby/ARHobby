// ContactPage.jsx
import { useState } from 'react';
import { contactAPI } from '../services/api';
import SEO from '../components/common/SEO';
import {
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiSend,
  FiUser,
  FiFileText,
  FiClock,
  FiExternalLink,
  FiCheckCircle
} from 'react-icons/fi';
import { FaCoins } from "react-icons/fa";
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to your backend
      await contactAPI.submit(formData);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Get admin email from environment or use default
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'arhobby4@email.com';

      // Send admin notification email only
      const adminResult = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: adminEmail,
          from_name: formData.name,
          from_email: formData.email,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          time: formattedDate,
          currentYear: currentDate.getFullYear().toString()
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log('Admin email sent:', adminResult);

      toast.success('Message sent successfully! We will get back to you soon.');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      try {
        const customerResult = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID,
          {
            to_email: formData.email,
            to_name: formData.name,
            from_name: 'AR Hobby',
            subject: `We received your message - ${formData.subject}`,
            message: formData.message,
            currentYear: new Date().getFullYear().toString()
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        console.log('Auto-reply sent:', customerResult);

      } catch (autoReplyError) {
        console.error('Auto-reply failed (ignored):', autoReplyError);
      }
    } catch (error) {
      console.error('Email error:', error);
      toast.error(error.text || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaCoins,
      title: "100%",
      description: "Authentic Currencies",
      color: "bg-blue-500"
    },
    {
      icon: FiPhone,
      title: "Call Us",
      description: "+91 7081434589",
      link: "tel:+917081434589",
      color: "bg-primary"
    },
    {
      icon: FiMail,
      title: "Email Us",
      description: "arhobby4@gmail.com",
      link: "mailto:arhobby4@gmail.com",
      color: "bg-amber-500"
    },
    {
      icon: FaWhatsapp,
      title: "WhatsApp Us",
      description: "+91 7081434589",
      link: "https://wa.me/917081434589",
      color: "bg-green-500"
    }
  ];

  const socialLinks = [
    { icon: FaWhatsapp, href: "https://wa.me/917081434589", label: "WhatsApp", color: "bg-green-500 hover:bg-green-600" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "bg-pink-500 hover:bg-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <SEO title="Contact Us" description="Get in touch with AR Hobby" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute top-10 right-20 w-24 h-24 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 animate-fade-in">
            <FiMessageSquare className="w-5 h-5 text-primary-300" />
            <span className="text-sm font-medium text-primary-100">We'd love to hear from you</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Get in <span className="text-primary-300">Touch</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Have questions about our collection? Need help with an order? We're here to assist you!
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 sm:h-16">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 48C480 42.7 600 45.3 720 50.7C840 56 960 64 1080 66.7C1200 69.3 1320 66.7 1380 65.3L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 border border-border-light shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-sm text-text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      {item.description}
                    </a>
                  ) : (
                    <p className="text-sm text-text-secondary">{item.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left Side - Info */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full mb-4">
                  <FiMessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Contact Information</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                  Let's Start a <span className="text-primary">Conversation</span>
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Whether you're looking for a specific coin, need help with authentication,
                  or have questions about your order, our team is ready to assist you.
                </p>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                    <FaWhatsapp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-2">Quick Response on WhatsApp</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Get instant support! Chat with us directly on WhatsApp for quick responses.
                    </p>
                    <a
                      href="https://wa.me/917081434589"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-green-600 hover:shadow-lg active:scale-95"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                      Chat on WhatsApp
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-bold text-text-primary mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-95`}
                        title={social.label}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <div className="bg-white rounded-2xl border border-border-light shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                      <FiSend className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">Send us a Message</h3>
                      <p className="text-sm text-text-light">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                {submitted ? (
                  <div className="p-8 sm:p-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
                      <FiCheckCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-3">Message Sent!</h3>
                    <p className="text-text-secondary mb-6">
                      Thank you for reaching out. We've received your message and will get back to you soon.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark active:scale-95"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                          <FiUser className="w-4 h-4 text-primary" />
                          Your Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                        />
                      </div>
                      <div className="group">
                        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                          <FiMail className="w-4 h-4 text-primary" />
                          Email Address <span className="text-error">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                        <FiFileText className="w-4 h-4 text-primary" />
                        Subject <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                        <FiMessageSquare className="w-4 h-4 text-primary" />
                        Your Message <span className="text-error">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us what you're looking for..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light resize-none transition-all duration-300 focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 group-hover:border-primary-300"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-sm text-text-light">
                      By submitting, you agree to our{' '}
                      <a href="/terms-and-conditions" className="text-primary hover:underline cursor-pointer">Terms & Conditions</a>
                    </p>

                    <p className="text-center text-sm text-text-light">
                      Note: If email is not working, contact us on{' '}
                      <a
                        href="https://wa.me/917081434589"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 font-medium hover:underline"
                      >
                        WhatsApp (+91 7081434589)
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;