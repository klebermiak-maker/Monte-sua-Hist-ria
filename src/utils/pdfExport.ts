import { jsPDF } from 'jspdf';
import { StoryCard } from '../data/storyCards';

export interface ExportPdfParams {
  title: string;
  author: string;
  studentGrade?: string;
  studentClass?: string;
  studentTurma?: string;
  schoolName?: string;
  genreName: string;
  createdAt?: string;
  cards: {
    personagem?: StoryCard | null;
    lugar?: StoryCard | null;
    acao?: StoryCard | null;
    complemento?: StoryCard | null;
  };
  sections: {
    key: string;
    title: string;
    content: string;
  }[];
}

export function generateStoryPdf(params: ExportPdfParams): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297 mm
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper to check page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
      drawHeaderDecorations();
    }
  };

  const drawHeaderDecorations = () => {
    // Top colored accent bar
    doc.setFillColor(245, 158, 11); // Amber
    doc.rect(margin, margin - 10, contentWidth * 0.25, 2, 'F');
    doc.setFillColor(16, 185, 129); // Emerald
    doc.rect(margin + contentWidth * 0.25, margin - 10, contentWidth * 0.25, 2, 'F');
    doc.setFillColor(14, 165, 233); // Sky
    doc.rect(margin + contentWidth * 0.5, margin - 10, contentWidth * 0.25, 2, 'F');
    doc.setFillColor(244, 63, 94); // Rose
    doc.rect(margin + contentWidth * 0.75, margin - 10, contentWidth * 0.25, 2, 'F');
  };

  drawHeaderDecorations();

  // Top header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('ALFABETIZA MT  •  SEDUC GOVERNO DE MATO GROSSO', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Oficina de Redação & Produção de Gêneros Textuais (3º ao 5º Ano)', pageWidth / 2, y, { align: 'center' });
  y += 8;

  // Decorative divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Genre badge
  doc.setFillColor(254, 243, 199); // amber-100
  doc.roundedRect(margin, y, 75, 6, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // amber-800
  doc.text(`GÊNERO: ${params.genreName.toUpperCase()}`, margin + 3, y + 4.2);
  y += 10;

  // Story Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  const titleLines = doc.splitTextToSize(params.title || 'História Sem Título', contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Metadata: Author, Turma & Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  const authorStr = `Aluno(a): ${params.author || 'Escritor(a) Mirim'}`;
  const turmaStr = params.studentTurma ? `Turma: ${params.studentTurma}` : '';
  const dateStr = `Data: ${params.createdAt || new Date().toLocaleDateString('pt-BR')}`;
  const metaText = [authorStr, turmaStr, dateStr].filter(Boolean).join('    |    ');
  doc.text(metaText, margin, y);
  y += 7;

  // Box with Cards Used
  const cardsList = [
    { label: 'Personagem', card: params.cards.personagem, color: [245, 158, 11] },
    { label: 'Lugar', card: params.cards.lugar, color: [16, 185, 129] },
    { label: 'Ação', card: params.cards.acao, color: [14, 165, 233] },
    { label: 'Complemento', card: params.cards.complemento, color: [244, 63, 94] },
  ].filter((item) => Boolean(item.card));

  if (cardsList.length > 0) {
    checkPageBreak(30);

    // Gray card background box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('ELEMENTOS SORTEADOS DO BARALHO MONTE SUA HISTÓRIA:', margin + 4, y + 5);

    let cardX = margin + 4;
    const cardColWidth = (contentWidth - 8) / 4;

    cardsList.forEach((item, idx) => {
      const curX = margin + 4 + idx * cardColWidth;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      doc.text(item.label.toUpperCase(), curX, y + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      const textWrapped = doc.splitTextToSize(item.card?.text || '', cardColWidth - 4);
      doc.text(textWrapped.slice(0, 3), curX, y + 14);
    });

    y += 29;
  }

  // Story Content Sections
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);

  params.sections.forEach((section, index) => {
    checkPageBreak(25);

    // Section header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${section.title.toUpperCase()}`, margin, y);
    y += 5;

    // Content text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    const sectionContent = section.content.trim() || '(Nenhum texto informado nesta seção)';
    const splitContent = doc.splitTextToSize(sectionContent, contentWidth);

    splitContent.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5.5;
    });

    y += 4;
  });

  // Footer & Teacher Signature box
  checkPageBreak(30);
  y += 5;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Teacher signature line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Avaliação / Visto do(a) Professor(a): ____________________________________', margin, y);

  doc.text('Nota / Estrelas: [   ] ⭐⭐⭐⭐⭐', pageWidth - margin - 50, y);
  y += 8;

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Documento gerado na plataforma pedagógica Monte Sua História • Alfabetiza MT (SEDUC Mato Grosso)',
    pageWidth / 2,
    y,
    { align: 'center' }
  );

  return doc;
}
