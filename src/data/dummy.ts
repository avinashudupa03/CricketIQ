export interface Player {
  id: string;
  name: string;
  role: string;
  team: string;
  matches: number;
  runs: number;
  wickets: number;
  average: number;
  strikeRate: number;
  economy: number;
  country: string;
  avatar: string;
  status: 'active' | 'injured' | 'retired';
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  netRunRate: number;
  logo: string;
  players: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  date: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  result?: string;
  scoreA?: string;
  scoreB?: string;
  tournament: string;
  format: 'Test' | 'ODI' | 'T20';
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  format: string;
  teams: number;
  matches: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  winner?: string;
  venue: string;
}

export const players: Player[] = [
  { id: '1', name: 'Virat Kohli', role: 'Batsman', team: 'India', matches: 274, runs: 13848, wickets: 4, average: 57.7, strikeRate: 93.2, economy: 0, country: 'India', avatar: 'VK', status: 'active' },
  { id: '2', name: 'Joe Root', role: 'Batsman', team: 'England', matches: 142, runs: 12162, wickets: 24, average: 50.8, strikeRate: 56.1, economy: 0, country: 'England', avatar: 'JR', status: 'active' },
  { id: '3', name: 'Steve Smith', role: 'Batsman', team: 'Australia', matches: 114, runs: 9654, wickets: 1, average: 58.9, strikeRate: 53.5, economy: 0, country: 'Australia', avatar: 'SS', status: 'active' },
  { id: '4', name: 'Kane Williamson', role: 'Batsman', team: 'New Zealand', matches: 104, runs: 8647, wickets: 6, average: 55.4, strikeRate: 52.7, economy: 0, country: 'New Zealand', avatar: 'KW', status: 'active' },
  { id: '5', name: 'Babar Azam', role: 'Batsman', team: 'Pakistan', matches: 96, runs: 7694, wickets: 0, average: 52.3, strikeRate: 88.4, economy: 0, country: 'Pakistan', avatar: 'BA', status: 'active' },
  { id: '6', name: 'Jasprit Bumrah', role: 'Bowler', team: 'India', matches: 89, runs: 156, wickets: 389, average: 20.2, strikeRate: 42.8, economy: 3.12, country: 'India', avatar: 'JB', status: 'active' },
  { id: '7', name: 'Pat Cummins', role: 'Bowler', team: 'Australia', matches: 72, runs: 412, wickets: 298, average: 22.1, strikeRate: 48.3, economy: 2.88, country: 'Australia', avatar: 'PC', status: 'active' },
  { id: '8', name: 'Shaheen Afridi', role: 'Bowler', team: 'Pakistan', matches: 52, runs: 98, wickets: 214, average: 24.7, strikeRate: 44.6, economy: 3.45, country: 'Pakistan', avatar: 'SA', status: 'active' },
  { id: '9', name: 'Ben Stokes', role: 'All-rounder', team: 'England', matches: 112, runs: 3978, wickets: 178, average: 36.9, strikeRate: 55.8, economy: 3.22, country: 'England', avatar: 'BS', status: 'active' },
  { id: '10', name: 'Ravindra Jadeja', role: 'All-rounder', team: 'India', matches: 98, runs: 3246, wickets: 267, average: 37.2, strikeRate: 64.3, economy: 2.44, country: 'India', avatar: 'RJ', status: 'active' },
  { id: '11', name: 'Trent Boult', role: 'Bowler', team: 'New Zealand', matches: 88, runs: 189, wickets: 342, average: 27.2, strikeRate: 51.6, economy: 3.05, country: 'New Zealand', avatar: 'TB', status: 'active' },
  { id: '12', name: 'Rashid Khan', role: 'Bowler', team: 'Afghanistan', matches: 64, runs: 812, wickets: 298, average: 19.4, strikeRate: 32.1, economy: 3.28, country: 'Afghanistan', avatar: 'RK', status: 'active' },
  { id: '13', name: 'Quinton de Kock', role: 'Wicketkeeper', team: 'South Africa', matches: 86, runs: 5648, wickets: 0, average: 38.9, strikeRate: 71.4, economy: 0, country: 'South Africa', avatar: 'QD', status: 'active' },
  { id: '14', name: 'Jos Buttler', role: 'Wicketkeeper', team: 'England', matches: 96, runs: 4872, wickets: 0, average: 41.6, strikeRate: 121.3, economy: 0, country: 'England', avatar: 'JB', status: 'active' },
  { id: '15', name: 'Shakib Al Hasan', role: 'All-rounder', team: 'Bangladesh', matches: 78, runs: 4523, wickets: 246, average: 37.1, strikeRate: 58.7, economy: 2.94, country: 'Bangladesh', avatar: 'SH', status: 'active' },
  { id: '16', name: 'David Warner', role: 'Batsman', team: 'Australia', matches: 112, runs: 8786, wickets: 4, average: 44.6, strikeRate: 70.1, economy: 0, country: 'Australia', avatar: 'DW', status: 'retired' },
];

