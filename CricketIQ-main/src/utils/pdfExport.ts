import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Player, Match, Team } from '../data/dummy';

export function exportPlayerReport(players: Player[]) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94);
  doc.text('CricketIQ - Player Statistics Report', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | ${players.length} Players`, 14, 30);

  autoTable(doc, {
    startY: 38,
    head: [['Player', 'Role', 'Team', 'Matches', 'Runs', 'Wickets', 'Average', 'SR', 'Status']],
    body: players.map((p) => [p.name, p.role, p.team, p.matches, p.runs, p.wickets, p.average, p.strikeRate, p.status]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 248, 244] },
    theme: 'grid',
  });

  doc.save('cricketiq-players-report.pdf');
}

export function exportMatchScorecard(match: Match) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94);
  doc.text('CricketIQ - Match Scorecard', 14, 22);

  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`${match.teamA} vs ${match.teamB}`, 14, 34);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const info = [
    ['Format', match.format],
    ['Venue', match.venue],
    ['Date', match.date],
    ['Tournament', match.tournament || 'N/A'],
    ['Status', match.status.toUpperCase()],
  ];
  autoTable(doc, {
    startY: 42,
    head: [['Detail', 'Value']],
    body: info,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    theme: 'grid',
  });

  if (match.scoreA || match.scoreB) {
    autoTable(doc, {
      startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10,
      head: [['Team', 'Score']],
      body: [
        [match.teamA, match.scoreA || 'N/A'],
        [match.teamB, match.scoreB || 'N/A'],
      ],
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      theme: 'grid',
    });
  }

  if (match.result) {
    const y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94);
    doc.text(`Result: ${match.result}`, 14, y);
  }

  doc.save(`cricketiq-scorecard-${match.teamA}-vs-${match.teamB}.pdf`);
}

export function exportTeamReport(teams: Team[]) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94);
  doc.text('CricketIQ - Team Standings Report', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | ${teams.length} Teams`, 14, 30);

  autoTable(doc, {
    startY: 38,
    head: [['Team', 'Country', 'W', 'L', 'D', 'Pts', 'NRR']],
    body: teams.map((t) => [t.name, t.country, t.wins, t.losses, t.draws, t.points, t.netRunRate.toFixed(2)]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 248, 244] },
    theme: 'grid',
  });

  doc.save('cricketiq-teams-report.pdf');
}
