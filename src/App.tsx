import { useEffect, useState } from 'react';
import { ArchiveView } from './components/ArchiveView';
import { LandingView } from './components/LandingView';
import { ReflectionView } from './components/ReflectionView';
import { SharedDiscoveryView } from './components/SharedDiscoveryView';
import { StoryView } from './components/StoryView';
import { CharacterProfile, ChoiceRecord, SavedJourney } from './types/story';
import {
  clearSharedDiscoveryUrl,
  parseSharedDiscoveryFromUrl,
} from './utils/shareUtils';

type AppView = 'landing' | 'story' | 'reflection' | 'archive' | 'shared';

const STORAGE_KEY = 'travessia_saved_journeys_v1';

export default function App() {
  const [sharedData, setSharedData] = useState(() => parseSharedDiscoveryFromUrl());
  const [view, setView] = useState<AppView>(() =>
    parseSharedDiscoveryFromUrl() ? 'shared' : 'landing'
  );
  const [profile, setProfile] = useState<CharacterProfile | null>(null);
  const [records, setRecords] = useState<ChoiceRecord[]>([]);
  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedJourney[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJourneys));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedJourneys]);

  const handleStartJourney = (newProfile: CharacterProfile) => {
    clearSharedDiscoveryUrl();
    setSharedData(null);
    setProfile(newProfile);
    setRecords([]);
    setView('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteStory = (finalRecords: ChoiceRecord[]) => {
    setRecords(finalRecords);
    setView('reflection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveJourney = (journey: SavedJourney) => {
    setSavedJourneys((prev) => {
      const existsIndex = prev.findIndex(
        (j) =>
          j.characterName === journey.characterName &&
          j.archetypeTitle === journey.archetypeTitle &&
          j.choices.length === journey.choices.length &&
          Math.abs(new Date(j.createdAt).getTime() - new Date(journey.createdAt).getTime()) < 60000
      );
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = journey;
        return next;
      }
      return [journey, ...prev];
    });
  };

  const handleDeleteJourney = (id: string) => {
    setSavedJourneys((prev) => prev.filter((j) => j.id !== id));
  };

  const navigateToSection = (sectionId: string) => {
    clearSharedDiscoveryUrl();
    setSharedData(null);
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#1C1917]">
      {/* Strict 3-Zone Editorial Top Bar */}
      <header className="border-b border-[#E5E2DC] bg-[#F8F7F4]/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single wordmark */}
          <button
            type="button"
            onClick={() => {
              clearSharedDiscoveryUrl();
              setSharedData(null);
              setView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-editorial text-xl font-medium tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Travessia
          </button>

          {/* Zone 2: Concise single-line text links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
            <button
              type="button"
              onClick={() => navigateToSection('jornada')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              A Jornada
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('criar-personagem')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Personagem
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('valores')}
              className="hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Seis Valores
            </button>
            <button
              type="button"
              onClick={() => {
                clearSharedDiscoveryUrl();
                setSharedData(null);
                setView('archive');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'archive' ? 'text-[#1C1917] underline underline-offset-4' : ''
              }`}
            >
              Arquivo Pessoal
            </button>
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => navigateToSection('criar-personagem')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {view === 'landing' ? 'Começar História' : 'Nova Travessia'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
        {view === 'shared' && sharedData && (
          <SharedDiscoveryView
            payload={sharedData.payload}
            archetype={sharedData.archetype}
            onStartOwnJourney={() => navigateToSection('criar-personagem')}
          />
        )}

        {view === 'landing' && (
          <LandingView
            onStartJourney={handleStartJourney}
            savedCount={savedJourneys.length}
            onOpenArchive={() => {
              setView('archive');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {view === 'story' && profile && (
          <StoryView
            profile={profile}
            onComplete={handleCompleteStory}
            onExit={() => setView('landing')}
          />
        )}

        {view === 'reflection' && profile && (
          <ReflectionView
            profile={profile}
            records={records}
            onRestart={() => navigateToSection('criar-personagem')}
            onSaveJourney={handleSaveJourney}
          />
        )}

        {view === 'archive' && (
          <ArchiveView
            journeys={savedJourneys}
            onDeleteJourney={handleDeleteJourney}
            onStartNew={() => navigateToSection('criar-personagem')}
            onBackHome={() => setView('landing')}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E5E2DC] bg-[#F8F7F4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#57534E]">
          <span>Travessia · Narrativa interativa para autoconhecimento</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigateToSection('valores')}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              Sobre os valores
            </button>
            <button
              type="button"
              onClick={() => {
                setView('archive');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#1C1917] transition-colors cursor-pointer"
            >
              Arquivo pessoal ({savedJourneys.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
