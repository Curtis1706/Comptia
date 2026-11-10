"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Clock,
  Check,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { trackEvent } from "@/lib/analytics";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: "",
    entreprise: "",
    email: "",
    telephone: "",
    sujet: "demo",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      trackEvent("generate_lead", {
        lead_source: "contact_form",
        subject: formData.sujet,
      });
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Dans quel délai l'équipe Ceilow répond-elle aux demandes ?",
      a: "Du lundi au vendredi, de 8h00 à 18h30 (heure de Cotonou), notre équipe vous répond par WhatsApp ou e-mail sous 2 heures ouvrables maximum.",
    },
    {
      q: "Proposez-vous des démonstrations dans nos bureaux à Cotonou ?",
      a: "Oui. Pour les entreprises et cabinets situés à Cotonou, Calavi et Porto-Novo, un conseiller peut se déplacer dans vos locaux pour une démonstration sur vos cas réels.",
    },
    {
      q: "Pouvez-vous nous aider à paramétrer notre compte au départ ?",
      a: "Oui. Un conseiller dédié vous aide étape par étape à créer votre dossier, connecter votre entreprise à la DGI et importer vos clients et articles.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col font-sans selection:bg-primary selection:text-ink">
      <style jsx>{`
        /* Animation vectorielle : Message WhatsApp & envol */
        .bubble-pop {
          animation: pop-bubble 3.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: 120px 85px;
        }
        .plane-flight {
          animation: fly-plane 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: 155px 50px;
        }
        .sparkle-star {
          fill: #FFD946; stroke: #332E29; stroke-width: 1;
          animation: pop-sparkle 3.2s ease-in-out infinite;
        }
        @keyframes pop-bubble {
          0%, 15% { transform: scale(0.8); opacity: 0; }
          30%, 80% { transform: scale(1); opacity: 1; }
          95%, 100% { transform: scale(0.9); opacity: 0; }
        }
        @keyframes fly-plane {
          0% { transform: translate(-25px, 25px) scale(0.6) rotate(-10deg); opacity: 0; }
          30% { transform: translate(0px, 0px) scale(1) rotate(0deg); opacity: 1; }
          75% { transform: translate(15px, -15px) scale(1.05) rotate(5deg); opacity: 1; }
          100% { transform: translate(35px, -35px) scale(0.8) rotate(15deg); opacity: 0; }
        }
        @keyframes pop-sparkle {
          0%, 35% { transform: scale(0) rotate(0deg); opacity: 0; }
          45% { transform: scale(1.2) rotate(45deg); opacity: 1; }
          60% { transform: scale(1) rotate(90deg); opacity: 1; }
          75%, 100% { transform: scale(0) rotate(180deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bubble-pop,
          .plane-flight,
          .sparkle-star {
            animation: none;
          }
        }
      `}</style>

      <PublicHeader />

      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 border-b border-border bg-background">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Contact</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted mb-3 block">
                Contact &amp; assistance directe
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-ink leading-tight mb-6">
                Une équipe locale à Cotonou à votre écoute.
              </h1>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8">
                Vous avez une question sur la facturation e-MECeF DGI, le démarrage de votre dossier ou vous souhaitez une démonstration ? Écrivez-nous sur WhatsApp (+229 01 97 55 49 53) ou utilisez le formulaire ci-dessous.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/2290197554953"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-ink font-bold px-7 py-3.5 rounded-xl hover:opacity-95 transition-all text-center min-h-[48px] flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Écrire sur WhatsApp</span>
                </a>
                <a
                  href="#formulaire"
                  className="bg-background-secondary text-ink font-bold px-7 py-3.5 rounded-xl border border-border hover:border-ink transition-all text-center min-h-[48px] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer un message</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION ANIMATION VECTORIELLE SVG : MESSAGE WHATSAPP */}
        <section className="py-12 md:py-16 bg-background border-b border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-56 h-40 mx-auto mb-3 flex items-center justify-center">
              <svg height="100%" viewBox="0 0 240 160" width="100%" xmlns="http://www.w3.org/2000/svg">
                <rect x="75" y="25" width="90" height="120" rx="16" fill="#332E29" stroke="#332E29" strokeWidth="2.5" />
                <rect x="80" y="32" width="80" height="105" rx="10" fill="#F5F4F2" />
                <rect x="105" y="28" width="30" height="3" rx="1.5" fill="#8A857D" />

                <g className="bubble-pop">
                  <rect x="90" y="55" width="60" height="42" rx="10" fill="#FFD946" stroke="#332E29" strokeWidth="2" />
                  <polygon points="98,97 94,106 106,97" fill="#FFD946" stroke="#332E29" strokeWidth="2" strokeLinejoin="round" />
                  <line x1="100" y1="68" x2="138" y2="68" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <line x1="100" y1="78" x2="128" y2="78" stroke="#332E29" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="138" cy="85" r="3" fill="#332E29" />
                </g>

                <g className="plane-flight">
                  <path d="M 145 55 L 180 35 L 165 65 L 158 55 L 145 55 Z" fill="#FFFFFF" stroke="#332E29" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M 180 35 L 158 55" stroke="#332E29" strokeWidth="2" />
                </g>

                <g className="sparkle-star" transform="translate(55, 45)">
                  <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" />
                </g>
                <g className="sparkle-star" style={{ animationDelay: "1.2s" }} transform="translate(195, 95)">
                  <path d="M 0 -5 L 1.2 -1.2 L 5 0 L 1.2 1.2 L 0 5 L -1.2 1.2 L -5 0 L -1.2 -1.2 Z" />
                </g>
              </svg>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight mb-2">
              Un conseiller répond en direct à vos questions
            </h2>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              Pas de ticket anonyme : notre équipe à Cotonou échange directement avec vous par WhatsApp ou e-mail.
            </p>
          </div>
        </section>

        {/* SECTION FORMULAIRE ET COORDONNÉES */}
        <section className="py-16 md:py-20 bg-background-secondary border-b border-border" id="formulaire">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* COORDONNÉES, HORAIRES & PHOTO ÉQUIPE (GAUCHE) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl overflow-hidden border border-border bg-background shadow-md">
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src="/images/equipe-support-cotonou.jpg"
                      alt="Équipe support clientèle Ceilow dans leurs bureaux à Cotonou"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 bg-background border-t border-border flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-ink block">Service client &amp; accompagnement</span>
                      <span className="text-[11px] text-text-muted">Avenue Jean-Paul II, Cotonou</span>
                    </div>
                    <span className="text-xs font-semibold text-success-deep shrink-0">
                      Réponse sous 2h ouvrées
                    </span>
                  </div>
                </div>

                <div className="bg-background p-6 sm:p-8 rounded-2xl border border-border">
                  <h3 className="text-lg font-bold text-ink mb-6">
                    Nos bureaux à Cotonou
                  </h3>

                  <div className="space-y-6 text-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-ink" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-text-muted block mb-1">
                          Échange WhatsApp direct
                        </span>
                        <a
                          href="https://wa.me/2290197554953"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink font-bold hover:underline transition-colors text-sm inline-block"
                        >
                          +229 01 97 55 49 53
                        </a>
                        <p className="text-xs text-text-muted mt-0.5">
                          Assistance directe du lundi au vendredi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-ink" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-text-muted block mb-1">
                          Adresse
                        </span>
                        <p className="text-ink leading-relaxed">
                          Avenue Jean-Paul II, Haie Vive / Ganhi
                          <br />
                          Cotonou, République du Bénin
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-ink" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-text-muted block mb-1">
                          Horaires d&apos;ouverture
                        </span>
                        <p className="text-ink leading-relaxed">
                          Du lundi au vendredi
                          <br />
                          De 8h00 à 18h30 (heure de Cotonou)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-ink" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-text-muted block mb-1">
                          Adresse e-mail
                        </span>
                        <a href="mailto:contact@ceilow.com" className="text-ink font-semibold hover:underline">
                          contact@ceilow.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-6 rounded-2xl border border-border">
                  <span className="text-xs font-bold uppercase text-text-muted block mb-2">
                    Engagement de réponse
                  </span>
                  <div className="flex items-center gap-2 text-sm text-ink font-bold mb-1">
                    <Check className="w-4 h-4 text-success-deep shrink-0" />
                    <span>Réponse sous 2 heures ouvrables</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Votre demande est traitée directement par un membre de notre équipe à Cotonou.
                  </p>
                </div>
              </div>

              {/* FORMULAIRE DE CONTACT (DROITE) */}
              <div className="lg:col-span-7 bg-background p-6 sm:p-10 rounded-2xl border border-border">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-display text-ink tracking-tight mb-2">
                    Envoyez-nous un message
                  </h2>
                  <p className="text-sm text-text-muted">
                    Indiquez vos coordonnées ci-dessous, un conseiller vous répond rapidement.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-background-secondary border border-border text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary text-ink flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-2">
                      Message envoyé
                    </h3>
                    <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
                      Merci pour votre message. Un conseiller Ceilow vous répondra rapidement à l&apos;adresse {formData.email || "indiquée"}.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          nom: "",
                          entreprise: "",
                          email: "",
                          telephone: "",
                          sujet: "demo",
                          message: "",
                        });
                      }}
                      className="bg-background border border-border text-xs font-bold px-4 py-2.5 rounded-xl hover:border-ink transition-all min-h-[44px] cursor-pointer"
                    >
                      Nouveau message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-nom" className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1.5">
                          Votre nom complet *
                        </label>
                        <input
                          id="contact-nom"
                          type="text"
                          required
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          placeholder="Ex : Jean Dossou"
                          className="w-full bg-background-secondary border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-entreprise" className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1.5">
                          Nom de votre entreprise *
                        </label>
                        <input
                          id="contact-entreprise"
                          type="text"
                          required
                          value={formData.entreprise}
                          onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                          placeholder="Ex : Bénin Logistique Sarl"
                          className="w-full bg-background-secondary border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1.5">
                          Adresse e-mail *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jean@entreprise.com"
                          className="w-full bg-background-secondary border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-tel" className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1.5">
                          Téléphone / WhatsApp *
                        </label>
                        <input
                          id="contact-tel"
                          type="tel"
                          required
                          value={formData.telephone}
                          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                          placeholder="Ex : +229 01 97 55 49 53"
                          className="w-full bg-background-secondary border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-sujet" className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1.5">
                        Objet de votre demande
                      </label>
                      <select
                        id="contact-sujet"
                        value={formData.sujet}
                        onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                        className="w-full bg-background-secondary border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                      >
                        <option value="demo">Demande de démonstration</option>
                        <option value="cabinet">Partenariat cabinet comptable</option>
                        <option value="devis">Questions sur les tarifs</option>
                        <option value="support">Aide technique et facturation DGI</option>
                        <option value="autre">Autre question</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1.5">
                        Votre message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Décrivez votre activité, vos questions ou vos besoins..."
                        className="w-full bg-background-secondary border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-ink font-bold py-3.5 px-6 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 min-h-[48px] shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "Envoi en cours..." : "Envoyer le message"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDÉON */}
        <section className="py-16 md:py-24 bg-background">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-2">
                Questions fréquentes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink tracking-tight">
                Tout savoir sur notre accompagnement
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-2xl bg-background overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-ink text-base hover:bg-background-secondary/50 transition-colors cursor-pointer min-h-[48px]"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-text-muted shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-text-muted leading-relaxed border-t border-border pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter className="w-full" />
    </div>
  );
}
