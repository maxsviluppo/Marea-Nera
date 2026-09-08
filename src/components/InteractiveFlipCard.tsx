import { useState, type MouseEvent } from 'react';
import { SCENE_CARD_1, type ChoiceHotspot } from '../config/sceneCard1';
import './InteractiveFlipCard.css';

type InteractiveFlipCardProps = {
  onChoice?: (choice: ChoiceHotspot) => void;
};

export default function InteractiveFlipCard({ onChoice }: InteractiveFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleCardClick = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  const handleChoiceClick = (event: MouseEvent<HTMLAnchorElement>, choice: ChoiceHotspot) => {
    event.stopPropagation();
    onChoice?.(choice);
  };

  return (
    <div className="flip-card">
      <div className="flip-card__stage">
        <button
          type="button"
          className={`flip-card__inner ${isFlipped ? 'flip-card__inner--flipped' : ''}`}
          onClick={handleCardClick}
          aria-label={isFlipped ? 'Carta scena — retro con scelte' : 'Carta scena — tocca per girare'}
        >
          <div className="flip-card__face">
            <img
              src={SCENE_CARD_1.image}
              alt={SCENE_CARD_1.chapter}
              className="flip-card__media flip-card__media--front"
              draggable={false}
            />
            {!isFlipped && (
              <p className="flip-card__hint">{SCENE_CARD_1.flipHint}</p>
            )}
          </div>

          <div className="flip-card__face flip-card__face--back">
            <img
              src={SCENE_CARD_1.image}
              alt="Scelte disponibili"
              className="flip-card__media flip-card__media--back"
              draggable={false}
            />

            <div className="flip-card__hotspots">
              {SCENE_CARD_1.choices.map((choice) => (
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
        </button>
      </div>
    </div>
  );
}
