import React, { useState } from 'react';
import { ArrowRight, Check, Compass, Share2 } from 'lucide-react';
import {
  HERO_IMAGE,
  ORIGIN_OPTIONS,
  TENSION_OPTIONS,
  VALUE_DEFINITIONS,
} from '../data/storyData';
import { CharacterProfile, OriginOption, TensionOption } from '../types/story';
import { buildInviteUrl, buildWhatsAppShareUrl } from '../utils/shareUtils';
import { EditorialImage } from './EditorialImage';

interface LandingViewProps {
  onStartJourney: (profile: CharacterProfile) => void;
  savedCount: number;
  onOpenArchive: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartJourney,
  savedCount,
  onOpenArchive,
}) => {
  const [name, setName] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<OriginOption>(ORIGIN_OPTIONS[0]);
  const [selectedTension, setSelectedTension] = useState<TensionOption>(TENSION_OPTIONS[1]);
  const [nameError, setNameError] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }
    setNameError(false);
    onStartJourney({
      name: trimmed,
      origin: selectedOrigin,
      tension: selectedTension,
    });
  };

  const scrollToBuilder = () => {
    const el = document.getElementById('criar-personagem');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShareInvite = async () => {
    const url = buildInviteUrl();
    const shareText =
      'Fiz esta história interativa de autoconhecimento onde suas escolhas revelam seus valores essenciais. Experimente também:';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Travessia — Espelho das Escolhas',
          text: shareText,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard copy if dismissed or unsupported in iframe
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2500);
    } catch {
      // Ignore clipboard restriction
    }
  };

  const whatsappInviteHref = buildWhatsAppShareUrl(
    `Crie um personagem e descubra seus valores em Travessia — Espelho das Escolhas: ${buildInviteUrl()}`
  );

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Split */}
      <section id="jornada" className="pt-10 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#57534E] tracking-wide">
                <span>Narrativa Interativa</span>
                <span aria-hidden="true">·</span>
                <span>Autoconhecimento</span>
                <span aria-hidden="true">·</span>
                <span>6 Capítulos</span>
              </div>

              <h1
                className="font-editorial text-4xl sm:text-5xl lg:text-[3.4rem] font-medium text-[#1C1917] leading-[1.12] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Crie um personagem, conduza suas escolhas e descubra o que guia você.
              </h1>

              <p className="text-base sm:text-lg text-[#44403C] leading-relaxed max-w-xl">
                Travessia é uma história interativa em que cada decisão diante de dilemas humanos
                molda o caminho do seu personagem — revelando, ao final, o mapa dos seus valores,
                perspectivas de vida e perguntas para o seu próprio momento.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToBuilder}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <span>Criar meu personagem</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShareInvite}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-[#1C1917] bg-white border border-[#D6D3CD] hover:border-[#1C1917] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {inviteCopied ? (
                  <Check className="w-4 h-4 text-[#14532D]" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>{inviteCopied ? 'Link copiado' : 'Convidar amigos'}</span>
              </button>

              <a
                href={whatsappInviteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#57534E] hover:text-[#1C1917] underline underline-offset-4 decoration-[#D6D3CD] hover:decoration-[#1C1917] transition-colors whitespace-nowrap shrink-0"
              >
                WhatsApp
              </a>

              {savedCount > 0 && (
                <button
                  type="button"
                  onClick={onOpenArchive}
                  className="text-sm font-medium text-[#1C1917] underline underline-offset-4 decoration-[#D6D3CD] hover:decoration-[#1C1917] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Rever travessias ({savedCount})
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="w-full h-full">
              <EditorialImage
                src={HERO_IMAGE}
                alt="Limiar de pedra aberto para montanhas envoltas em névoa na luz da manhã"
                caption="Cada encruzilhada ficcional funciona como um espelho silencioso de critérios reais."
                aspectClass="aspect-[16/10] lg:h-full lg:aspect-auto min-h-[320px]"
                className="h-full flex flex-col"
              />
            </div>
          </div>
        </div>

        {/* 4-column editorial summary strip below hero */}
        <div className="mt-12 pt-8 border-t border-[#E5E2DC] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="font-mono-tabular text-xs text-[#57534E]">01 · Origem</p>
            <p className="mt-1.5 text-sm font-semibold text-[#1C1917]">Retrato inicial</p>
            <p className="mt-1 text-sm text-[#57534E] leading-relaxed">
              Nomeie seu protagonista e defina a inquietação que acompanha seus passos.
            </p>
          </div>
          <div>
            <p className="font-mono-tabular text-xs text-[#57534E]">02 · Decisões</p>
            <p className="mt-1.5 text-sm font-semibold text-[#1C1917]">Dilemas sem clichês</p>
            <p className="mt-1 text-sm text-[#57534E] leading-relaxed">
              Não há respostas certas ou erradas — cada escolha protege um valor e renuncia a outro.
            </p>
          </div>
          <div>
            <p className="font-mono-tabular text-xs text-[#57534E]">03 · Ecos</p>
            <p className="mt-1.5 text-sm font-semibold text-[#1C1917]">Memória narrativa</p>
            <p className="mt-1 text-sm text-[#57534E] leading-relaxed">
              O texto dos capítulos seguintes incorpora os ecos sutis das suas decisões anteriores.
            </p>
          </div>
          <div>
            <p className="font-mono-tabular text-xs text-[#57534E]">04 · Descoberta</p>
            <p className="mt-1.5 text-sm font-semibold text-[#1C1917]">Espelho e diário</p>
            <p className="mt-1 text-sm text-[#57534E] leading-relaxed">
              Receba seu arquétipo, a bússola dos 6 valores e perguntas íntimas de reflexão.
            </p>
          </div>
        </div>
      </section>

      {/* Character Builder Section */}
      <section
        id="criar-personagem"
        className="pt-12 border-t border-[#E5E2DC]"
      >
        <div className="max-w-3xl">
          <p className="text-xs text-[#57534E] tracking-wide">
            Ateliê do Personagem · Passo Único Antes da Partida
          </p>
          <h2 className="mt-2 font-editorial text-3xl sm:text-4xl font-medium text-[#1C1917] tracking-tight">
            Quem vai atravessar esta história por você?
          </h2>
          <p className="mt-3 text-base text-[#57534E] leading-relaxed">
            Você pode usar o seu próprio nome ou criar um alter ego. A distância simbólica de um
            personagem costuma revelar com mais honestidade o que realmente valorizamos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          {/* Name Input */}
          <div className="max-w-md">
            <label
              htmlFor="character-name"
              className="block text-sm font-semibold text-[#1C1917]"
            >
              Nome do personagem
            </label>
            <p className="mt-1 text-xs text-[#57534E]">
              Exemplo: Marina, Mateus, Helena ou seu próprio nome.
            </p>
            <input
              id="character-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(false);
              }}
              placeholder="Digite um nome para iniciar..."
              maxLength={40}
              className={`mt-3 w-full px-4 py-3 text-base bg-white border rounded-lg text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none transition-colors ${
                nameError
                  ? 'border-[#B91C1C] focus:border-[#B91C1C]'
                  : 'border-[#D6D3CD] focus:border-[#1E3A8A]'
              }`}
            />
            {nameError && (
              <p className="mt-2 text-xs font-medium text-[#B91C1C]" role="alert">
                Informe um nome para o personagem antes de iniciar a história.
              </p>
            )}
          </div>

          {/* Origin Selection */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-sm font-semibold text-[#1C1917]">
                1. Ponto de partida do personagem
              </h3>
              <span className="text-xs text-[#57534E]">Escolha uma postura inicial</span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {ORIGIN_OPTIONS.map((origin) => {
                const isSelected = selectedOrigin.id === origin.id;
                return (
                  <button
                    key={origin.id}
                    type="button"
                    onClick={() => setSelectedOrigin(origin)}
                    aria-pressed={isSelected}
                    className={`text-left p-5 rounded-lg border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                      isSelected
                        ? 'bg-white border-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                        : 'bg-white/70 border-[#E5E2DC] hover:border-[#A8A29E]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-editorial text-lg font-medium text-[#1C1917]">
                        {origin.title}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? 'text-[#1E3A8A]' : 'text-[#78716C]'
                        }`}
                      >
                        {isSelected ? 'Selecionado' : 'Escolher'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                      {origin.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inner Tension Selection */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-sm font-semibold text-[#1C1917]">
                2. A pergunta que acompanha este momento
              </h3>
              <span className="text-xs text-[#57534E]">Define o tom íntimo da travessia</span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {TENSION_OPTIONS.map((tension) => {
                const isSelected = selectedTension.id === tension.id;
                return (
                  <button
                    key={tension.id}
                    type="button"
                    onClick={() => setSelectedTension(tension)}
                    aria-pressed={isSelected}
                    className={`text-left p-5 rounded-lg border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                      isSelected
                        ? 'bg-white border-[#1E3A8A] ring-1 ring-[#1E3A8A]'
                        : 'bg-white/70 border-[#E5E2DC] hover:border-[#A8A29E]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-editorial text-lg font-medium text-[#1C1917]">
                        {tension.title}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? 'text-[#1E3A8A]' : 'text-[#78716C]'
                        }`}
                      >
                        {isSelected ? 'Selecionado' : 'Escolher'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#57534E] leading-relaxed italic font-editorial">
                      “{tension.question}”
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              <span>Começar a História</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-[#57534E]">
              Duração média: 4 minutos · Suas respostas ficam apenas no seu navegador.
            </p>
          </div>
        </form>
      </section>

      {/* Six Values Overview */}
      <section id="valores" className="pt-12 border-t border-[#E5E2DC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#57534E]">
              <Compass className="w-4 h-4 text-[#1E3A8A]" />
              <span>Bússola de Autoconhecimento</span>
            </div>
            <h2 className="font-editorial text-3xl font-medium text-[#1C1917] tracking-tight">
              Seis dimensões humanas observadas ao longo do caminho
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Não existem traços superiores a outros. O objetivo da reflexão final é tornar visível
              quais valores têm falado mais alto nas suas escolhas espontâneas.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {VALUE_DEFINITIONS.map((val, idx) => (
              <div key={val.key} className="pt-4 border-t border-[#E5E2DC]">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-editorial text-lg font-medium text-[#1C1917]">
                    {String(idx + 1).padStart(2, '0')}. {val.label}
                  </h3>
                  <span className="text-xs text-[#78716C]">{val.axisPole}</span>
                </div>
                <p className="mt-1.5 text-sm text-[#57534E] leading-relaxed">{val.shortDesc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
