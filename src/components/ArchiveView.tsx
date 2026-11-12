import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { VALUE_DEFINITIONS } from '../data/storyData';
import { SavedJourney } from '../types/story';
import { ValuesCompassChart } from './ValuesCompassChart';

interface ArchiveViewProps {
  journeys: SavedJourney[];
  onDeleteJourney: (id: string) => void;
  onStartNew: () => void;
  onBackHome: () => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  journeys,
  onDeleteJourney,
  onStartNew,
  onBackHome,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    journeys[0]?.id ?? null
  );

  const selected = journeys.find((j) => j.id === selectedId) ?? journeys[0] ?? null;

  return (
    <div className="pt-10 pb-24 space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-[#E5E2DC]">
        <div className="space-y-2">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a página inicial</span>
          </button>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1C1917]">
            Arquivo Pessoal de Travessias
          </h1>
          <p className="text-sm text-[#57534E]">
            Compare personagens, momentos de vida e valores revelados ao longo do tempo.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartNew}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          Criar nova história
        </button>
      </div>

      {journeys.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <h2 className="font-editorial text-2xl font-medium text-[#1C1917]">
            Nenhuma travessia guardada ainda
          </h2>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Ao concluir uma história, clique em “Salvar no Arquivo Pessoal” para registrar seu
            mapa de valores e anotações aqui.
          </p>
          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer"
          >
            Começar primeira história
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* List */}
          <div className="lg:col-span-4 space-y-3">
            {journeys.map((item) => {
              const isSelected = selected?.id === item.id;
              const dateLabel = new Date(item.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-white border-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                      : 'bg-white/70 border-[#E5E2DC] hover:border-[#A8A29E]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="w-full text-left cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#78716C]">
                      <span>{dateLabel}</span>
                      <span>{item.originTitle}</span>
                    </div>
                    <p className="font-editorial text-lg font-medium text-[#1C1917]">
                      {item.characterName}
                    </p>
                    <p className="text-xs font-medium text-[#1E3A8A]">{item.archetypeTitle}</p>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Detail */}
          {selected && (
            <div className="lg:col-span-8 p-8 bg-white border border-[#E5E2DC] rounded-lg space-y-8">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#E5E2DC]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <span>{selected.characterName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selected.originTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selected.tensionTitle}</span>
                  </div>
                  <h2 className="font-editorial text-3xl font-medium text-[#1C1917]">
                    {selected.archetypeTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteJourney(selected.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#B91C1C] border border-[#E5E2DC] rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-6">
                  <ValuesCompassChart scores={selected.scores} />
                </div>
                <div className="md:col-span-6 space-y-3">
                  {VALUE_DEFINITIONS.map((def) => (
                    <div key={def.key} className="flex items-center justify-between text-sm">
                      <span className="text-[#44403C]">{def.label}</span>
                      <span className="font-mono-tabular font-semibold text-[#1C1917]">
                        {selected.scores[def.key]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E5E2DC]">
                <h3 className="text-xs font-semibold text-[#57534E]">Síntese da travessia</h3>
                <p className="text-sm text-[#292524] leading-relaxed whitespace-pre-line">
                  {selected.synthesis}
                </p>
              </div>

              <div className="p-5 bg-[#F8F7F4] border border-[#E5E2DC] rounded-lg space-y-1.5">
                <p className="text-xs font-semibold text-[#1E3A8A]">Pergunta-guia</p>
                <p className="font-editorial text-lg text-[#1C1917]">
                  {selected.guidingQuestion}
                </p>
              </div>

              {Object.values(selected.journalAnswers).some((v) => v.trim()) && (
                <div className="space-y-3 pt-4 border-t border-[#E5E2DC]">
                  <h3 className="text-xs font-semibold text-[#57534E]">Anotações pessoais</h3>
                  <div className="space-y-3">
                    {Object.entries(selected.journalAnswers).map(([idx, answer]) =>
                      answer.trim() ? (
                        <p key={idx} className="text-sm text-[#292524] leading-relaxed">
                          <span className="font-mono-tabular text-xs text-[#78716C] mr-2">
                            {String(Number(idx) + 1).padStart(2, '0')}.
                          </span>
                          {answer}
                        </p>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
