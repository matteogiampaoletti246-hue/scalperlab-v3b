/**
 * @license
 * CalculatorScreen component
 * 3 sections: "Affidabilità giocatore", "Media tiri squadra", and "Storico"
 * Complete with exact fields, selects, hints, result rows, stake box, "Gioca!" button, and JSON backup/restore.
 */

import React, { useState, useEffect } from 'react';
import {
  calculatePlayerPropReliability,
  calculateTeamShotsExpectancy,
  PlayerCalcInput,
} from '../utils/calculations';
import { BetRecord } from '../types/football';
import { INITIAL_BET_HISTORY, FEATURED_PLAYERS, TEAMS } from '../data/mockData';
import { ReliabilityGauge } from '../components/common/ReliabilityGauge';
import {
  Calculator,
  Target,
  History,
  Check,
  X,
  Trash2,
  Download,
  Upload,
  Play,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export const CalculatorScreen: React.FC = () => {
  const [section, setSection] = useState<'giocatore' | 'squadra' | 'storico'>('giocatore');

  // SECTION 1: Affidabilità Giocatore State
  const [playerName, setPlayerName] = useState('Lautaro Martínez');
  const [teamName, setTeamName] = useState('Inter');
  const [opponentName, setOpponentName] = useState('Juventus');
  const [line, setLine] = useState<number>(1.5);
  const [bookmakerOdd, setBookmakerOdd] = useState<number>(1.95);
  const [mediaUltime5, setMediaUltime5] = useState<number>(2.4);
  const [mediaStagione, setMediaStagione] = useState<number>(2.1);
  const [tiriConcessiDifesa, setTiriConcessiDifesa] = useState<number>(12.8);
  const [pesoUltime5, setPesoUltime5] = useState<number>(0.6);
  const [isHome, setIsHome] = useState<boolean>(true);
  const [titolarita, setTitolarita] = useState<'confermato' | 'ballottaggio' | 'subentrante'>('confermato');
  const [minutiAttesi, setMinutiAttesi] = useState<number>(80);
  const [bankroll, setBankroll] = useState<number>(100);

  // SECTION 2: Media Tiri Squadra State
  const [tiriFattiCasa, setTiriFattiCasa] = useState<number>(15.2);
  const [tiriConcessiOspite, setTiriConcessiOspite] = useState<number>(13.5);
  const [ritmoPartita, setRitmoPartita] = useState<'Basso' | 'Medio' | 'Alto'>('Medio');

  // SECTION 3: Storico State (Persistent in localStorage)
  const [history, setHistory] = useState<BetRecord[]>(() => {
    try {
      const saved = localStorage.getItem('scalperlab_bet_history');
      return saved ? JSON.parse(saved) : INITIAL_BET_HISTORY;
    } catch {
      return INITIAL_BET_HISTORY;
    }
  });

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('scalperlab_bet_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Perform Player Calculation
  const playerResult = calculatePlayerPropReliability({
    playerName,
    opponent: opponentName,
    line,
    bookmakerOdd,
    mediaUltime5,
    mediaStagione,
    tiriConcessiDifesa,
    pesoUltime5,
    isHome,
    titolarita,
    minutiAttesi,
    bankroll,
  });

  // Perform Team Shots Calculation
  const teamResult = calculateTeamShotsExpectancy({
    tiriFattiCasa,
    tiriConcessiOspite,
    mediaLega: 12.0,
    ritmoPartita,
  });

  // Fast preset filler from mock players
  const handleSelectPresetPlayer = (pId: string) => {
    const p = FEATURED_PLAYERS[pId];
    if (!p) return;
    setPlayerName(p.name);
    setTeamName(p.teamId === 'inter' ? 'Inter' : p.teamId === 'juventus' ? 'Juventus' : 'Milan');
    setMediaUltime5(p.shotsOnTargetPer90);
    setMediaStagione(p.shotsPer90);
  };

  // Action: "Gioca!" button
  const handleGioca = () => {
    const newBet: BetRecord = {
      id: `bet-${Date.now()}`,
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }),
      giocatore: playerName,
      squadra: teamName,
      avversario: opponentName,
      linea: `Over ${line} Tiri in Porta`,
      quota: bookmakerOdd,
      affidabilita: playerResult.affidabilitaScore,
      stakeUnita: playerResult.stakeConsigliatoUnita,
      stakeEuro: playerResult.stakeEuro,
      esito: 'in_corso',
    };
    setHistory([newBet, ...history]);
    showNotification('Giocata registrata nello Storico con successo!');
  };

  // Status handlers
  const handleSetStatus = (id: string, status: 'vinta' | 'persa') => {
    setHistory((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const profit =
          status === 'vinta'
            ? Math.round(b.stakeEuro * (b.quota - 1) * 100) / 100
            : -b.stakeEuro;
        return { ...b, esito: status, profitto: profit };
      })
    );
  };

  const handleDeleteBet = (id: string) => {
    setHistory((prev) => prev.filter((b) => b.id !== id));
    showNotification('Giocata rimossa');
  };

  // Backup Export & Import
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `scalperlab_backup_${Date.now()}.json`);
    dlAnchorElem.click();
    showNotification('Backup JSON scaricato');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          showNotification('Backup importato con successo!');
        }
      } catch {
        alert('File JSON non valido');
      }
    };
    reader.readAsText(file);
  };

  const handleClearHistory = () => {
    if (confirm('Sei sicuro di voler azzerare l\'intero storico delle giocate?')) {
      setHistory([]);
      showNotification('Storico azzerato');
    }
  };

  // Stats for History
  const finishedBets = history.filter((b) => b.esito !== 'in_corso');
  const wonBets = history.filter((b) => b.esito === 'vinta');
  const winRate = finishedBets.length > 0 ? (wonBets.length / finishedBets.length) * 100 : 0;
  const totalProfit = history.reduce((acc, b) => acc + (b.profitto || 0), 0);

  return (
    <div className="flex flex-col w-full pb-16 max-w-md mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-neutral-900/95 text-white border border-amber-500/30 text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* 3 Section Tabs Header */}
      <div className="p-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#0e121b]/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-neutral-200/60 dark:bg-white/5 text-xs font-semibold">
          <button
            onClick={() => setSection('giocatore')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              section === 'giocatore'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Giocatore</span>
          </button>
          <button
            onClick={() => setSection('squadra')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              section === 'squadra'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tiri Squadra</span>
          </button>
          <button
            onClick={() => setSection('storico')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all relative ${
              section === 'storico'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Storico</span>
            {history.filter((b) => b.esito === 'in_corso').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <div className="p-3.5">
        {/* =========================================
            SECTION 1: AFFIDABILITÀ GIOCATORE
           ========================================= */}
        {section === 'giocatore' && (
          <div className="space-y-4">
            {/* Quick Player Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-neutral-400 font-mono uppercase mr-1">Preset:</span>
              <button
                onClick={() => handleSelectPresetPlayer('lautaro')}
                className="px-2.5 py-1 rounded-md text-[11px] bg-neutral-200/60 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 transition-colors whitespace-nowrap"
              >
                Lautaro (INT)
              </button>
              <button
                onClick={() => handleSelectPresetPlayer('vlahovic')}
                className="px-2.5 py-1 rounded-md text-[11px] bg-neutral-200/60 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 transition-colors whitespace-nowrap"
              >
                Vlahović (JUV)
              </button>
              <button
                onClick={() => handleSelectPresetPlayer('leao')}
                className="px-2.5 py-1 rounded-md text-[11px] bg-neutral-200/60 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 transition-colors whitespace-nowrap"
              >
                Leão (MIL)
              </button>
            </div>

            {/* Input Form Fields */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#121620]/80 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-xs space-y-3 text-xs">
              {/* Giocatore & Squadra */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">Giocatore</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-medium text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">Avversario</label>
                  <input
                    type="text"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-medium text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Linea Over & Quota Bookmaker */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">Linea Over</label>
                  <select
                    value={line}
                    onChange={(e) => setLine(parseFloat(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono font-bold text-neutral-900 dark:text-neutral-100"
                  >
                    <option value={0.5}>Over 0.5 Tiri</option>
                    <option value={1.5}>Over 1.5 Tiri</option>
                    <option value={2.5}>Over 2.5 Tiri</option>
                    <option value={3.5}>Over 3.5 Tiri</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">Quota Bookmaker</label>
                  <input
                    type="number"
                    step="0.05"
                    value={bookmakerOdd}
                    onChange={(e) => setBookmakerOdd(parseFloat(e.target.value) || 1.0)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono font-bold text-amber-600 dark:text-amber-400"
                  />
                </div>
              </div>

              {/* Media L5 & Media Stagione */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span>Media Ultime 5</span>
                    <span className="text-[10px] text-amber-500 font-mono">L5</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={mediaUltime5}
                    onChange={(e) => setMediaUltime5(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span>Media Stagione</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Tot</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={mediaStagione}
                    onChange={(e) => setMediaStagione(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Tiri Concessi dalla Difesa Avversaria & Casa/Trasferta */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">
                    Tiri Concessi Difesa
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={tiriConcessiDifesa}
                    onChange={(e) => setTiriConcessiDifesa(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono text-neutral-900 dark:text-neutral-100"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    Media Serie A ~11.5
                  </span>
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">Fattore Campo</label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setIsHome(true)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                        isHome
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                          : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Casa (+8%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHome(false)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                        !isHome
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                          : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      Trasferta
                    </button>
                  </div>
                </div>
              </div>

              {/* Titolarità & Minuti Attesi */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">Titolarità</label>
                  <select
                    value={titolarita}
                    onChange={(e) => setTitolarita(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="confermato">Titolare confermato</option>
                    <option value="ballottaggio">Ballottaggio (75%)</option>
                    <option value="subentrante">Subentrante probabile</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium">Minuti Attesi</label>
                  <input
                    type="number"
                    value={minutiAttesi}
                    onChange={(e) => setMinutiAttesi(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Peso L5 Slider & Bankroll */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
                  <span>Peso Ultime 5 Gare: <strong className="text-amber-500 font-mono">{Math.round(pesoUltime5 * 100)}%</strong></span>
                  <span>Consigliato 60%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.05"
                  value={pesoUltime5}
                  onChange={(e) => setPesoUltime5(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 font-medium">Bankroll Totale (€)</label>
                <input
                  type="number"
                  value={bankroll}
                  onChange={(e) => setBankroll(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono font-bold text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            {/* RESULTS ROW & GAUGE */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#121620]/80 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-50">
                    Esito Valutazione Quantitativa
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Modello Poisson + Expected Value
                  </span>
                </div>
                <ReliabilityGauge score={playerResult.affidabilitaScore} size="sm" showLabel={false} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-neutral-500">Media Attesa λ</span>
                  <span className="font-mono text-base font-bold text-neutral-900 dark:text-white mt-1">
                    {playerResult.mediaAttesaPonderata} tiri
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-neutral-500">Probabilità Over</span>
                  <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {playerResult.probabilitaPercent}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-neutral-500">Quota Equa Calcolata</span>
                  <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                    @{playerResult.quotaEqua}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-100/70 dark:bg-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-neutral-500">Expected Value (EV)</span>
                  <span
                    className={`font-mono text-base font-bold mt-1 ${
                      playerResult.expectedValue > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {playerResult.expectedValue > 0 ? `+${playerResult.expectedValue}%` : `${playerResult.expectedValue}%`}
                  </span>
                </div>
              </div>

              {/* STAKE BOX */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                  playerResult.giocabile
                    ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                    : 'bg-neutral-100 dark:bg-white/5 border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    {playerResult.giocabile ? 'Valore Positivo · Giocata Consigliata' : 'Nessun Valore Reale'}
                  </span>
                  <span className="font-mono font-bold text-xs">
                    Kelly: {playerResult.stakeConsigliatoUnita} Unità
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-black/5 dark:border-white/5">
                  <span className="text-xs">Importo puntata su Bankroll:</span>
                  <span className="font-mono text-lg font-bold">
                    {playerResult.stakeEuro.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* "GIOCA!" BUTTON */}
              <button
                type="button"
                onClick={handleGioca}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 text-white dark:bg-amber-500 dark:text-neutral-950 font-serif font-bold text-sm tracking-wide shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Gioca! Salva nello Storico</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            SECTION 2: MEDIA TIRI SQUADRA
           ========================================= */}
        {section === 'squadra' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#121620]/80 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-xs space-y-3 text-xs">
              <h2 className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-50">
                Parametri Tiri di Squadra
              </h2>

              <div>
                <label className="text-[11px] text-neutral-500 font-medium">
                  Tiri Fatti in Casa dalla Squadra
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tiriFattiCasa}
                  onChange={(e) => setTiriFattiCasa(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 font-medium">
                  Tiri Concessi in Trasferta dall'Avversario
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tiriConcessiOspite}
                  onChange={(e) => setTiriConcessiOspite(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/5 outline-none font-mono text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-500 font-medium">
                  Ritmo di Gara Stimato (Pace)
                </label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {(['Basso', 'Medio', 'Alto'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRitmoPartita(r)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                        ritmoPartita === r
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                          : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Expectancy Results */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#121620]/80 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-xs space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-50">
                  Tiri Totali Previsti
                </span>
                <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {teamResult.tiriTotaliAttesi}
                </span>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5">
                  <div className="text-[10px] text-neutral-400">In Porta (35%)</div>
                  <div className="font-mono font-bold text-emerald-500 mt-1">
                    {teamResult.inPortaAttesi}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5">
                  <div className="text-[10px] text-neutral-400">Fuori (42%)</div>
                  <div className="font-mono font-bold text-neutral-400 mt-1">
                    {teamResult.fuoriAttesi}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-white/5">
                  <div className="text-[10px] text-neutral-400">Murati (23%)</div>
                  <div className="font-mono font-bold text-orange-500 mt-1">
                    {teamResult.muratiAttesi}
                  </div>
                </div>
              </div>

              {/* Lines Advice Table */}
              <div className="pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-[11px] font-semibold text-neutral-500 mb-2 block">
                  Consigli Linee Tiri Squadra
                </span>
                <div className="rounded-xl overflow-hidden border border-black/5 dark:border-white/5 text-xs divide-y divide-black/5 dark:divide-white/5">
                  {teamResult.consigliLinea.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5">
                      <span className="font-mono font-bold">{c.linea}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-neutral-400">{c.overProb}% prob.</span>
                        <span className="text-blue-500">@{c.quotaConsigliata}</span>
                        <span
                          className={`font-bold ${
                            c.ev > 0 ? 'text-emerald-500' : 'text-neutral-400'
                          }`}
                        >
                          EV {c.ev > 0 ? `+${c.ev}%` : `${c.ev}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            SECTION 3: STORICO & BACKUP
           ========================================= */}
        {section === 'storico' && (
          <div className="space-y-4">
            {/* History Performance Summary Cards */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
                <div className="text-[10px] text-neutral-400">Giocate Totali</div>
                <div className="font-mono text-base font-bold text-neutral-900 dark:text-white mt-1">
                  {history.length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
                <div className="text-[10px] text-neutral-400">Win Rate</div>
                <div className="font-mono text-base font-bold text-emerald-500 mt-1">
                  {winRate.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.08]">
                <div className="text-[10px] text-neutral-400">Profitto Netto</div>
                <div
                  className={`font-mono text-base font-bold mt-1 ${
                    totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {totalProfit >= 0 ? `+${totalProfit.toFixed(1)}€` : `${totalProfit.toFixed(1)}€`}
                </div>
              </div>
            </div>

            {/* Backup & Actions Bar */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-100 dark:bg-white/5 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5 hover:bg-neutral-50 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Esporta</span>
                </button>
                <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5 hover:bg-neutral-50 shadow-xs cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importa</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Azzera</span>
              </button>
            </div>

            {/* Bets List */}
            <div className="space-y-2.5">
              {history.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-400">
                  Nessuna giocata nello storico. Usa il calcolatore e premi "Gioca!" per registrarla.
                </div>
              ) : (
                history.map((bet) => (
                  <div
                    key={bet.id}
                    className="p-3.5 rounded-xl bg-white/70 dark:bg-[#121620]/80 border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-xl shadow-xs flex flex-col gap-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-serif text-sm font-bold text-neutral-900 dark:text-white">
                          {bet.giocatore}
                        </span>
                        <div className="text-[11px] text-neutral-500">
                          {bet.squadra} vs {bet.avversario} · {bet.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono font-bold text-[11px]">
                        <span className="text-amber-500">{bet.affidabilita}/10</span>
                        <span>·</span>
                        <span>@{bet.quota}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/10 font-mono text-[11px]">
                          {bet.linea}
                        </span>
                        <span className="font-mono text-neutral-400">
                          Stake: {bet.stakeEuro}€
                        </span>
                      </div>

                      {/* State Pills / Actions */}
                      <div className="flex items-center gap-1.5">
                        {bet.esito === 'in_corso' ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSetStatus(bet.id, 'vinta')}
                              title="Segna come vinta"
                              className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleSetStatus(bet.id, 'persa')}
                              title="Segna come persa"
                              className="p-1 rounded-md bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono text-amber-500 font-semibold px-1.5 py-0.5 rounded bg-amber-500/10">
                              In corso
                            </span>
                          </div>
                        ) : bet.esito === 'vinta' ? (
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/15">
                            VINTA (+{bet.profitto}€)
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-500/15">
                            PERSA ({bet.profitto}€)
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteBet(bet.id)}
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-neutral-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
