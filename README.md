# GradePilot

GradePilot is a privacy-friendly GPA forecasting web application for college
students. It combines completed course history with current semester assumptions
to calculate GPA, quality points, graded credits, and what-if outcomes without a
login or database in the first version.

## Features

- Landing page with a direct path into the GPA workspace
- Dashboard summary cards for completed GPA, current projected GPA, projected
  cumulative GPA, and total graded credits
- Manual entry tables for completed and current semester courses
- Automatic grade point and quality point calculations
- Percentage-to-letter estimation for current courses
- Browser-local PDF transcript upload for selectable-text transcripts
- Browser-local persistence with localStorage
- Save and clear controls for browser-local course data
- What-if grade scenarios that update instantly
- Editable percentage grade scale panel
- GPA trend summaries grouped by completed semester
- Validation for credits, grades, and percentage ranges

## GPA Rules

GradePilot uses:

```text
GPA = total quality points / total graded credits
Quality points = credit hours * grade point value
```

The default GPA scale is:

| Grade | Points |
| --- | ---: |
| A+ | 4.33 |
| A | 4.00 |
| A- | 3.67 |
| B+ | 3.33 |
| B | 3.00 |
| B- | 2.67 |
| C+ | 2.33 |
| C | 2.00 |
| D | 1.00 |
| E/F | 0.00 |

Non-GPA grades `W`, `P`, `X`, `Y`, and `I` are excluded from GPA totals.
Displayed cumulative GPA values are capped at `4.00`, while advanced result
details show the raw calculated GPA.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- PDF.js
- Browser localStorage

## Folder Structure

```text
GradePilot/
|-- public/
|   `-- hero-gradepilot.png
|-- src/
|   |-- components/
|   |-- data/
|   |-- lib/
|   |-- pages/
|   |-- App.tsx
|   |-- index.css
|   |-- main.tsx
|   `-- types.ts
|-- index.html
|-- package.json
|-- README.md
`-- vite.config.ts
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Transcript PDF Notes

GradePilot reads transcript PDFs locally in the browser and imports course rows
when it can identify course codes, terms, credit hours, and grades from the PDF
text. Review imported rows before relying on a forecast.

Scanned PDFs do not expose selectable text, and transcript layouts vary by
school. Those cases can still be entered manually in the first version.

## Future Improvements

- OCR for scanned transcript PDFs
- Login system
- Cloud sync
- Degree progress tracking
- Graduation GPA target calculator
- Course planning across future semesters
- University-specific GPA rules
