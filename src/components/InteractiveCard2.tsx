import { useState, type MouseEvent } from 'react';
import { SCENE_CARD_2 } from '../config/sceneCard2';
import { type ChoiceHotspot } from '../config/sceneCard1';
import './InteractiveCard2.css';

type InteractiveCard2Props = {
  onChoice?: (choice: ChoiceHotspot) => void;
};

export default function InteractiveCard2({ onChoice }: InteractiveCard2Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  const handleChoiceClick = (event: MouseEvent<HTMLAnchorElement>, choice: ChoiceHotspot) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedNotice(choice.label);
    onChoice?.(choice);
  };

  return (
    <div className="card2-stage">
      <div className="card2-panel" aria-label={SCENE_CARD_2.chapter}>
        <img
          src={SCENE_CARD_2.image}
          alt={SCENE_CARD_2.chapter}
          className="card2-media"
          draggable={false}
        />

        <div className="card2-hotspots">
          {SCENE_CARD_2.choices.map((choice) => (
            <a
              key={choice.id}
              href={choice.href}
              className={`card2-choice ${hoveredId === choice.id ? 'card2-choice--active' : ''}`}
              style={{
                top: `${choice.area.top}%`,
                left: `${choice.area.left}%`,
                width: `${choice.area.width}%`,
                height: `${choice.area.height}%`,
              }}
              onPointerEnter={() => setHoveredId(choice.id)}
              onPointerLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(choice.id)}
              onBlur={() => setHoveredId(null)}
              onClick={(e) => handleChoiceClick(e, choice)}
              aria-label={choice.label}
            />
          ))}
        </div>

        {selectedNotice && (
          <div className="card2-toast" onClick={() => setSelectedNotice(null)}>
            ⚔️ Azione selezionata: <strong>{selectedNotice}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
