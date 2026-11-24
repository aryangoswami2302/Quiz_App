# Quiz Application

A client-side quiz application built with React and Vite. It loads a JavaScript
question set from JSON, validates the data, runs a one-question-at-a-time quiz,
tracks the score, and presents a pass/fail results screen.

## Technologies used

- React and React DOM
- Vite
- JavaScript (ES modules)
- Vitest
- Custom CSS

## Features

- Loads question data from `public/questions.json`.
- Validates and supports 1–50 valid questions with 2–6 options each.
- Skips malformed entries with a warning and displays clear data-load errors.
- Provides welcome, question, feedback, score, results, and restart states.
- Requires an answer before submission and locks it after feedback.
- Calculates results and applies the 60% PASS threshold.
- Includes responsive layouts, keyboard-operable radios/buttons, visible focus,
  and reduced-motion support.

## Create the project from scratch

Run these commands in a terminal:

```sh
npm create vite@latest quiz-application -- --template react
cd quiz-application
npm install
npm install -D vitest
npm run dev
```

The Vite React template supplies React, React DOM, and the React plugin. Vitest runs the business-logic tests in Node.

Add the test scripts to `package.json`:

```sh
npm pkg set "scripts.test=vitest run" "scripts.test:watch=vitest --watch"
```

Configure `vite.config.js` to use the React plugin and Vitest's Node
environment, including only test files under `tests/`.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest --watch"
  }
}
```

For this already-created workspace, run `npm install` from the project directory instead of creating a nested Vite project.

## Project structure

```text
quiz-application/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
├── .gitignore
├── public/
│   └── questions.json
├── tests/
│   ├── questionValidation.test.js
│   ├── quizReducer.test.js
│   └── scoring.test.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── AnswerOptions.jsx
    │   ├── ProgressBar.jsx
    │   ├── QuestionCard.jsx
    │   ├── Quiz.jsx
    │   ├── Results.jsx
    │   ├── StatusMessage.jsx
    │   └── WelcomeScreen.jsx
    ├── styles/
    │   └── style.css
    └── utils/
        ├── quizReducer.js
        ├── scoring.js
        └── questionValidation.js
```

- `public/questions.json` is fetched at runtime and contains the question set.
- `src/App.jsx` loads validated question data and displays loading and error
  states.
- `src/components/Quiz.jsx` owns the quiz reducer and central quiz state.
- `src/components/WelcomeScreen.jsx` renders the welcome screen and Start Quiz
  button.
- `src/components/QuestionCard.jsx`, `AnswerOptions.jsx`, and `ProgressBar.jsx`
  render the current question, radio choices, and question progress.
- `src/components/Results.jsx` displays the final score, answer counts,
  percentage, and pass/fail outcome.
- `src/components/StatusMessage.jsx` presents accessible loading, warning, and
  error messages.
- `src/main.jsx` mounts the React application and imports the stylesheet.
- `src/styles/style.css` contains desktop, tablet, and mobile styles, visible
  keyboard focus indicators, and reduced-motion support.
- `src/components/` is reserved for reusable UI components.
- `src/utils/questionValidation.js` parses and validates question data.
- `src/utils/quizReducer.js` handles quiz start, answer selection/submission,
  question navigation, results, and attempt resets for restart.
- `src/utils/scoring.js` contains answer comparison, feedback, and score
  calculation functions used by the quiz UI.
- `tests/` contains Vitest business-logic tests, separate from UI components.
- `vite.config.js` configures the React plugin and Vitest’s Node environment.

## Responsive design and accessibility

The quiz uses responsive desktop/tablet/mobile layouts, semantic headings and
sections, labeled native radio inputs, keyboard-operable controls, visible
focus indicators, and large touch targets. Motion effects are reduced when
the system's reduced-motion preference is enabled.

## JSON question format

`public/questions.json` has a title and a `questions` array. Each question
requires a unique positive integer `id`, non-empty `question` text, 2–6
non-empty string `options`, and an integer `answerIndex` within the options
array. `answerIndex` is zero-based.

```json
{
  "title": "JavaScript Basics",
  "questions": [
    {
      "id": 1,
      "question": "Which keyword declares a constant in JavaScript?",
      "options": ["var", "let", "const", "static"],
      "answerIndex": 2
    }
  ]
}
```

The application supports 1–50 valid questions.

## Edge-case decisions

- Malformed individual questions (including missing options or invalid
  `answerIndex`) are skipped. If valid questions remain, the app reports how
  many were skipped.
- If no valid questions remain, or the file is missing, empty, invalid JSON,
  lacks a questions array, or has an empty questions array, the app shows a
  clear error instead of a blank screen.
- More than 50 valid questions is rejected with a maximum-count error.
- Submitting without a selected answer is blocked. A submitted answer is
  locked, and duplicate submissions do not score.
- Restart creates a new in-memory attempt and returns to the welcome screen;
  no browser reload or persistence is used.
- An empty result set calculates as 0%/FAIL to avoid division by zero, but the
  app does not start a quiz unless valid questions were loaded.

## Install and run

From the project directory:

```sh
npm install
npm run dev
```

For a clean install from the committed lockfile, use `npm ci` instead of
`npm install`.

Vite prints a local URL (typically `http://localhost:5173/`). Open it in a
browser to see the loaded JavaScript questions. Stop the development server
with `Ctrl+C`.

