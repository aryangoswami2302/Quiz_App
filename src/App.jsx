import { useEffect, useState } from 'react';
import Quiz from './components/Quiz.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import { parseQuestionData } from './utils/questionValidation.js';

function App() {
  const [result, setResult] = useState({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuestions() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}questions.json`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load public/questions.json (HTTP ${response.status}).`
          );
        }

        const content = await response.text();
        const data = parseQuestionData(content);
        setResult({ status: 'success', data });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred while loading the questions.',
        });
      }
    }

    loadQuestions();

    return () => controller.abort();
  }, []);

  const warningMessage =
    result.status === 'success' && result.data.skippedCount > 0
      ? `Skipped ${result.data.skippedCount} malformed question${
          result.data.skippedCount === 1 ? '' : 's'
        }. Invalid entries are excluded from this quiz.`
      : null;

  return (
    <main className="app-container">
      <section className="setup-card" aria-label="Quiz application">
        {result.status !== 'success' && (
          <>
            <h1 className="title" id="app-title">
              Quiz Application
            </h1>
            {result.status === 'loading' && (
              <StatusMessage variant="info">
                Loading quiz questions...
              </StatusMessage>
            )}
            {result.status === 'error' && (
              <>
                <h2 className="quiz-title">
                  Quiz questions could not be loaded
                </h2>
                <StatusMessage variant="error">{result.message}</StatusMessage>
              </>
            )}
          </>
        )}

        {result.status === 'success' && (
          <Quiz
            title={result.data.title}
            questions={result.data.questions}
            warningMessage={warningMessage}
          />
        )}
      </section>
    </main>
  );
}

export default App;
