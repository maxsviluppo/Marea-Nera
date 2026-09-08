export type ChoiceHotspot = {
  id: string;
  label: string;
  /** Percorso da assegnare — aggiornare quando le scene saranno pronte */
  href: string;
  area: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

export const SCENE_CARD_1 = {
  id: 'card-1',
  image: '/media/card1.png',
  chapter: 'Capitolo 1: La stanza silenziosa',
  text: `L'aria sa di cera bruciata, tabacco e pioggia salmastra. Ti risvegli con la testa pesante. Sul tavolo di quercia giace una lettera sigillata con ceralacca scarlatta, una lama affilata e diversi sigilli sparsi… Nessuna traccia del tuo contatto.`,
  flipHint: 'Tocca la carta per girarla',
  choices: [
    {
      id: 'esamina',
      label: 'Esamina',
      href: '/scene/1/esamina',
      area: { top: 50.5, left: 5.5, width: 89, height: 11.5 },
    },
    {
      id: 'ispeziona',
      label: 'Ispeziona',
      href: '/scene/1/ispeziona',
      area: { top: 62.5, left: 5.5, width: 89, height: 10.5 },
    },
    {
      id: 'prudenza',
      label: 'Prudenza',
      href: '/scene/1/prudenza',
      area: { top: 73.5, left: 5.5, width: 89, height: 10.5 },
    },
    {
      id: 'dado-percezione',
      label: 'Test dado — Percezione',
      href: '/scene/1/dado-percezione',
      area: { top: 84.5, left: 5.5, width: 89, height: 10 },
    },
  ] satisfies ChoiceHotspot[],
} as const;
