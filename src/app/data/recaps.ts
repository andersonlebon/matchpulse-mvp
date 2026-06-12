export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'sub' | 'var' | 'penalty';
  team: string;
  player: string;
  detail?: string;
}

export interface TeamStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  passes: number;
  passAccuracy: number;
  xG: number;
}

export interface MatchRecap {
  matchId: string;
  headline: string;
  summary: string;
  keyMoments: string[];
  events: MatchEvent[];
  homeStats: TeamStats;
  awayStats: TeamStats;
  homeRating: number;  // 1-10
  awayRating: number;
  mvp: { name: string; team: string; rating: number; reason: string };
  aiInsight: string;
  fanSentiment: { home: number; draw: number; away: number }; // % split
}

export const RECAPS: Record<string, MatchRecap> = {
  m001: {
    matchId: 'm001',
    headline: 'USA Opens World Cup in Style with Dominant 3-1 Win Over Panama',
    summary: `In front of a sold-out MetLife Stadium, the United States delivered a statement performance to open FIFA World Cup 2026. Captain Christian Pulisic orchestrated a clinical display in a tournament that the USMNT co-hosts, scoring once and assisting another. Panama fought back with a stunning 75th-minute strike but the hosts held firm, sending 82,500 fans into a frenzy.`,
    keyMoments: [
      'Pulisic opens scoring with a curling effort into the top corner (22\')',
      'Reyna doubles the lead with a composed finish inside the box (41\')',
      'Panama\'s Godoy pulls one back with a thunderbolt from 25 yards (75\')',
      'Weah seals victory with a breakaway goal in stoppage time (90+2\')',
    ],
    events: [
      { minute: 22, type: 'goal', team: 'USA', player: 'Pulisic', detail: 'Top corner, 20 yards' },
      { minute: 41, type: 'goal', team: 'USA', player: 'Reyna', detail: 'Low finish, inside the box' },
      { minute: 54, type: 'yellow', team: 'PAN', player: 'Davis' },
      { minute: 67, type: 'yellow', team: 'USA', player: 'Adams' },
      { minute: 75, type: 'goal', team: 'PAN', player: 'Godoy', detail: 'Long-range thunderbolt' },
      { minute: 88, type: 'var', team: 'USA', player: 'Reyna', detail: 'Goal ruled offside' },
      { minute: 92, type: 'goal', team: 'USA', player: 'Weah', detail: 'Breakaway, 1-on-1' },
    ],
    homeStats: { possession: 61, shots: 18, shotsOnTarget: 9, corners: 7, fouls: 11, yellowCards: 1, redCards: 0, passes: 612, passAccuracy: 87, xG: 2.8 },
    awayStats: { possession: 39, shots: 8, shotsOnTarget: 3, corners: 2, fouls: 14, yellowCards: 2, redCards: 0, passes: 391, passAccuracy: 79, xG: 1.1 },
    homeRating: 8.2,
    awayRating: 6.1,
    mvp: { name: 'Christian Pulisic', team: 'USA', rating: 9.1, reason: '1 goal, 1 assist, 7 key passes, constant threat throughout' },
    aiInsight: 'The USA\'s high-press system was near-perfect in the opening 45 minutes, winning the ball back on average just 28 metres from Panama\'s goal. Their 61% possession figure obscures the real dominance — they created 18 shot situations versus Panama\'s 3 in open play. Pulisic\'s movement between the lines exploited Panama\'s 4-4-2 mid-block at will.',
    fanSentiment: { home: 78, draw: 8, away: 14 },
  },
  m002: {
    matchId: 'm002',
    headline: 'Mexico Edge Poland in Tense Azteca Opener',
    summary: `In front of 87,000 at the iconic Estadio Azteca, Mexico secured a hard-fought 2-1 victory over Poland. Hirving Lozano opened the scoring before Poland equalised through Lewandowski. A late Raúl Jiménez header from a set piece — his first World Cup goal since 2018 — sealed a priceless victory for El Tri.`,
    keyMoments: [
      'Lozano fires Mexico in front from a counter-attack (31\')',
      'Lewandowski converts a penalty under heavy pressure (58\')',
      'Jiménez heads home a late corner to win it (84\')',
    ],
    events: [
      { minute: 31, type: 'goal', team: 'MEX', player: 'Lozano' },
      { minute: 51, type: 'yellow', team: 'MEX', player: 'Herrera' },
      { minute: 55, type: 'penalty', team: 'POL', player: 'Lewandowski', detail: 'Handball in box' },
      { minute: 58, type: 'goal', team: 'POL', player: 'Lewandowski', detail: 'Penalty' },
      { minute: 73, type: 'yellow', team: 'POL', player: 'Bednarek' },
      { minute: 84, type: 'goal', team: 'MEX', player: 'Jiménez', detail: 'Header from corner' },
    ],
    homeStats: { possession: 54, shots: 14, shotsOnTarget: 6, corners: 8, fouls: 13, yellowCards: 2, redCards: 0, passes: 541, passAccuracy: 83, xG: 2.1 },
    awayStats: { possession: 46, shots: 11, shotsOnTarget: 4, corners: 4, fouls: 10, yellowCards: 2, redCards: 0, passes: 461, passAccuracy: 81, xG: 1.7 },
    homeRating: 7.4,
    awayRating: 6.8,
    mvp: { name: 'Hirving Lozano', team: 'MEX', rating: 8.3, reason: '1 goal, constant pace down the right, 4 successful dribbles' },
    aiInsight: 'Mexico\'s use of set pieces as a tactical weapon was decisive — they converted 1 of 8 corners into a goal while Poland failed to threaten from dead balls. Lewandowski\'s penalty aside, his effectiveness was heavily curtailed by Mexico\'s aggressive man-marking; he completed just 31 of 44 passes.',
    fanSentiment: { home: 64, draw: 16, away: 20 },
  },
  m003: {
    matchId: 'm003',
    headline: 'France Demolish Ecuador in Clinical Opener, Mbappé Among Scorers',
    summary: `Les Bleus lived up to their pre-tournament billing with a ruthless 3-0 demolition of Ecuador at SoFi Stadium. An own goal, a Mbappé strike, and a fine Griezmann finish gave France the perfect start. Ecuador created little of note as Deschamps\' side looked every bit the tournament favourites.`,
    keyMoments: [
      'Ecuador OG deflects into net under pressure from Dembélé (18\')',
      'Mbappé seals France\'s dominance with a clinical low finish (55\')',
      'Griezmann adds gloss to the scoreline with a deft chip (78\')',
    ],
    events: [
      { minute: 18, type: 'goal', team: 'FRA', player: 'OG (Cifuentes)', detail: 'Deflected cross' },
      { minute: 44, type: 'yellow', team: 'ECU', player: 'Plata' },
      { minute: 55, type: 'goal', team: 'FRA', player: 'Mbappé', detail: 'Low finish, penalty area' },
      { minute: 63, type: 'yellow', team: 'FRA', player: 'Tchouaméni' },
      { minute: 78, type: 'goal', team: 'FRA', player: 'Griezmann', detail: 'Chipped finish' },
    ],
    homeStats: { possession: 67, shots: 22, shotsOnTarget: 11, corners: 9, fouls: 9, yellowCards: 1, redCards: 0, passes: 712, passAccuracy: 91, xG: 3.4 },
    awayStats: { possession: 33, shots: 5, shotsOnTarget: 1, corners: 1, fouls: 16, yellowCards: 2, redCards: 0, passes: 356, passAccuracy: 74, xG: 0.4 },
    homeRating: 9.0,
    awayRating: 5.2,
    mvp: { name: 'Kylian Mbappé', team: 'FRA', rating: 9.4, reason: '1 goal, 3 key passes, 5 dribbles completed, constant menace' },
    aiInsight: 'France\'s 91% pass accuracy was the highest recorded in a World Cup group game since Spain 2010. Their press was suffocating — Ecuador could not advance past their own half for 23 consecutive minutes after half-time. Mbappé\'s partnership with Dembélé on the right created 11 of France\'s 22 shot situations, suggesting that corridor will be the primary route to goal throughout this tournament.',
    fanSentiment: { home: 82, draw: 8, away: 10 },
  },
  m004: {
    matchId: 'm004',
    headline: 'Brazil and Switzerland Play Out Tense 1-1 Draw in Dallas',
    summary: `In a gripping encounter at AT&T Stadium, Brazil were held to a frustrating 1-1 draw by a disciplined Switzerland side. Rodrygo gave the Seleção the lead but Xhaka's superb long-range equaliser restored parity. Brazil dominated possession but struggled to break down the Swiss low block in the second half.`,
    keyMoments: [
      'Rodrygo controls and volleys Brazil ahead from Vinicius cross (27\')',
      'Xhaka unleashes a 35-yard rocket into the top corner (63\')',
      'Vinicius hits the post with a solo effort in the 88th minute',
    ],
    events: [
      { minute: 27, type: 'goal', team: 'BRA', player: 'Rodrygo', detail: 'Volley, 14 yards' },
      { minute: 38, type: 'yellow', team: 'BRA', player: 'Militão' },
      { minute: 57, type: 'yellow', team: 'SUI', player: 'Akanji' },
      { minute: 63, type: 'goal', team: 'SUI', player: 'Xhaka', detail: '35-yard screamer, top corner' },
      { minute: 79, type: 'yellow', team: 'SUI', player: 'Xhaka' },
    ],
    homeStats: { possession: 71, shots: 24, shotsOnTarget: 7, corners: 11, fouls: 8, yellowCards: 1, redCards: 0, passes: 741, passAccuracy: 89, xG: 2.9 },
    awayStats: { possession: 29, shots: 6, shotsOnTarget: 3, corners: 2, fouls: 18, yellowCards: 3, redCards: 0, passes: 298, passAccuracy: 76, xG: 1.2 },
    homeRating: 7.1,
    awayRating: 7.6,
    mvp: { name: 'Granit Xhaka', team: 'SUI', rating: 8.8, reason: '1 stunning goal, 94% pass accuracy, broke up 7 Brazilian attacks' },
    aiInsight: 'Brazil\'s 71% possession generated an xG of only 2.9, reflecting the inefficiency of their build-up against a 5-4-1 block. Despite 24 shots, they had just 7 on target — a conversion rate that will concern coach Fernando Diniz. Vinicius Jr was their most dangerous threat with 6 completed dribbles, but Switzerland consistently doubled up on him when he entered the box.',
    fanSentiment: { home: 55, draw: 25, away: 20 },
  },
  m005: {
    matchId: 'm005',
    headline: 'Argentina Impress with Professional 2-0 Victory Over Chile',
    summary: `World champions Argentina began their title defence with an efficient 2-0 win over rivals Chile in Miami. Julián Álvarez headed Argentina in front before a Messi free-kick put the game beyond doubt. Chile were spirited but lacked the cutting edge to threaten the champions.`,
    keyMoments: [
      'Álvarez heads home from a Messi delivery to break the deadlock (34\')',
      'Messi bends a free-kick into the top corner from 25 yards (71\')',
    ],
    events: [
      { minute: 34, type: 'goal', team: 'ARG', player: 'Álvarez', detail: 'Header, near post' },
      { minute: 47, type: 'yellow', team: 'CHI', player: 'Vidal' },
      { minute: 66, type: 'yellow', team: 'ARG', player: 'De Paul' },
      { minute: 71, type: 'goal', team: 'ARG', player: 'Messi', detail: 'Free-kick, top corner' },
    ],
    homeStats: { possession: 59, shots: 16, shotsOnTarget: 7, corners: 6, fouls: 12, yellowCards: 1, redCards: 0, passes: 591, passAccuracy: 88, xG: 2.3 },
    awayStats: { possession: 41, shots: 9, shotsOnTarget: 2, corners: 3, fouls: 15, yellowCards: 2, redCards: 0, passes: 412, passAccuracy: 80, xG: 0.8 },
    homeRating: 8.0,
    awayRating: 6.3,
    mvp: { name: 'Lionel Messi', team: 'ARG', rating: 9.2, reason: '1 goal, 1 assist, 11 chances created, 6 key passes, visionary' },
    aiInsight: 'Messi\'s free-kick was struck at 127 km/h and placed into the top corner with 11cm clearance — effectively unmakeable for the goalkeeper. More impressive was his positional dominance: he received the ball in the opposition half 31 times and was dispossessed just once. Argentina\'s shape was a compact 4-3-3 that transitioned into a lethal 4-2-4 in the final third.',
    fanSentiment: { home: 71, draw: 14, away: 15 },
  },
};

export function getRecap(matchId: string): MatchRecap | undefined {
  return RECAPS[matchId];
}

export function getAllRecaps(): MatchRecap[] {
  return Object.values(RECAPS);
}
