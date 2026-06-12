import { Player, Match } from '../data/dummy';

export function generateMatchSummary(match: Match): string {
  if (match.status !== 'completed' || !match.result) return 'Match is not yet completed.';

  const parts: string[] = [];
  parts.push(`${match.teamA} faced ${match.teamB} in a ${match.format} match at ${match.venue} on ${match.date}.`);

  if (match.scoreA && match.scoreB) {
    parts.push(`${match.teamA} posted ${match.scoreA}, while ${match.teamB} replied with ${match.scoreB}.`);
  }

  parts.push(match.result);

  if (match.tournament) {
    parts.push(`This match was part of the ${match.tournament}.`);
  }

  return parts.join(' ');
}

export function predictPlayerOfTheMatch(match: Match, players: Player[]): Player | null {
  if (match.status !== 'completed') return null;

  const teamAPlayers = players.filter((p) => p.team === match.teamA);
  const teamBPlayers = players.filter((p) => p.team === match.teamB);
  const matchPlayers = [...teamAPlayers, ...teamBPlayers];

  if (matchPlayers.length === 0) return null;

  const scored = matchPlayers.map((p) => {
    let score = 0;
    // Batting contribution
    score += p.runs * 0.5;
    score += p.average * 2;
    score += p.strikeRate * 0.3;
    // Bowling contribution
    score += p.wickets * 20;
    score += p.economy > 0 ? (10 - p.economy) * 5 : 0;
    // All-rounder bonus
    if (p.role === 'All-rounder') score *= 1.15;
    return { player: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.player || null;
}

export function calculateWinPercentage(team: string, matches: Match[]): number {
  const teamMatches = matches.filter(
    (m) => m.status === 'completed' && (m.teamA === team || m.teamB === team)
  );
  if (teamMatches.length === 0) return 0;

  const wins = teamMatches.filter((m) => m.result?.includes(`${team} won`)).length;
  return Math.round((wins / teamMatches.length) * 100);
}

export function getTeamForm(team: string, matches: Match[]): ('W' | 'L' | 'D')[] {
  const teamMatches = matches
    .filter((m) => m.status === 'completed' && (m.teamA === team || m.teamB === team))
    .slice(-5);

  return teamMatches.map((m) => {
    if (m.result?.includes(`${team} won`)) return 'W';
    if (m.result?.includes('drawn') || m.result?.includes('Draw')) return 'D';
    return 'L';
  });
}
