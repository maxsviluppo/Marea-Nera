import './StartButton.css';

type StartButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function StartButton({ onClick, disabled }: StartButtonProps) {
  return (
    <button
      type="button"
      className="start-btn"
      onClick={onClick}
      disabled={disabled}
      aria-label="Inizio avventura"
    >
      <span className="start-btn__shadow" aria-hidden="true" />
      <span className="start-btn__body">
        <span className="start-btn__face">Inizio</span>
      </span>
    </button>
  );
}
