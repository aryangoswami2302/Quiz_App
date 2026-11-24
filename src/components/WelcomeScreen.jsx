import StatusMessage from './StatusMessage.jsx';

function WelcomeScreen({
  title,
  questionCount,
  warningMessage,
  onStart,
}) {
  return (
    <>
      <span className="badge">Your next challenge</span>
      <h1 className="title" id="app-title">
        Welcome to the quiz
      </h1>
      <h2 className="quiz-title">{title}</h2>
      <p className="description">
        Test your JavaScript knowledge with a focused set of questions. Take
        your time and do your best.
      </p>

      <div className="quiz-details">
        <span className="question-count">{questionCount}</span>
        <span>
          valid question{questionCount === 1 ? '' : 's'} in this quiz
        </span>
      </div>

      {warningMessage && (
        <StatusMessage variant="warning">{warningMessage}</StatusMessage>
      )}

      <button className="start-button" type="button" onClick={onStart}>
        Start Quiz
      </button>
    </>
  );
}

export default WelcomeScreen;
