import { jsPDF } from 'jspdf';
import { STORY_CHAPTERS } from '../data/storyData';
import {
  ArchetypeResult,
  CharacterProfile,
  ChoiceRecord,
  ValueDefinition,
} from '../types/story';

interface ExportJourneyPdfParams {
  profile: CharacterProfile;
  records: ChoiceRecord[];
  archetype: ArchetypeResult;
  sortedValues: Array<{ definition: ValueDefinition; score: number }>;
  synthesis: string;
  blindSpot: string;
  guidingQuestion: string;
  journalAnswers: Record<number, string>;
}

function normalizePdfText(input: string): string {
  return input
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2014\u2013]/g, '-')
    .replace(/\u00B7/g, ' - ')
    .replace(/\u2026/g, '...');
}

export function exportJourneyToPdf(params: ExportJourneyPdfParams): void {
  const {
    profile,
    records,
    archetype,
    sortedValues,
    synthesis,
    blindSpot,
    guidingQuestion,
    journalAnswers,
  } = params;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const maxWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 22;

  let y = 22;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > bottomLimit) {
      doc.addPage();
      y = 22;
    }
  };

  const drawRule = (color: [number, number, number] = [220, 216, 208]) => {
    ensureSpace(6);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 6;
  };

  const writeParagraph = (
    text: string,
    options: {
      font?: 'helvetica' | 'times';
      style?: 'normal' | 'bold' | 'italic';
      size?: number;
      color?: [number, number, number];
      lineHeight?: number;
      indent?: number;
      gapAfter?: number;
    } = {}
  ) => {
    const {
      font = 'helvetica',
      style = 'normal',
      size = 10.5,
      color = [41, 37, 36],
      lineHeight = 5.4,
      indent = 0,
      gapAfter = 3.5,
    } = options;

    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(
      normalizePdfText(text),
      maxWidth - indent
    ) as string[];

    for (const line of lines) {
      ensureSpace(lineHeight + 1);
      doc.text(line, marginX + indent, y);
      y += lineHeight;
    }
    y += gapAfter;
  };

  // --- COVER / HEADER ---
  writeParagraph('TRAVESSIA - ESPELHO DAS ESCOLHAS', {
    font: 'helvetica',
    style: 'bold',
    size: 9,
    color: [30, 58, 138],
    lineHeight: 4.5,
    gapAfter: 2,
  });

  const formattedDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  writeParagraph(
    `Personagem: ${profile.name}  |  Origem: ${profile.origin.title}  |  ${formattedDate}`,
    {
      font: 'helvetica',
      style: 'normal',
      size: 9,
      color: [87, 83, 78],
      lineHeight: 4.5,
      gapAfter: 4,
    }
  );

  drawRule();

  writeParagraph(archetype.title, {
    font: 'times',
    style: 'bold',
    size: 22,
    color: [28, 25, 23],
    lineHeight: 8.5,
    gapAfter: 2.5,
  });

  writeParagraph(archetype.subtitle, {
    font: 'helvetica',
    style: 'normal',
    size: 11,
    color: [68, 64, 60],
    lineHeight: 5.5,
    gapAfter: 4,
  });

  writeParagraph(`Inquietação inicial: "${profile.tension.question}"`, {
    font: 'times',
    style: 'italic',
    size: 11,
    color: [87, 83, 78],
    lineHeight: 5.5,
    gapAfter: 4,
  });

  // Perspective Box
  ensureSpace(22);
  doc.setFillColor(248, 247, 244);
  doc.setDrawColor(229, 226, 220);
  const perspectiveLines = doc.splitTextToSize(
    normalizePdfText(`"${archetype.lifePerspective}"`),
    maxWidth - 12
  ) as string[];
  const boxHeight = 12 + perspectiveLines.length * 5.8;
  doc.roundedRect(marginX, y, maxWidth, boxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 58, 138);
  doc.text('PERSPECTIVA DE VIDA REVELADA', marginX + 6, y + 6);

  doc.setFont('times', 'italic');
  doc.setFontSize(11.5);
  doc.setTextColor(28, 25, 23);
  let boxY = y + 12.5;
  for (const line of perspectiveLines) {
    doc.text(line, marginX + 6, boxY);
    boxY += 5.8;
  }
  y += boxHeight + 8;

  // --- FINAL SYNTHESIS & REFLECTIONS ---
  writeParagraph('1. SÍNTESE DA JORNADA E REFLEXÕES FINAIS', {
    font: 'helvetica',
    style: 'bold',
    size: 10.5,
    color: [30, 58, 138],
    lineHeight: 5,
    gapAfter: 3,
  });

  const synthesisParagraphs = synthesis
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const para of synthesisParagraphs) {
    writeParagraph(para, {
      font: 'helvetica',
      size: 10.5,
      color: [41, 37, 36],
      lineHeight: 5.4,
      gapAfter: 3.5,
    });
  }

  writeParagraph('Força essencial observada:', {
    font: 'helvetica',
    style: 'bold',
    size: 9.5,
    color: [28, 25, 23],
    lineHeight: 4.8,
    gapAfter: 1,
  });
  writeParagraph(archetype.coreStrength, {
    font: 'helvetica',
    size: 10,
    color: [68, 64, 60],
    lineHeight: 5.2,
    gapAfter: 3.5,
  });

  writeParagraph('Ponto cego ou preço silencioso:', {
    font: 'helvetica',
    style: 'bold',
    size: 9.5,
    color: [28, 25, 23],
    lineHeight: 4.8,
    gapAfter: 1,
  });
  writeParagraph(blindSpot, {
    font: 'helvetica',
    size: 10,
    color: [68, 64, 60],
    lineHeight: 5.2,
    gapAfter: 3.5,
  });

  writeParagraph('Pergunta para carregar consigo:', {
    font: 'helvetica',
    style: 'bold',
    size: 9.5,
    color: [30, 58, 138],
    lineHeight: 4.8,
    gapAfter: 1,
  });
  writeParagraph(guidingQuestion, {
    font: 'times',
    style: 'italic',
    size: 11.5,
    color: [28, 25, 23],
    lineHeight: 5.8,
    gapAfter: 6,
  });

  drawRule();

  // --- VALUES COMPASS ---
  writeParagraph('2. BÚSSOLA DOS SEUS VALORES', {
    font: 'helvetica',
    style: 'bold',
    size: 10.5,
    color: [30, 58, 138],
    lineHeight: 5,
    gapAfter: 4,
  });

  sortedValues.forEach((item, idx) => {
    ensureSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(28, 25, 23);
    doc.text(
      normalizePdfText(`${String(idx + 1).padStart(2, '0')}. ${item.definition.label}`),
      marginX,
      y
    );

    doc.setTextColor(30, 58, 138);
    doc.text(`${item.score}%`, pageWidth - marginX, y, { align: 'right' });
    y += 2.5;

    doc.setFillColor(229, 226, 220);
    doc.rect(marginX, y, maxWidth, 2, 'F');
    doc.setFillColor(30, 58, 138);
    doc.rect(marginX, y, (maxWidth * item.score) / 100, 2, 'F');
    y += 5.5;

    writeParagraph(item.definition.shortDesc, {
      font: 'helvetica',
      size: 9,
      color: [87, 83, 78],
      lineHeight: 4.4,
      gapAfter: 3.5,
    });
  });

  drawRule();

  // --- FULL NARRATIVE JOURNEY & CHOICES ---
  writeParagraph('3. TODA A JORNADA NARRATIVA E SUAS ESCOLHAS', {
    font: 'helvetica',
    style: 'bold',
    size: 10.5,
    color: [30, 58, 138],
    lineHeight: 5,
    gapAfter: 5,
  });

  const priorEchoes: string[] = [];

  STORY_CHAPTERS.forEach((chapter, idx) => {
    const record = records[idx];
    const paragraphs = chapter.buildNarrative(profile, priorEchoes).filter(Boolean);

    ensureSpace(26);
    writeParagraph(chapter.settingLabel, {
      font: 'helvetica',
      style: 'bold',
      size: 8.5,
      color: [87, 83, 78],
      lineHeight: 4,
      gapAfter: 1,
    });

    writeParagraph(`${chapter.romanNumeral}. ${chapter.chapterTitle}`, {
      font: 'times',
      style: 'bold',
      size: 14,
      color: [28, 25, 23],
      lineHeight: 6,
      gapAfter: 3,
    });

    paragraphs.forEach((para, pIdx) => {
      const isEcho = idx > 0 && pIdx === 0;
      writeParagraph(para, {
        font: isEcho ? 'times' : 'helvetica',
        style: isEcho ? 'italic' : 'normal',
        size: 10,
        color: isEcho ? [87, 83, 78] : [41, 37, 36],
        lineHeight: 5.2,
        gapAfter: 2.8,
      });
    });

    if (record) {
      priorEchoes.push(record.choice.echoLine);

      writeParagraph(`Decisão tomada: "${record.choice.label}"`, {
        font: 'helvetica',
        style: 'bold',
        size: 10,
        color: [30, 58, 138],
        lineHeight: 5,
        indent: 4,
        gapAfter: 2,
      });

      writeParagraph(`Consequência: ${record.choice.actionText}`, {
        font: 'helvetica',
        style: 'normal',
        size: 9.5,
        color: [41, 37, 36],
        lineHeight: 4.8,
        indent: 4,
        gapAfter: 2,
      });

      writeParagraph(`O que revelou: ${record.choice.revealedPerspective}`, {
        font: 'times',
        style: 'italic',
        size: 10,
        color: [87, 83, 78],
        lineHeight: 4.8,
        indent: 4,
        gapAfter: 6,
      });
    }
  });

  drawRule();

  // --- PERSONAL JOURNAL ---
  writeParagraph('4. CADERNO DE REFLEXÃO PESSOAL', {
    font: 'helvetica',
    style: 'bold',
    size: 10.5,
    color: [30, 58, 138],
    lineHeight: 5,
    gapAfter: 4,
  });

  archetype.journalPrompts.forEach((promptText, idx) => {
    const answer = journalAnswers[idx]?.trim();
    writeParagraph(`${String(idx + 1).padStart(2, '0')}. ${promptText}`, {
      font: 'helvetica',
      style: 'bold',
      size: 10,
      color: [28, 25, 23],
      lineHeight: 5,
      gapAfter: 1.5,
    });
    writeParagraph(
      answer ? answer : '(Espaço reservado para suas reflexões pessoais.)',
      {
        font: answer ? 'helvetica' : 'times',
        style: answer ? 'normal' : 'italic',
        size: 10,
        color: answer ? [41, 37, 36] : [120, 113, 108],
        lineHeight: 5.2,
        indent: 4,
        gapAfter: 5,
      }
    );
  });

  // --- PAGE NUMBERS ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 113, 108);
    doc.text(
      `Travessia - Espelho das Escolhas  |  Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  const slug = profile.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  doc.save(`travessia-${slug || 'jornada'}.pdf`);
}
