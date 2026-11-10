"use client";

import React from "react";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { ArrowLeft, BookOpen, Calculator, Home, MessageSquare } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { CeilowGlobe } from "@/components/ui/ceilow-globe";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const globeVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 8 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
  floating: {
    y: [-4, 4],
    transition: {
      duration: 4.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

export interface NotFoundProps {
  title?: string;
  description?: string;
  backText?: string;
}

export default function NotFound({
  title = "Cette page est introuvable",
  description = "Le lien suivi n'existe plus ou a été déplacé. Repartez vers l'accueil ou consultez nos guides comptables et fiscaux.",
  backText = "Retour à l'accueil",
}: NotFoundProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-background text-ink font-sans antialiased selection:bg-primary selection:text-ink">
        <PublicHeader className="sticky top-0 z-50 w-full" />

        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            className="w-full max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Composition 4 [Globe] 4 */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8">
              <motion.span
                className="font-display text-7xl sm:text-8xl md:text-9xl font-bold text-ink select-none tabular-nums leading-none"
                variants={fadeUp}
              >
                4
              </motion.span>

              <motion.div
                className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 shrink-0"
                variants={globeVariants}
                animate={["visible", "floating"]}
              >
                <CeilowGlobe className="w-full h-full max-w-none" />
              </motion.div>

              <motion.span
                className="font-display text-7xl sm:text-8xl md:text-9xl font-bold text-ink select-none tabular-nums leading-none"
                variants={fadeUp}
              >
                4
              </motion.span>
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-text-muted block mb-3">
              Erreur 404 : page introuvable
            </span>

            <motion.h1
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink mb-4"
              variants={fadeUp}
            >
              {title}
            </motion.h1>

            <motion.p
              className="mx-auto mb-8 max-w-xl text-base sm:text-lg text-text-muted leading-relaxed"
              variants={fadeUp}
            >
              {description}
            </motion.p>

            {/* CTA 1-3 mots conformes /copywriting */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-12"
              variants={fadeUp}
            >
              <Link
                href="/"
                className="bg-primary hover:bg-primary-hover text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{backText}</span>
              </Link>

              <Link
                href="/ressources"
                className="bg-background-secondary hover:border-ink text-ink font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl border border-border transition-colors min-h-[48px] inline-flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Voir les ressources</span>
              </Link>
            </motion.div>

            {/* Raccourcis utiles pour ne jamais laisser un utilisateur bloqué */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left pt-8 border-t border-border">
              <Link
                href="/"
                className="p-4 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors group"
              >
                <Home className="w-4 h-4 text-ink mb-2" />
                <div className="text-sm font-bold text-ink group-hover:underline">Accueil</div>
                <p className="text-xs text-text-muted mt-0.5">Découvrir la plateforme Ceilow</p>
              </Link>

              <Link
                href="/ressources"
                className="p-4 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors group"
              >
                <BookOpen className="w-4 h-4 text-ink mb-2" />
                <div className="text-sm font-bold text-ink group-hover:underline">Guides pratiques</div>
                <p className="text-xs text-text-muted mt-0.5">TVA, e-MECeF, TPS, CNSS, SYSCOHADA</p>
              </Link>

              <Link
                href="/tarifs"
                className="p-4 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors group"
              >
                <Calculator className="w-4 h-4 text-ink mb-2" />
                <div className="text-sm font-bold text-ink group-hover:underline">Tarifs FCFA</div>
                <p className="text-xs text-text-muted mt-0.5">Plan gratuit et formules PME</p>
              </Link>

              <Link
                href="/contact"
                className="p-4 rounded-xl bg-background-secondary border border-border hover:border-ink transition-colors group"
              >
                <MessageSquare className="w-4 h-4 text-ink mb-2" />
                <div className="text-sm font-bold text-ink group-hover:underline">Contacter l&apos;équipe</div>
                <p className="text-xs text-text-muted mt-0.5">Assistance basée à Cotonou</p>
              </Link>
            </div>
          </motion.div>
        </main>

        <PublicFooter className="w-full" />
      </div>
    </MotionConfig>
  );
}