## Verify JSON loading and validation

Run the automated checks:

```sh
npm test
npm run test:watch
npm run build
```

`npm test` runs the business-logic suite once. `npm run test:watch` reruns it
when files change; press `q` to exit watch mode.

The expected successful `npm test` summary is:

```text
Test Files  3 passed (3)
     Tests  24 passed (24)
```

`tests/questionValidation.test.js` checks valid input, empty/invalid JSON,
missing/empty question arrays, malformed entries, invalid indexes, option
bounds, and the 50-question limit. `tests/quizReducer.test.js` checks
1/8/10/50-question navigation, submit guards, duplicate submissions, and
restart resets. `tests/scoring.test.js` checks answer comparison, feedback,
score calculation, pass thresholds, one-question results, and empty results.

To verify the data in the browser, run `npm run dev`, open the printed URL, and
confirm the welcome screen shows “JavaScript Basics” and reports eight valid
questions from `public/questions.json`. Click **Start Quiz** to begin the
single-question-at-a-time quiz.

## Results and passing score

The results screen shows the final score, total/correct/incorrect counts, and
percentage. Percentage is calculated as `(correctAnswers / totalQuestions) *
100`; a score of 60% or higher passes. Empty result data safely produces 0%
and a fail state, though the application does not start a quiz without valid
questions.

To see the malformed-question warning, temporarily add an invalid question
(for example, one without an `options` array) to the JSON file and reload. The
valid questions remain visible and the page reports how many entries it
skipped. To verify the error state, temporarily empty or invalidate the JSON
file and reload. Restore the original file after these manual checks. Automated
tests cover valid loading, skipping malformed questions, missing and empty
files, invalid JSON, missing or empty question arrays, invalid answer indexes,
option limits, and the 50-question maximum. Quiz navigation tests cover 1, 8,
10, and 50 questions. Scoring tests cover correct, incorrect, unanswered, and
duplicate submissions. Results tests cover 6/10 (60%, PASS), 5/10 (50%,
FAIL), 8/10 (80%, PASS), and one-question outcomes.

## Manually verify quiz navigation

1. Start the app with `npm run dev`, open its local URL, and click **Start Quiz**.
2. Select one radio option and submit it. Confirm feedback appears and the
   selected option is locked. Correct answers add one point; incorrect answers
   show the correct option without increasing the score.
3. Use **Next Question** and confirm the progress label and question update.
   The final question uses **View Results** and displays the score.
4. On completion, review the final score, percentage, correct/incorrect counts,
   and PASS/FAIL message. For a one-question check, temporarily leave one valid item in
   `public/questions.json`; after submitting, **View Results** should appear
   immediately. For 10- and 50-question checks, prepare that many valid entries
   with unique IDs. Restore the original JSON after testing.

## Restart and edge-case verification

- During an active quiz, select or submit an answer and click **Restart Quiz**.
  The welcome screen should return without a page reload. Start again and
  confirm the first question, empty selection, and score of zero.
- Finish a quiz, click **Restart Quiz** on the results screen, and confirm the
  welcome screen returns.
- Submit without selecting an answer and confirm the validation message. After
  submitting once, confirm the answer is locked and cannot be submitted again.
- The automated tests cover a missing JSON file, invalid JSON, an empty
  questions array, malformed entries and invalid answer indexes, no selection,
  duplicate submissions, and 1-, 8-, 10-, and 50-question navigation.

## Stretch goals implemented

- Responsive desktop, tablet, and mobile layouts.
- Keyboard-accessible controls, visible focus, and reduced-motion support.
- Restart without a page reload and useful handling of malformed data.

## Limitations

- The application has one local question set and no backend, accounts, or
  persisted attempt history.
- Answers are delivered to the browser in `public/questions.json`; this is not
  suitable for a high-stakes or secure assessment.
- Inter is loaded from Google Fonts when online; the CSS system-font stack is
  used as a fallback.

## What could be improved with more time

- Add question-set selection and authoring backed by an API.
- Add browser-level accessibility tests and a continuous-integration workflow.
- Add localization and optional saved progress.
- Move answer verification server-side if used for secure assessments.

## Submission preparation

- Run `npm ci`, `npm test`, and `npm run build` before packaging.
- Include the source, tests, `public/questions.json`, README, and package files
  in a GitHub repository or ZIP. The `.gitignore` excludes `node_modules/`,
  `dist/`, Vite cache, and local environment files.
- Do not include `node_modules/` in a ZIP; the recipient can run `npm ci`.
- Publishing, pushing, or submitting the project must be done by you.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the tests once |
| `npm run test:watch` | Run Vitest in watch mode |

Run `npm run build` before `npm run preview` to generate the production files.
