function ProgressBar({ currentQuestion, totalQuestions }) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="progress-container">
      <div className="progress-label">
        <p>
          Question {currentQuestion} of {totalQuestions}
        </p>
        <p>{Math.round(progress)}%</p>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin="0"
        aria-valuemax={totalQuestions}
        aria-valuenow={currentQuestion}
        aria-valuetext={`Question ${currentQuestion} of ${totalQuestions}`}
      >
        <span className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
