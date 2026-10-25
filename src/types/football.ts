/**
 * @license
 * Data types for ScalperLab Football Analytics
 */

export type MatchStatus = 'pre-match' | 'live' | 'finished';

export type FormResult = 'V' | 'P' | 'S'; // Vittoria, Pareggio, Sconfitta

export interface Team {
  id: string;
  name: string;
  shortName: string;
  crestText: string;
  primaryColor: string;
  secondaryColor: string;
  leagueId: string;
  stadium: string;
  coach: string;
}

export interface MatchInfo {
  stadium: string;
  spectators?: number;
  weather: {
    condition: 'Soleggiato' | 'Nuvoloso' | 'Pioggia' | 'Coperto' | 'Vento';
    temperature: number; // in °C
    windKmH: number;
    windDirection: string;
  };
  referee: {
    id: string;
    name: string;
    foulsPerGame: number;
    yellowPerGame: number;
    penaltiesPerGame: number;
  };
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  number: number;
  role: 'Portiere' | 'Difensore' | 'Centrocampista' | 'Attaccante';
  nationality: string;
  ratingAvg: number;
  appearances: number;
  goals: number;
  assists: number;
  minutes: number;
  xG: number;
  xA: number;
  shotsPer90: number;
  shotsOnTargetPer90: number;
  foulsCommittedPer90: number;
  foulsSufferedPer90: number;
  dribblesPer90: number;
}

export interface LineupPlayer {
  id: string;
  name: string;
  number: number;
  x: number; // 0 to 100 on pitch width
  y: number; // 0 to 100 on pitch length
  rating?: number;
  isCaptain?: boolean;
  yellowCard?: boolean;
  redCard?: boolean;
  subOutMinute?: number;
  subInMinute?: number;
  role: string;
}

export interface Formation {
  formation: string; // e.g. "3-5-2" or "4-3-3"
  startingXI: LineupPlayer[];
  bench: LineupPlayer[];
  coach: string;
}

export type ShotOutcome = 'gol' | 'parato' | 'fuori' | 'murato';
export type BodyPart = 'Piede destro' | 'Piede sinistro' | 'Colpo di testa' | 'Altro';

export interface Shot {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  x: number; // 0-100 pitch percentage
  y: number; // 0-100 pitch percentage
  xG: number;
  minute: number;
  outcome: ShotOutcome;
  bodyPart: BodyPart;
  distanceMeters: number;
}

export interface TimelineEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'sub' | 'var';
  teamId: string;
  primaryPlayer: string;
  secondaryPlayer?: string; // assist man or sub-in
  description?: string;
}

export interface HighlightStat {
  label: string;
  value: string;
  rankBadge: string; // e.g. "1ª su 20"
  team: 'home' | 'away';
}

export interface PlayerComparison {
  metric: string;
  homePlayer: {
    name: string;
    value: number;
    formattedValue: string;
  };
  awayPlayer: {
    name: string;
    value: number;
    formattedValue: string;
  };
}

export interface StatItem {
  label: string;
  home: number;
  away: number;
  homeDisplay?: string;
  awayDisplay?: string;
  unit?: string;
}

export interface Match {
  id: string;
  leagueId: string;
  leagueName: string;
  homeTeam: Team;
  awayTeam: Team;
  status: MatchStatus;
  kickoffTime: string; // e.g. "20:45"
  date: string; // e.g. "2026-10-25"
  round: string; // e.g. "Giornata 9"
  score?: {
    home: number;
    away: number;
    halfTimeHome?: number;
    halfTimeAway?: number;
  };
  liveMinute?: number; // e.g. 68
  homeForm: FormResult[];
  awayForm: FormResult[];
  info: MatchInfo;
  reliability: {
    score: number; // out of 10, e.g. 8.2
    recommendedStakeUnits: number;
    marketName: string;
    fairOdd: number;
    bookmakerOdd: number;
    evPercent: number;
    poissonProb: number;
  };
  highlights: HighlightStat[];
  keyPlayerComparison: PlayerComparison[];
  preMatchExpectedStats: StatItem[];
  preMatchSeasonAverages: StatItem[];
  liveStats?: StatItem[];
  homeFormation: Formation;
  awayFormation: Formation;
  shots: Shot[];
  timeline: TimelineEvent[];
  momentum: { minute: number; value: number }[]; // -100 (away dominant) to +100 (home dominant)
}

export interface League {
  id: string;
  name: string;
  country: string;
  season: string;
  crestText: string;
}

export interface StandingsRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: FormResult[];
  zone?: 'champions' | 'europa' | 'conference' | 'relegation';
}

export interface Referee {
  id: string;
  name: string;
  country: string;
  matches: number;
  yellowCardsTotal: number;
  yellowPerMatch: number;
  redCardsTotal: number;
  redPerMatch: number;
  foulsPerMatch: number;
  penaltiesTotal: number;
  penaltiesPerMatch: number;
  strictnessIndex: number; // 1 to 10
  recentMatches: {
    matchName: string;
    date: string;
    fouls: number;
    yellows: number;
    reds: number;
    penalties: number;
  }[];
}

export interface BestPlayerPick {
  id: string;
  rank: number;
  player: Player;
  match: string;
  teamCrestText: string;
  opponentCrestText: string;
  threshold: '0.5' | '1.5' | '2.5';
  votoRating: number;      // e.g. 9.96
  mediaAttesa: number;     // e.g. 7.66
  mediPer90: number;       // e.g. 6.9
  ultime5: number;         // e.g. 7.6
  stagione: number;        // e.g. 6.9
}

export type MatchupCategory = 'Angoli' | 'Cartellini' | 'Tiri' | 'Falli' | 'Fuorigiochi';

export interface BestMatchup {
  id: string;
  category: MatchupCategory;
  match: string;
  league: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  divario: number; // e.g. 3.2
  valoreCasa: number;
  valoreOspite: number;
  partiteUsate: number;
  partiteTotali: number;
  confidenceScore: number; // out of 10
}

export interface BetRecord {
  id: string;
  date: string;
  giocatore: string;
  squadra: string;
  avversario: string;
  linea: string;
  quota: number;
  affidabilita: number;
  stakeUnita: number;
  stakeEuro: number;
  esito: 'in_corso' | 'vinta' | 'persa';
  profitto?: number;
}
