function QuestionCard({ question }) {
  return (
    <article
      className="question-card"
      aria-labelledby="current-question"
      aria-live="polite"
    >
      <h2 className="question-prompt" id="current-question">
        {question}
      </h2>
    </article>
  );
}

export default QuestionCard;
