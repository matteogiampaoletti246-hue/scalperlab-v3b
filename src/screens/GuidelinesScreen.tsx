/**
 * @license
 * GuidelinesScreen component
 * Refined editorial accordions for "Calcolo giocatori" and "Calcolo tiri squadre"
 */

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle, Calculator, Sigma } from 'lucide-react';

export const GuidelinesScreen: React.FC = () => {
  const [openSection, setOpenSection] = useState<'giocatori' | 'squadre' | null>('giocatori');

  return (
    <div className="flex flex-col w-full pb-16 max-w-md mx-auto p-3.5 space-y-4">
      {/* Title */}
      <div>
        <h1 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Linee Guida e Modello</span>
        </h1>
        <p className="text-[11px] text-neutral-500">
          Metodologia quantitativa, formule matematiche e pesi adottati da ScalperLab
        </p>
      </div>

      {/* Accordion 1: Calcolo giocatori */}
      <div className="rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#121620]/80 backdrop-blur-xl shadow-xs transition-all">
        <button
          onClick={() => setOpenSection(openSection === 'giocatori' ? null : 'giocatori')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-50">
                Calcolo Giocatori
              </div>
              <div className="text-[10px] text-neutral-400">
                Media attesa, Poisson e moltiplicatori difensivi
              </div>
            </div>
          </div>
          {openSection === 'giocatori' ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {openSection === 'giocatori' && (
          <div className="px-4 pb-4 pt-1 border-t border-black/5 dark:border-white/5 text-xs text-neutral-700 dark:text-neutral-300 space-y-3 leading-relaxed">
            <p>
              La stima quantitativa della media tiri e tiri in porta di un calciatore impiega una
              combinazione lineare ponderata:
            </p>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-black/30 font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
              Media Base = (L5 × 0.60) + (Stagione × 0.40)
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Peso Ultime 5 (L5):</strong> Riflette lo stato di forma atletico e la
                  centralità tattica recente del giocatore.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Fattore Difesa Avversaria:</strong> Rapporto tra i tiri concessi
                  dall'avversario e la media del campionato (baseline Serie A: 11.5 tiri).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Fattore Campo & Minuti:</strong> +8% se in casa, -6% se in trasferta;
                  proiezione scalata sui minuti medi attesi (es. 80 minuti / 90).
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
              <strong>Modello di Poisson:</strong> La probabilità di superare la linea (Over 0.5, 1.5,
              2.5) viene determinata tramite la funzione cumulativa di Poisson sulla media attesa λ.
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Calcolo tiri squadre */}
      <div className="rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#121620]/80 backdrop-blur-xl shadow-xs transition-all">
        <button
          onClick={() => setOpenSection(openSection === 'squadre' ? null : 'squadre')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Sigma className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-50">
                Calcolo Tiri Squadre
              </div>
              <div className="text-[10px] text-neutral-400">
                Volume di gara atteso, intensità e frazionamento Kelly
              </div>
            </div>
          </div>
          {openSection === 'squadre' ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {openSection === 'squadre' && (
          <div className="px-4 pb-4 pt-1 border-t border-black/5 dark:border-white/5 text-xs text-neutral-700 dark:text-neutral-300 space-y-3 leading-relaxed">
            <p>
              La stima dei tiri totali di squadra si basa sul prodotto dell'indice di forza offensiva
              della squadra per l'indice di vulnerabilità difensiva dell'avversario:
            </p>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-black/30 font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
              Tiri Attesi = (Off_Forza × Def_Debolezza) × Media_Lega × Pace
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Ritmo di gara (Pace):</strong> Incremento del +9% in partite ad alto pressing
                  o scontro diretto a viso aperto, -8% in gare bloccate tatticamente.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Ripartizione Attesa:</strong> Di norma il 35% dei tiri finisce nello specchio
                  (in porta), il 42% fuori e il 23% viene murato dalla difesa.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Stake Kelly Frazionario (0.25):</strong> Per massimizzare la crescita del
                  bankroll minimizzando il rischio di rovina, viene suggerito 1/4 Kelly.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
