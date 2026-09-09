import { useState, type MouseEvent } from 'react';
import { SCENE_CARD_2 } from '../config/sceneCard2';
import { type ChoiceHotspot } from '../config/sceneCard1';
import './InteractiveFlipCard.css';

type InteractiveCard2Props = {
  onChoice?: (choice: ChoiceHotspot) => void;
};

export default function InteractiveCard2({ onChoice }: InteractiveCard2Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleChoiceClick = (event: MouseEvent<HTMLAnchorElement>, choice: ChoiceHotspot) => {
    event.preventDefault();
    event.stopPropagation();
    onChoice?.(choice);
  };

  return (
    <div className="flip-card">
      <div className="flip-card__stage">
        <div className="flip-card__panel" aria-label={SCENE_CARD_2.chapter}>
          <img
            src={SCENE_CARD_2.image}
            alt={SCENE_CARD_2.chapter}
            className="flip-card__media"
            draggable={false}
          />

          <div className="flip-card__hotspots">
            {SCENE_CARD_2.choices.map((choice) => (
              <a
                key={choice.id}
                href={choice.href}
                className={`flip-card__choice ${
                  hoveredId === choice.id ? 'flip-card__choice--active' : ''
                }`}
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
        </div>
      </div>
    </div>
  );
}
