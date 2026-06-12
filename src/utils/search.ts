import { Player, Team, Match, Tournament } from '../data/dummy';

export interface GlobalSearchResult {
  type: 'player' | 'team' | 'match' | 'tournament';
  id: string;
  title: string;
  subtitle: string;
  badge: string;
}

export function globalSearch(
  query: string,
  players: Player[],
  teams: Team[],
  matches: Match[],
  tournaments: Tournament[]
): GlobalSearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();

  const results: GlobalSearchResult[] = [];

  players
    .filter((p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q) || p.country.toLowerCase().includes(q))
    .forEach((p) => results.push({ type: 'player', id: p.id, title: p.name, subtitle: `${p.role} | ${p.team}`, badge: p.role }));

  teams
    .filter((t) => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q))
    .forEach((t) => results.push({ type: 'team', id: t.id, title: t.name, subtitle: `${t.wins}W ${t.losses}L`, badge: t.shortName }));

  matches
    .filter((m) => m.teamA.toLowerCase().includes(q) || m.teamB.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q))
    .forEach((m) => results.push({ type: 'match', id: m.id, title: `${m.teamA} vs ${m.teamB}`, subtitle: `${m.venue} | ${m.date}`, badge: m.format }));

  tournaments
    .filter((t) => t.name.toLowerCase().includes(q) || t.venue.toLowerCase().includes(q))
    .forEach((t) => results.push({ type: 'tournament', id: t.id, title: t.name, subtitle: `${t.format} | ${t.teams} Teams`, badge: t.status }));

  return results.slice(0, 20);
}
