import React, { useEffect, useMemo, useState } from 'react';
import {
  BookmarkCheck,
  BookmarkPlus,
  Check,
  Copy,
  Download,
  ImageDown,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { computeJourneyAnalysis, REFLECTION_IMAGE } from '../data/storyData';
import { CharacterProfile, ChoiceRecord, SavedJourney } from '../types/story';
import {
  buildSharedDiscoveryUrl,
  buildWhatsAppShareUrl,
  downloadDiscoveryCardPng,
} from '../utils/shareUtils';
import { EditorialImage } from './EditorialImage';
import { ValuesCompassChart } from './ValuesCompassChart';

interface ReflectionViewProps {
  profile: CharacterProfile;
  records: ChoiceRecord[];
  onRestart: () => void;
  onSaveJourney: (journey: SavedJourney) => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  profile,
  records,
  onRestart,
  onSaveJourney,
}) => {
  const analysis = useMemo(
    () => computeJourneyAnalysis(profile, records),
    [profile, records]
  );

  const [synthesis, setSynthesis] = useState(analysis.localSynthesis);
  const [blindSpot, setBlindSpot] = useState(analysis.archetype.blindSpot);
  const [guidingQuestion, setGuidingQuestion] = useState(
    analysis.archetype.guidingQuestion
  );
  const [isEnriching, setIsEnriching] = useState(true);

  const [journalAnswers, setJournalAnswers] = useState<Record<number, string>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPersonalizedReflection() {
      try {
        const res = await fetch('/api/reflect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            characterName: profile.name,
            originTitle: profile.origin.title,
            tensionTitle: profile.tension.title,
            archetypeTitle: analysis.archetype.title,
            topValues: analysis.sortedValues.map((v) => ({
              label: v.definition.label,
              score: v.score,
            })),
            choices: records.map((r) => ({
              chapterTitle: r.chapterTitle,
              dilemma: r.dilemma,
              chosenLabel: r.choice.label,
              reflectionNote: r.choice.reflectionNote,
            })),
          }),
        });

        if (!res.ok) return;
        const data = (await res.json()) as {
          fallback?: boolean;
          synthesis?: string;
          blindSpot?: string;
          guidingQuestion?: string;
        };

        if (!cancelled && data && data.fallback === false && data.synthesis) {
          setSynthesis(data.synthesis);
          if (data.blindSpot) setBlindSpot(data.blindSpot);
          if (data.guidingQuestion) setGuidingQuestion(data.guidingQuestion);
        }
      } catch {
        // Keep deterministic local synthesis silently
      } finally {
        if (!cancelled) setIsEnriching(false);
      }
    }

    fetchPersonalizedReflection();
    return () => {
      cancelled = true;
    };
  }, [analysis, profile, records]);

  const sharedUrl = useMemo(
    () =>
      buildSharedDiscoveryUrl({
        n: profile.name,
        o: profile.origin.title,
        a: analysis.archetype.id,
        s: analysis.scores,
      }),
    [analysis.archetype.id, analysis.scores, profile.name, profile.origin.title]
  );

  const whatsappDiscoveryHref = buildWhatsAppShareUrl(
    `Conduzi "${profile.name}" em Travessia e descobri o perfil "${analysis.archetype.title}". Veja meu mapa e faça sua própria travessia: ${sharedUrl}`
  );

  const buildPlainTextSummary = () => {
    const valuesList = analysis.sortedValues
      .map((v) => `- ${v.definition.label}: ${v.score}%`)
      .join('\n');

    const choicesList = records
      .map(
        (r) =>
          `${r.romanNumeral}. ${r.chapterTitle}\n   Escolha: ${r.choice.label}\n   O que revelou: ${r.choice.revealedPerspective}`
      )
      .join('\n\n');

    const journalList = analysis.archetype.journalPrompts
      .map((q, idx) => {
        const ans = journalAnswers[idx]?.trim();
        return `${idx + 1}. ${q}\n   Resposta: ${ans || '(sem anotações)'}`;
      })
      .join('\n\n');

    return [
      `TRAVESSIA — ESPELHO DAS ESCOLHAS`,
      `Personagem: ${profile.name} (${profile.origin.title})`,
      `Inquietação inicial: ${profile.tension.title}`,
      ``,
      `DESCOBERTA PRINCIPAL: ${analysis.archetype.title}`,
      `${analysis.archetype.subtitle}`,
      ``,
      `SÍNTESE DA JORNADA`,
      synthesis,
      ``,
      `PONTO DE ATENÇÃO`,
      blindSpot,
      ``,
      `PERGUNTA PARA LEVAR CONSIGO`,
      guidingQuestion,
      ``,
      `BÚSSOLA DE VALORES`,
      valuesList,
      ``,
      `ESPELHO DAS DECISÕES`,
      choicesList,
      ``,
      `CADERNO DE REFLEXÃO`,
      journalList,
    ].join('\n');
  };

  const handleSave = () => {
    const journey: SavedJourney = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      characterName: profile.name,
      originTitle: profile.origin.title,
      tensionTitle: profile.tension.title,
      archetypeTitle: analysis.archetype.title,
      scores: analysis.scores,
      choices: records.map((r) => ({
        chapterTitle: `${r.romanNumeral}. ${r.chapterTitle}`,
        chosenLabel: r.choice.label,
        revealedPerspective: r.choice.revealedPerspective,
      })),
      synthesis,
      blindSpot,
      guidingQuestion,
      journalAnswers,
    };
    onSaveJourney(journey);
    setIsSaved(true);
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Travessia · ${analysis.archetype.title}`,
          text: `Conduzi "${profile.name}" e descobri "${analysis.archetype.title}". Veja o resultado e faça sua travessia:`,
          url: sharedUrl,
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    try {
      await navigator.clipboard.writeText(sharedUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // Ignore clipboard restriction
    }
  };

  const handleDownloadCard = () => {
    downloadDiscoveryCardPng({
      characterName: profile.name,
      originTitle: profile.origin.title,
      archetype: analysis.archetype,
      scores: analysis.scores,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPlainTextSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  const handleDownload = () => {
    const blob = new Blob([buildPlainTextSummary()], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travessia-${profile.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const synthesisParagraphs = synthesis
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="pt-10 pb-24 space-y-20">
      {/* Discovery Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
              <span>Descoberta Final</span>
              <span aria-hidden="true">·</span>
              <span>Personagem: {profile.name}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.origin.title}</span>
            </div>

            <h1
              className="font-editorial text-4xl sm:text-5xl font-medium text-[#1C1917] leading-[1.12] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {analysis.archetype.title}
            </h1>

            <p className="text-lg text-[#44403C] leading-relaxed">
              {analysis.archetype.subtitle}
            </p>
          </div>

          <div className="py-6 border-t border-b border-[#E5E2DC]">
            <p className="text-xs text-[#57534E] mb-2">Perspectiva de vida revelada</p>
            <p className="font-editorial italic text-xl sm:text-2xl text-[#1C1917] leading-relaxed">
              “{analysis.archetype.lifePerspective}”
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleShareLink}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {linkCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>
                  {linkCopied
                    ? 'Link da descoberta copiado'
                    : 'Compartilhar com amigos'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCard}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1C1917] bg-white border border-[#D6D3CD] hover:border-[#1C1917] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ImageDown className="w-4 h-4" />
                <span>Baixar cartão (PNG)</span>
              </button>

              <a
                href={whatsappDiscoveryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1C1917] bg-white border border-[#D6D3CD] hover:border-[#1C1917] rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <span>Enviar no WhatsApp</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaved}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isSaved
                    ? 'bg-[#14532D] text-white border-[#14532D] cursor-default'
                    : 'bg-white text-[#1C1917] border-[#D6D3CD] hover:border-[#1C1917]'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Salvo no Arquivo</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Salvar no Arquivo</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#14532D]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Texto copiado' : 'Copiar texto'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar (.txt)</span>
              </button>

              <button
                type="button"
                onClick={onRestart}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nova travessia</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <EditorialImage
            src={REFLECTION_IMAGE}
            alt="Prismas de vidro sobre pedra travertino refratando luz suave"
            caption="A mesma travessia revela ângulos distintos quando observada com calma."
            aspectClass="aspect-[4/3] lg:h-full lg:aspect-auto"
            className="h-full flex flex-col"
          />
        </div>
      </section>

      {/* Deep Synthesis + Blind Spot */}
      <section className="pt-12 border-t border-[#E5E2DC] grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1917]">
              O que sua história revelou
            </h2>
            {isEnriching && (
              <span className="text-xs text-[#57534E]">Aprofundando leitura…</span>
            )}
          </div>

          <div className="space-y-4 text-base text-[#292524] leading-[1.8] max-w-2xl">
            {synthesisParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-4">
            <p className="text-xs font-semibold text-[#57534E]">Força essencial observada</p>
            <p className="mt-1.5 text-base text-[#1C1917] leading-relaxed">
              {analysis.archetype.coreStrength}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white border border-[#E5E2DC] rounded-lg space-y-3">
            <p className="text-xs font-semibold text-[#57534E]">
              Ponto cego ou preço silencioso
            </p>
            <p className="text-sm text-[#292524] leading-relaxed">{blindSpot}</p>
          </div>

          <div className="p-6 bg-[#F3F1EC] border border-[#E5E2DC] rounded-lg space-y-3">
            <p className="text-xs font-semibold text-[#1E3A8A]">
              Pergunta para carregar consigo
            </p>
            <p className="font-editorial text-xl text-[#1C1917] leading-relaxed">
              {guidingQuestion}
            </p>
          </div>
        </div>
      </section>

      {/* Values Compass & Breakdown */}
      <section className="pt-12 border-t border-[#E5E2DC]">
        <div className="max-w-2xl mb-10">
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1917]">
            Bússola dos seus valores
          </h2>
          <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
            Distribuição proporcional dos seis valores humanos mobilizados pelas suas seis decisões.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 p-6 bg-white border border-[#E5E2DC] rounded-lg">
            <ValuesCompassChart scores={analysis.scores} />
          </div>

          <div className="lg:col-span-7 space-y-5">
            {analysis.sortedValues.map((item, idx) => (
              <div key={item.definition.key} className="space-y-2">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono-tabular text-xs text-[#78716C]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-base font-semibold text-[#1C1917]">
                      {item.definition.label}
                    </span>
                    <span className="text-xs text-[#78716C] hidden sm:inline">
                      · {item.definition.axisPole}
                    </span>
                  </div>
                  <span className="font-mono-tabular text-sm font-semibold text-[#1E3A8A]">
                    {item.score}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#E5E2DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1E3A8A] rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {item.definition.shortDesc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mirror of Decisions */}
      <section className="pt-12 border-t border-[#E5E2DC]">
        <div className="max-w-2xl mb-8">
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1917]">
            Espelho das suas seis decisões
          </h2>
          <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
            Releia cada encruzilhada que {profile.name} atravessou e o critério íntimo que ela
            trouxe à tona.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((rec) => (
            <article
              key={rec.chapterId}
              className="p-6 bg-white border border-[#E5E2DC] rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-[#57534E]">
                <span className="font-mono-tabular font-medium text-[#1C1917]">
                  Capítulo {rec.romanNumeral}
                </span>
                <span>{rec.chapterTitle}</span>
              </div>
              <p className="text-sm font-semibold text-[#1C1917] leading-relaxed">
                “{rec.choice.label}”
              </p>
              <p className="text-sm text-[#57534E] leading-relaxed pt-2 border-t border-[#F1EFEA]">
                {rec.choice.revealedPerspective}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Self-Knowledge Journal */}
      <section className="pt-12 border-t border-[#E5E2DC]">
        <div className="max-w-2xl mb-8">
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1C1917]">
            Caderno de reflexão pessoal
          </h2>
          <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
            Escrever transforma um insight passageiro em clareza prática. Suas respostas ficam
            apenas com você e podem ser salvas no arquivo ou baixadas em texto.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl">
          {analysis.archetype.journalPrompts.map((promptText, idx) => (
            <div key={idx} className="space-y-2.5">
              <label
                htmlFor={`journal-${idx}`}
                className="block text-sm font-semibold text-[#1C1917] leading-relaxed"
              >
                <span className="font-mono-tabular text-xs text-[#1E3A8A] mr-2">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                {promptText}
              </label>
              <textarea
                id={`journal-${idx}`}
                rows={3}
                value={journalAnswers[idx] ?? ''}
                onChange={(e) => {
                  setJournalAnswers((prev) => ({ ...prev, [idx]: e.target.value }));
                  if (isSaved) setIsSaved(false);
                }}
                placeholder="Escreva livremente o que esta pergunta desperta em você agora..."
                className="w-full px-4 py-3 text-sm bg-white border border-[#D6D3CD] rounded-lg text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1E3A8A] transition-colors leading-relaxed"
              />
            </div>
          ))}

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{isSaved ? 'Anotações atualizadas no Arquivo' : 'Guardar reflexão no Arquivo'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
