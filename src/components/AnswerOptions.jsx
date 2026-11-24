function AnswerOptions({
  questionId,
  options,
  selectedOptionIndex,
  correctOptionIndex,
  disabled,
  onSelect,
}) {
  return (
    <fieldset
      className="answer-options"
      aria-labelledby="current-question"
      disabled={disabled}
    >
      <legend className="visually-hidden">Choose one answer</legend>
      {options.map((option, index) => {
        const selected = selectedOptionIndex === index;
        const correct = disabled && correctOptionIndex === index;
        const incorrect = disabled && selected && !correct;

        return (
          <label
            className={`answer-option${selected ? ' answer-option-selected' : ''}${
              disabled ? ' answer-option-disabled' : ''
            }${correct ? ' answer-option-correct' : ''}${
              incorrect ? ' answer-option-incorrect' : ''
            }`}
            key={`${questionId}-${index}`}
          >
            <input
              type="radio"
              name={`answer-${questionId}`}
              value={index}
              checked={selected}
              onChange={() => onSelect(index)}
            />
            <span>{option}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export default AnswerOptions;
