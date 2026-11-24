function Results({ title, results, onRestart }) {
  const {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage,
    passed,
  } = results;
  const displayedPercentage = Number(percentage.toFixed(1));

  return (
    <section
      className={`quiz-results ${
        passed ? 'quiz-results-pass' : 'quiz-results-fail'
      }`}
      aria-labelledby="results-title"
    >
      <span className="badge">{passed ? 'PASS' : 'FAIL'}</span>
      <h1 className="title" id="results-title">
        Quiz results
      </h1>
      <h2 className="quiz-title">{title}</h2>

      <p className="results-score">
        Final score: <strong>{correctAnswers} / {totalQuestions}</strong>
      </p>
      <p className="results-percentage">{displayedPercentage}%</p>
      <p className="results-message" role="status">
        {passed
          ? 'PASS - Congratulations, you passed!'
          : 'FAIL - You did not pass this time. A score of 60% is required to pass.'}
      </p>

      <dl className="results-breakdown">
        <div className="results-stat">
          <dt>Total questions</dt>
          <dd>{totalQuestions}</dd>
        </div>
        <div className="results-stat">
          <dt>Correct answers</dt>
          <dd>{correctAnswers}</dd>
        </div>
        <div className="results-stat">
          <dt>Incorrect answers</dt>
          <dd>{incorrectAnswers}</dd>
        </div>
      </dl>
      <button
        className="restart-button"
        type="button"
        onClick={onRestart}
      >
        Restart Quiz
      </button>
    </section>
  );
}

export default Results;
