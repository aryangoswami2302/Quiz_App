import { useReducer } from 'react';
import AnswerOptions from './AnswerOptions.jsx';
import ProgressBar from './ProgressBar.jsx';
import QuestionCard from './QuestionCard.jsx';
import Results from './Results.jsx';
import StatusMessage from './StatusMessage.jsx';
import WelcomeScreen from './WelcomeScreen.jsx';
import {
  createInitialQuizState,
  quizReducer,
} from '../utils/quizReducer.js';
import {
  calculateQuizResults,
  calculateScore,
  getAnswerFeedback,
} from '../utils/scoring.js';

function Quiz({ title, questions, warningMessage }) {
  const [state, dispatch] = useReducer(
    quizReducer,
    questions.length,
    createInitialQuizState
  );

  if (state.screen === 'welcome') {
    return (
      <WelcomeScreen
        title={title}
        questionCount={questions.length}
        warningMessage={warningMessage}
        onStart={() => dispatch({ type: 'START' })}
      />
    );
  }

  if (state.screen === 'results') {
    return (
      <Results
        title={title}
        results={calculateQuizResults(questions, state.answers)}
        onRestart={() => dispatch({ type: 'RESTART' })}
      />
    );
  }

  const score = calculateScore(questions, state.answers);
  const currentQuestion = questions[state.currentQuestionIndex];
  const submittedAnswer = state.answers[state.currentQuestionIndex];
  const isSubmitted = submittedAnswer !== null;
  const isLastQuestion =
    state.currentQuestionIndex === questions.length - 1;
  const feedback = isSubmitted
    ? getAnswerFeedback(currentQuestion, submittedAnswer)
    : null;

  return (
    <section className="quiz-session" aria-labelledby="quiz-session-title">
      <header className="quiz-session-header">
        <span className="badge">{title}</span>
        <h1 className="quiz-session-title" id="quiz-session-title">
          Quiz
        </h1>
      </header>

      {warningMessage && (
        <StatusMessage variant="warning">{warningMessage}</StatusMessage>
      )}

      <p className="quiz-score" aria-live="polite">
        Current score: <strong>{score}</strong> / {questions.length}
      </p>

      <ProgressBar
        currentQuestion={state.currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />

      <QuestionCard question={currentQuestion.question} />

      <AnswerOptions
        questionId={currentQuestion.id}
        options={currentQuestion.options}
        selectedOptionIndex={state.selectedOptionIndex}
        correctOptionIndex={
          isSubmitted ? currentQuestion.answerIndex : null
        }
        disabled={isSubmitted}
        onSelect={(optionIndex) =>
          dispatch({ type: 'SELECT_OPTION', optionIndex })
        }
      />

      {state.validationMessage && (
        <StatusMessage variant="error">
          {state.validationMessage}
        </StatusMessage>
      )}

      {isSubmitted && (
        <p
          className={`answer-feedback ${
            feedback.isCorrect
              ? 'answer-feedback-correct'
              : 'answer-feedback-incorrect'
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      )}

      <div className="quiz-actions">
        {!isSubmitted ? (
          <button
            className="start-button"
            type="button"
            onClick={() => dispatch({ type: 'SUBMIT' })}
          >
            Submit Answer
          </button>
        ) : (
          <button
            className="start-button"
            type="button"
            onClick={() =>
              dispatch({
                type: isLastQuestion ? 'VIEW_RESULTS' : 'NEXT',
              })
            }
          >
            {isLastQuestion ? 'View Results' : 'Next Question'}
          </button>
        )}
        <button
          className="restart-button"
          type="button"
          onClick={() => dispatch({ type: 'RESTART' })}
        >
          Restart Quiz
        </button>
      </div>
    </section>
  );
}

export default Quiz;
