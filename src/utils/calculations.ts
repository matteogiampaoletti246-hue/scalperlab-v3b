/**
 * @license
 * ScalperLab Pure Calculation Engine
 * Keeps calculations clean, deterministic, and modular.
 */

// Factorial helper
function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Calculates Poisson Probability P(X = k) for lambda
 */
export function poissonProb(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Calculates Over probability for line (e.g. 0.5, 1.5, 2.5) with expected lambda
 */
export function calculateOverProbability(line: number, lambda: number): number {
  if (lambda <= 0) return 0;
  const kMax = Math.floor(line);
  let underProb = 0;
  for (let k = 0; k <= kMax; k++) {
    underProb += poissonProb(k, lambda);
  }
  const overProb = Math.max(0, Math.min(1, 1 - underProb));
  return overProb;
}

export interface PlayerCalcInput {
  playerName: string;
  opponent: string;
  line: number; // e.g. 1.5
  bookmakerOdd: number; // e.g. 1.85
  mediaUltime5: number; // e.g. 2.4
  mediaStagione: number; // e.g. 2.1
  tiriConcessiDifesa: number; // e.g. 12.8 (serie A average is ~11.5)
  pesoUltime5: number; // 0 to 1, default 0.60
  isHome: boolean; // true = +8%, false = -4%
  titolarita: 'confermato' | 'ballottaggio' | 'subentrante'; // 1.0, 0.75, 0.35
  minutiAttesi: number; // default 80
  bankroll: number; // e.g. 100
}

export interface PlayerCalcResult {
  mediaAttesaPonderata: number;
  probabilitaOver: number; // 0 to 1
  probabilitaPercent: number; // e.g. 68.4
  quotaEqua: number; // e.g. 1.46
  expectedValue: number; // e.g. +26.7 (%)
  affidabilitaScore: number; // 1 to 10 scale
  stakeConsigliatoUnita: number; // e.g. 2.5
  stakeEuro: number; // e.g. 2.50
  giocabile: boolean; // true if EV > 0
}

/**
 * Calculates reliability metrics and optimal stake for a player prop
 */
export function calculatePlayerPropReliability(input: PlayerCalcInput): PlayerCalcResult {
  const {
    line,
    bookmakerOdd,
    mediaUltime5,
    mediaStagione,
    tiriConcessiDifesa,
    pesoUltime5 = 0.6,
    isHome = true,
    titolarita = 'confermato',
    minutiAttesi = 80,
    bankroll = 100,
  } = input;

  // Base weighted player average
  const baseAvg = (mediaUltime5 * pesoUltime5) + (mediaStagione * (1 - pesoUltime5));

  // Opponent defense multiplier (baseline 11.5 shots allowed in top tier)
  const leagueBaselineShots = 11.5;
  const defenseMultiplier = Math.max(0.65, Math.min(1.45, tiriConcessiDifesa / leagueBaselineShots));

  // Home / Away factor
  const homeMultiplier = isHome ? 1.08 : 0.94;

  // Minutes & starter weighting
  const starterMultiplier =
    titolarita === 'confermato' ? 1.0 : titolarita === 'ballottaggio' ? 0.78 : 0.40;
  const minutesFactor = Math.min(1.0, minutiAttesi / 90);

  // Projected lambda
  const lambda = Math.max(
    0.1,
    baseAvg * defenseMultiplier * homeMultiplier * starterMultiplier * minutesFactor
  );

  // Poisson Over Probability
  const overProb = calculateOverProbability(line, lambda);
  const fairOdd = overProb > 0 ? 1 / overProb : 99;
  const ev = ((overProb * bookmakerOdd) - 1) * 100;

  // ScalperLab 1-10 reliability gauge score
  // Combines EV%, probability magnitude, and minutes certainty
  let rawScore = 5.0;
  if (ev > 0) {
    rawScore += Math.min(3.5, ev / 8);
  } else {
    rawScore -= Math.min(4.0, Math.abs(ev) / 8);
  }
  if (overProb > 0.60) rawScore += 0.8;
  if (overProb > 0.70) rawScore += 0.7;
  if (titolarita === 'confermato') rawScore += 0.3;
  if (minutiAttesi >= 80) rawScore += 0.2;

  const affidabilitaScore = Math.max(1.0, Math.min(10.0, Math.round(rawScore * 10) / 10));

  // Fractional Kelly criterion (Quarter Kelly: 0.25)
  // f* = (p * b - q) / b where b = odd - 1, q = 1 - p
  const b = Math.max(0.01, bookmakerOdd - 1);
  const p = overProb;
  const q = 1 - p;
  const kellyFull = ((p * b) - q) / b;
  const kellyFraction = 0.25;

  let stakeUnits = 0;
  if (kellyFull > 0 && ev > 2.0) {
    stakeUnits = Math.min(5.0, Math.max(0.5, Math.round((kellyFull * kellyFraction * 20) * 10) / 10));
  } else if (ev > 0) {
    stakeUnits = 0.5;
  }

  const stakeEuro = Math.round((bankroll * (stakeUnits / 100)) * 100) / 100;

  return {
    mediaAttesaPonderata: Math.round(lambda * 100) / 100,
    probabilitaOver: overProb,
    probabilitaPercent: Math.round(overProb * 1000) / 10,
    quotaEqua: Math.round(fairOdd * 100) / 100,
    expectedValue: Math.round(ev * 10) / 10,
    affidabilitaScore,
    stakeConsigliatoUnita: stakeUnits,
    stakeEuro,
    giocabile: ev > 1.5 && affidabilitaScore >= 6.5,
  };
}

export interface TeamShotsInput {
  tiriFattiCasa: number; // e.g. 15.2
  tiriConcessiOspite: number; // e.g. 13.5
  mediaLega: number; // e.g. 12.0
  ritmoPartita: 'Basso' | 'Medio' | 'Alto';
}

export interface TeamShotsResult {
  tiriTotaliAttesi: number;
  inPortaAttesi: number;
  fuoriAttesi: number;
  muratiAttesi: number;
  consigliLinea: {
    linea: string;
    overProb: number;
    quotaConsigliata: number;
    ev: number;
  }[];
}

/**
 * Calculates Team Shot expectancy and breakdown
 */
export function calculateTeamShotsExpectancy(input: TeamShotsInput): TeamShotsResult {
  const { tiriFattiCasa, tiriConcessiOspite, mediaLega = 12.0, ritmoPartita } = input;
  const paceFactor = ritmoPartita === 'Alto' ? 1.09 : ritmoPartita === 'Basso' ? 0.92 : 1.0;

  const offensiveStrength = tiriFattiCasa / mediaLega;
  const defensiveWeakness = tiriConcessiOspite / mediaLega;

  const total = Math.round((offensiveStrength * defensiveWeakness * mediaLega * paceFactor) * 10) / 10;
  
  // Typical breakdown: 35% on target, 42% off target, 23% blocked
  const inPorta = Math.round((total * 0.35) * 10) / 10;
  const fuori = Math.round((total * 0.42) * 10) / 10;
  const murati = Math.round((total - inPorta - fuori) * 10) / 10;

  const lines = [
    { linea: 'Over 10.5', lineVal: 10.5 },
    { linea: 'Over 12.5', lineVal: 12.5 },
    { linea: 'Over 14.5', lineVal: 14.5 },
  ];

  const consigli = lines.map(l => {
    const prob = calculateOverProbability(l.lineVal, total);
    const quota = prob > 0 ? Math.round((1 / prob) * 100) / 100 : 9.9;
    const assumedOdd = l.lineVal === 10.5 ? 1.35 : l.lineVal === 12.5 ? 1.75 : 2.30;
    const ev = Math.round((((prob * assumedOdd) - 1) * 100) * 10) / 10;
    return {
      linea: l.linea,
      overProb: Math.round(prob * 1000) / 10,
      quotaConsigliata: quota,
      ev,
    };
  });

  return {
    tiriTotaliAttesi: total,
    inPortaAttesi: inPorta,
    fuoriAttesi: fuori,
    muratiAttesi: murati,
    consigliLinea: consigli,
  };
}
