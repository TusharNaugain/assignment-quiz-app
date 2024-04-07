const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const cors = require("cors");
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

async function readQuestions() {
  try {
    const data = await fs.readFile("questions.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Failed to read questions.");
  }
}

app.get("/quiz", async (req, res, next) => {
  try {
    const data = await readQuestions();
    res.json(data.questions);
  } catch (error) {
    next(error);
  }
});

app.post("/submit", async (req, res, next) => {
  try {
    const data = await readQuestions();
    const userAnswers = req.body.answers;

    let score = 0;
    const feedback = [];

    data.questions.forEach((question, index) => {
      const correctAnswer = question.options[data.answers[index]];
      const isCorrect = correctAnswer === userAnswers[index];
      feedback.push({
        question: question.question,
        answer: userAnswers[index] || "No Attempt",
        correct: isCorrect,
        correctAnswer,
      });
      if (isCorrect) score++;
    });

    res.json({ score, feedback });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