export const teams: Team[] = [
  { id: '1', name: 'India', shortName: 'IND', country: 'India', wins: 176, losses: 62, draws: 36, points: 248, netRunRate: 1.24, logo: 'IND', players: 15 },
  { id: '2', name: 'Australia', shortName: 'AUS', country: 'Australia', wins: 168, losses: 58, draws: 42, points: 232, netRunRate: 1.08, logo: 'AUS', players: 15 },
  { id: '3', name: 'England', shortName: 'ENG', country: 'England', wins: 154, losses: 74, draws: 38, points: 216, netRunRate: 0.86, logo: 'ENG', players: 15 },
  { id: '4', name: 'New Zealand', shortName: 'NZ', country: 'New Zealand', wins: 112, losses: 86, draws: 48, points: 168, netRunRate: 0.52, logo: 'NZ', players: 15 },
  { id: '5', name: 'Pakistan', shortName: 'PAK', country: 'Pakistan', wins: 118, losses: 82, draws: 34, points: 178, netRunRate: 0.64, logo: 'PAK', players: 15 },
  { id: '6', name: 'South Africa', shortName: 'SA', country: 'South Africa', wins: 108, losses: 78, draws: 32, points: 162, netRunRate: 0.48, logo: 'SA', players: 15 },
  { id: '7', name: 'Sri Lanka', shortName: 'SL', country: 'Sri Lanka', wins: 82, losses: 102, draws: 44, points: 124, netRunRate: -0.12, logo: 'SL', players: 15 },
  { id: '8', name: 'Bangladesh', shortName: 'BAN', country: 'Bangladesh', wins: 48, losses: 126, draws: 22, points: 76, netRunRate: -0.68, logo: 'BAN', players: 15 },
  { id: '9', name: 'West Indies', shortName: 'WI', country: 'West Indies', wins: 74, losses: 96, draws: 38, points: 112, netRunRate: -0.24, logo: 'WI', players: 15 },
  { id: '10', name: 'Afghanistan', shortName: 'AFG', country: 'Afghanistan', wins: 32, losses: 68, draws: 8, points: 56, netRunRate: -0.42, logo: 'AFG', players: 15 },
];

export const matches: Match[] = [
  { id: '1', teamA: 'India', teamB: 'Australia', date: '2026-06-15', venue: 'MCG, Melbourne', status: 'upcoming', tournament: 'World Test Championship', format: 'Test' },
  { id: '2', teamA: 'England', teamB: 'New Zealand', date: '2026-06-12', venue: 'Lords, London', status: 'live', scoreA: '245/6', scoreB: '189/4', tournament: 'World Test Championship', format: 'Test' },
  { id: '3', teamA: 'India', teamB: 'Pakistan', date: '2026-06-10', venue: 'M Chinnaswamy, Bangalore', status: 'completed', result: 'India won by 7 wickets', scoreA: '312/3', scoreB: '308/9', tournament: 'Asia Cup', format: 'ODI' },
  { id: '4', teamA: 'Australia', teamB: 'England', date: '2026-06-08', venue: 'SCG, Sydney', status: 'completed', result: 'Australia won by 45 runs', scoreA: '287/5', scoreB: '242/10', tournament: 'The Ashes', format: 'Test' },
  { id: '5', teamA: 'South Africa', teamB: 'India', date: '2026-06-18', venue: 'Newlands, Cape Town', status: 'upcoming', tournament: 'Bilateral Series', format: 'ODI' },
  { id: '6', teamA: 'Pakistan', teamB: 'New Zealand', date: '2026-06-20', venue: 'Gaddafi, Lahore', status: 'upcoming', tournament: 'Bilateral Series', format: 'T20' },
  { id: '7', teamA: 'Sri Lanka', teamB: 'Bangladesh', date: '2026-06-05', venue: 'Galle, Sri Lanka', status: 'completed', result: 'Sri Lanka won by 10 wickets', scoreA: '289/0', scoreB: '286/10', tournament: 'Asia Cup', format: 'Test' },
  { id: '8', teamA: 'Afghanistan', teamB: 'West Indies', date: '2026-06-22', venue: 'Sharjah, UAE', status: 'upcoming', tournament: 'T20 World Cup', format: 'T20' },
  { id: '9', teamA: 'India', teamB: 'England', date: '2026-06-25', venue: 'Eden Gardens, Kolkata', status: 'upcoming', tournament: 'Bilateral Series', format: 'T20' },
  { id: '10', teamA: 'Australia', teamB: 'South Africa', date: '2026-06-03', venue: 'Adelaide Oval', status: 'completed', result: 'Match drawn', scoreA: '456/8d', scoreB: '398/7d', tournament: 'World Test Championship', format: 'Test' },
];

