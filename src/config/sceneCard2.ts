import { type ChoiceHotspot } from './sceneCard1';

export const SCENE_CARD_2 = {
  id: 'card-2',
  image: '/media/card2.png',
  chapter: 'Capitolo 2: Decisioni Cruciali',
  choices: [
    {
      id: 'enigma-sigilli',
      label: '[Enigma - I Sigilli] Esamina rapidamente i sigilli N, H, X',
      href: '/scene/2/enigma-sigilli',
      area: { top: 16.5, left: 10, width: 80, height: 18.8 },
    },
    {
      id: 'fuga-finestra',
      label: '[Fuga - Finestra] Corri verso la finestra ad arco con la grata di piombo',
      href: '/scene/2/fuga-finestra',
      area: { top: 37.4, left: 10, width: 80, height: 17.8 },
    },
    {
      id: 'agguato-combattimento',
      label: '[Agguato - Combattimento] Spegni la candela per piombare la stanza nel buio',
      href: '/scene/2/agguato-combattimento',
      area: { top: 57.2, left: 10, width: 80, height: 17.8 },
    },
    {
      id: 'occultamento',
      label: '[Occultamento] Ingoia o brucia la lettera nella fiamma residua',
      href: '/scene/2/occultamento',
      area: { top: 77.0, left: 10, width: 80, height: 17.6 },
    },
  ] satisfies ChoiceHotspot[],
} as const;
