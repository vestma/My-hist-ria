import React from 'react';
import { ArrowRight } from 'lucide-react';
import { VALUE_DEFINITIONS } from '../data/storyData';
import { ArchetypeResult } from '../types/story';
import { SharedDiscoveryPayload } from '../utils/shareUtils';
import { ValuesCompassChart } from './ValuesCompassChart';

interface SharedDiscoveryViewProps {
  payload: SharedDiscoveryPayload;
  archetype: ArchetypeResult;
  onStartOwnJourney: () => void;
}

export const SharedDiscoveryView: React.FC<SharedDiscoveryViewProps> = ({
  payload,
  archetype,
  onStartOwnJourney,
}) => {
  const sortedValues = VALUE_DEFINITIONS.map((def) => ({
    def,
    score: payload.s[def.key] ?? 0,
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="pt-10 pb-24 space-y-12">
      <div className="p-8 sm:p-10 bg-white border border-[#E5E2DC] rounded-lg space-y-10">
        <div className="flex flex-wrap items-start justify-between gap-6 pb-8 border-b border-[#E5E2DC]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
              <span>Travessia compartilhada</span>
              <span aria-hidden="true">·</span>
              <span>Personagem: {payload.n}</span>
              <span aria-hidden="true">·</span>
              <span>{payload.o}</span>
            </div>
            <h1
              className="font-editorial text-3xl sm:text-5xl font-medium text-[#1C1917] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {archetype.title}
            </h1>
            <p className="text-base sm:text-lg text-[#44403C] leading-relaxed">
              {archetype.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onStartOwnJourney}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Fazer minha própria travessia</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <ValuesCompassChart scores={payload.s} />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="py-5 border-t border-b border-[#E5E2DC]">
              <p className="text-xs text-[#57534E] mb-1.5">Perspectiva de vida revelada</p>
              <p className="font-editorial italic text-xl text-[#1C1917] leading-relaxed">
                “{archetype.lifePerspective}”
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedValues.map((item) => (
                <div
                  key={item.def.key}
                  className="flex items-center justify-between py-2 border-b border-[#F1EFEA]"
                >
                  <span className="text-sm font-medium text-[#1C1917]">{item.def.label}</span>
                  <span className="font-mono-tabular text-sm font-semibold text-[#1E3A8A]">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#57534E] leading-relaxed">{archetype.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