export const tournaments: Tournament[] = [
  { id: '1', name: 'World Test Championship 2025-27', startDate: '2025-06-01', endDate: '2027-03-15', format: 'Test', teams: 10, matches: 72, status: 'ongoing', venue: 'Multiple Venues' },
  { id: '2', name: 'T20 World Cup 2026', startDate: '2026-09-01', endDate: '2026-10-05', format: 'T20', teams: 20, matches: 55, status: 'upcoming', venue: 'India & Sri Lanka' },
  { id: '3', name: 'Asia Cup 2026', startDate: '2026-05-15', endDate: '2026-06-10', format: 'ODI', teams: 6, matches: 13, status: 'ongoing', venue: 'Pakistan & UAE' },
  { id: '4', name: 'The Ashes 2026', startDate: '2026-07-01', endDate: '2026-08-15', format: 'Test', teams: 2, matches: 5, status: 'upcoming', venue: 'England' },
  { id: '5', name: 'Champions Trophy 2025', startDate: '2025-02-19', endDate: '2025-03-09', format: 'ODI', teams: 8, matches: 15, status: 'completed', winner: 'India', venue: 'Pakistan & UAE' },
  { id: '6', name: 'IPL 2026', startDate: '2026-03-22', endDate: '2026-05-28', format: 'T20', teams: 10, matches: 74, status: 'ongoing', venue: 'India' },
];

export const runRateData = [
  { over: '1-5', india: 4.2, australia: 3.8, england: 4.6 },
  { over: '6-10', india: 5.1, australia: 4.4, england: 5.3 },
  { over: '11-15', india: 4.8, australia: 4.2, england: 4.9 },
  { over: '16-20', india: 6.2, australia: 5.8, england: 6.4 },
  { over: '21-25', india: 4.6, australia: 4.0, england: 4.7 },
  { over: '26-30', india: 5.4, australia: 5.0, england: 5.1 },
  { over: '31-35', india: 4.3, australia: 3.9, england: 4.5 },
  { over: '36-40', india: 5.8, australia: 5.2, england: 5.6 },
  { over: '41-45', india: 6.8, australia: 6.2, england: 6.5 },
  { over: '46-50', india: 8.2, australia: 7.6, england: 7.8 },
];

export const formatDistribution = [
  { name: 'Test', value: 72, color: '#22c55e' },
  { name: 'ODI', value: 98, color: '#f59e0b' },
  { name: 'T20', value: 156, color: '#3b82f6' },
];

export const monthlyMatches = [
  { month: 'Jan', test: 8, odi: 12, t20: 18 },
  { month: 'Feb', test: 6, odi: 14, t20: 22 },
  { month: 'Mar', test: 10, odi: 8, t20: 16 },
  { month: 'Apr', test: 4, odi: 6, t20: 28 },
  { month: 'May', test: 12, odi: 10, t20: 14 },
  { month: 'Jun', test: 14, odi: 16, t20: 20 },
];

export const topPerformers = {
  batting: [
    { name: 'V. Kohli', runs: 847, matches: 12, average: 70.6 },
    { name: 'J. Root', runs: 762, matches: 10, average: 63.5 },
    { name: 'B. Azam', runs: 698, matches: 11, average: 58.2 },
    { name: 'S. Smith', runs: 654, matches: 9, average: 54.5 },
    { name: 'K. Williamson', runs: 612, matches: 10, average: 51.0 },
  ],
  bowling: [
    { name: 'J. Bumrah', wickets: 42, matches: 10, average: 18.4 },
    { name: 'S. Afridi', wickets: 38, matches: 11, average: 20.2 },
    { name: 'P. Cummins', wickets: 34, matches: 9, average: 22.1 },
    { name: 'T. Boult', wickets: 32, matches: 10, average: 23.8 },
    { name: 'R. Khan', wickets: 30, matches: 8, average: 19.4 },
  ],
};
