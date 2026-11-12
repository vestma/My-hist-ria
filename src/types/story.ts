export type ValueKey =
  | 'autonomia'
  | 'pertencimento'
  | 'proposito'
  | 'serenidade'
  | 'coragem'
  | 'empatia';

export interface ValueDefinition {
  key: ValueKey;
  label: string;
  shortDesc: string;
  axisPole: string;
}

export interface OriginOption {
  id: string;
  title: string;
  subtitle: string;
  narrativeSeed: string;
}

export interface TensionOption {
  id: string;
  title: string;
  question: string;
  narrativeSeed: string;
}

export interface CharacterProfile {
  name: string;
  origin: OriginOption;
  tension: TensionOption;
}

export interface StoryChoice {
  id: string;
  label: string;
  actionText: string;
  reflectionNote: string;
  echoLine: string;
  revealedPerspective: string;
  weights: Partial<Record<ValueKey, number>>;
}

export interface StoryChapter {
  id: string;
  index: number;
  romanNumeral: string;
  chapterTitle: string;
  settingLabel: string;
  image: string;
  imageCaption: string;
  dilemma: string;
  buildNarrative: (profile: CharacterProfile, priorEchoes: string[]) => string[];
  choices: StoryChoice[];
}

export interface ChoiceRecord {
  chapterId: string;
  chapterTitle: string;
  romanNumeral: string;
  dilemma: string;
  choice: StoryChoice;
}

export interface ArchetypeResult {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  coreStrength: string;
  blindSpot: string;
  lifePerspective: string;
  guidingQuestion: string;
  journalPrompts: string[];
}

export interface SavedJourney {
  id: string;
  createdAt: string;
  characterName: string;
  originTitle: string;
  tensionTitle: string;
  archetypeTitle: string;
  scores: Record<ValueKey, number>;
  choices: Array<{
    chapterTitle: string;
    chosenLabel: string;
    revealedPerspective: string;
  }>;
  synthesis: string;
  blindSpot: string;
  guidingQuestion: string;
  journalAnswers: Record<number, string>;
}
