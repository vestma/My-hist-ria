import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Compass } from 'lucide-react';
import { STORY_CHAPTERS } from '../data/storyData';
import { CharacterProfile, ChoiceRecord, StoryChoice } from '../types/story';

interface StoryViewProps {
  profile: CharacterProfile;
  onComplete: (records: ChoiceRecord[]) => void;
  onExit: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({ profile, onComplete, onExit }) => {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [records, setRecords] = useState<ChoiceRecord[]>([]);
  const [pendingChoice, setPendingChoice] = useState<StoryChoice | null>(null);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const chapter = STORY_CHAPTERS[chapterIdx];
  const priorEchoes = records.map((r) => r.choice.echoLine);
  const paragraphs = chapter.buildNarrative(profile, priorEchoes).filter(Boolean);

  const progressPercent = Math.round(
    ((chapterIdx + (pendingChoice ? 1 : 0)) / STORY_CHAPTERS.length) * 100
  );

  const handleSelectChoice = (choice: StoryChoice) => {
    setPendingChoice(choice);
  };

  const handleAdvance = () => {
    if (!pendingChoice) return;

    const newRecord: ChoiceRecord = {
      chapterId: chapter.id,
      chapterTitle: chapter.chapterTitle,
      romanNumeral: chapter.romanNumeral,
      dilemma: chapter.dilemma,
      choice: pendingChoice,
    };

    const updated = [...records.slice(0, chapterIdx), newRecord];
    setRecords(updated);
    setPendingChoice(null);

    if (chapterIdx + 1 < STORY_CHAPTERS.length) {
      setChapterIdx(chapterIdx + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(updated);
    }
  };

  const handlePreviousChapter = () => {
    if (chapterIdx === 0) {
      onExit();
      return;
    }
    const prevIdx = chapterIdx - 1;
    const prevChoice = records[prevIdx]?.choice ?? null;
    setChapterIdx(prevIdx);
    setPendingChoice(prevChoice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasImgError = Boolean(imgErrorMap[chapter.id]);

  return (
    <div className="relative pt-4 sm:pt-6 pb-24">
      {/* Subtle environmental ambient wash from current chapter scene */}
      {!hasImgError && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-6 h-[520px] overflow-hidden opacity-25 [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]"
        >
          <img
            src={chapter.image}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-110 blur-3xl"
          />
        </div>
      )}

      {/* Immersive Full-Width Scene Viewport */}
      <section className="relative z-10">
        <div className="relative w-full min-h-[380px] sm:min-h-[450px] lg:min-h-[510px] rounded-xl overflow-hidden bg-[#1C1917] border border-[#292524]/15 flex flex-col justify-between">
          {/* Background Scene Photograph */}
          {!hasImgError ? (
            <img
              key={chapter.id}
              src={chapter.image}
              alt={chapter.chapterTitle}
              referrerPolicy="no-referrer"
              onError={() =>
                setImgErrorMap((prev) => ({ ...prev, [chapter.id]: true }))
              }
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
                pendingChoice ? 'scale-[1.03]' : 'scale-100'
              }`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#292524] to-[#1C1917] text-[#D6D3CD]">
              <Compass className="w-10 h-10 mb-3 stroke-[1.5]" />
              <p className="font-editorial text-lg">{chapter.chapterTitle}</p>
            </div>
          )}

          {/* Measured contrast scrim for legible typography over imagery */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#141210]/92 via-[#141210]/40 to-[#141210]/55"
          />

          {/* Top Scene HUD: Progress & Character Context */}
          <div className="relative z-10 px-6 sm:px-10 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#E7E5E4]">
              <div className="flex items-center gap-2.5">
                <span className="font-mono-tabular font-medium text-white">
                  Capítulo {String(chapterIdx + 1).padStart(2, '0')} de{' '}
                  {String(STORY_CHAPTERS.length).padStart(2, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span>{profile.name}</span>
                <span aria-hidden="true" className="hidden sm:inline">
                  ·
                </span>
                <span className="hidden sm:inline text-[#D6D3CD]">
                  {profile.origin.title}
                </span>
              </div>

              <span className="font-mono-tabular text-[#E7E5E4]">
                {progressPercent}% concluído
              </span>
            </div>

            <div className="mt-3 h-[2px] w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Bottom Scene Overlay: Title & Dilemma inside the atmosphere */}
          <div className="relative z-10 px-6 sm:px-10 pb-14 sm:pb-16 pt-16 max-w-3xl">
            <p className="text-xs text-[#D6D3CD] tracking-wide mb-2">
              {chapter.settingLabel}
            </p>
            <h1
              className="font-editorial text-3xl sm:text-5xl font-medium text-white leading-[1.12] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {chapter.romanNumeral}. {chapter.chapterTitle}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#E7E5E4] leading-relaxed max-w-2xl">
              {chapter.dilemma}
            </p>
          </div>
        </div>
      </section>

      {/* Layered Reading & Decision Sanctuary emerging from the scene */}
      <section className="relative z-20 -mt-8 sm:-mt-10 max-w-3xl mx-auto px-2 sm:px-0">
        <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 sm:p-10 shadow-[0_14px_40px_-18px_rgba(28,25,23,0.16)] space-y-8">
          {/* Narrative Prose */}
          <div className="space-y-5 text-[17px] text-[#292524] leading-[1.82]">
            {paragraphs.map((para, i) => {
              const isEchoLead = chapterIdx > 0 && i === 0;
              return (
                <p
                  key={i}
                  className={
                    !isEchoLead && i === 0
                      ? 'first-letter:font-editorial first-letter:text-5xl first-letter:font-medium first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85] first-letter:text-[#1C1917]'
                      : isEchoLead
                        ? 'italic text-[#57534E] font-editorial'
                        : ''
                  }
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* Decision Options */}
          <div className="pt-6 border-t border-[#E5E2DC] space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold text-[#1C1917]">
                O que {profile.name} decide fazer agora?
              </h2>
              <span className="text-xs text-[#57534E]">
                Inquietação: “{profile.tension.question}”
              </span>
            </div>

            <div className="space-y-3">
              {chapter.choices.map((choice, idx) => {
                const isSelected = pendingChoice?.id === choice.id;
                const letter = ['A', 'B', 'C'][idx];
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handleSelectChoice(choice)}
                    aria-pressed={isSelected}
                    className={`w-full text-left p-5 rounded-lg border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                      isSelected
                        ? 'bg-[#F8F7F4] border-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                        : 'bg-white border-[#E5E2DC] hover:border-[#A8A29E] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-mono-tabular text-xs font-medium mt-0.5 shrink-0 w-6 h-6 rounded flex items-center justify-center border ${
                          isSelected
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                            : 'bg-[#F8F7F4] text-[#57534E] border-[#E5E2DC]'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : letter}
                      </span>
                      <span className="text-[15px] font-medium text-[#1C1917] leading-relaxed">
                        {choice.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Immediate Narrative Consequence */}
          {pendingChoice && (
            <div className="p-6 bg-[#F8F7F4] border border-[#D6D3CD] rounded-lg space-y-3">
              <p className="text-xs font-semibold text-[#1E3A8A]">
                O momento seguinte
              </p>
              <p className="text-[15px] text-[#292524] leading-relaxed">
                {pendingChoice.actionText}
              </p>
              <p className="text-xs text-[#57534E] pt-2 border-t border-[#E5E2DC]">
                {pendingChoice.reflectionNote}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePreviousChapter}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{chapterIdx === 0 ? 'Voltar ao início' : 'Capítulo anterior'}</span>
            </button>

            <button
              type="button"
              onClick={handleAdvance}
              disabled={!pendingChoice}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                pendingChoice
                  ? 'bg-[#1E3A8A] text-white hover:bg-[#172E6E] cursor-pointer'
                  : 'bg-[#E5E2DC] text-[#78716C] cursor-not-allowed'
              }`}
            >
              <span>
                {chapterIdx + 1 === STORY_CHAPTERS.length
                  ? 'Revelar Reflexão Final'
                  : 'Seguir para o próximo capítulo'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Footprints of earlier chapters */}
          {records.length > 0 && chapterIdx > 0 && (
            <div className="pt-6 border-t border-[#E5E2DC] space-y-2.5">
              <p className="text-xs font-semibold text-[#57534E]">
                Pegadas da travessia até aqui
              </p>
              <ul className="space-y-2">
                {records.slice(0, chapterIdx).map((rec) => (
                  <li key={rec.chapterId} className="text-xs text-[#57534E] leading-relaxed">
                    <span className="font-mono-tabular text-[#1C1917] font-medium mr-1.5">
                      {rec.romanNumeral}.
                    </span>
                    {rec.choice.reflectionNote}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#78716C] font-editorial italic">
          {chapter.imageCaption}
        </p>
      </section>
    </div>
  );
};
