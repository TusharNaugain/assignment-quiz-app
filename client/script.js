const BASE_URL = "http://localhost:8000";

async function fetchQuestions() {
  try {
    const response = await fetch(`${BASE_URL}/quiz`);
    const data = await response.json();
    displayQuestions(data);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function displayQuestions(questions) {
  const quizDiv = document.getElementById("quiz");
  let html = "";

  questions.forEach((question, index) => {
    html += `<div class="question">
                        <strong>${index + 1}. ${
      question.question
    }</strong><br>`;
    question.options.forEach((option, i) => {
      html += `<div class="option">
                            <input type="radio" name="q${index}" value="${option}" id="q${index}_${i}">
                            <label for="q${index}_${i}">${option}</label>
                         </div>`;
    });
    html += "</div>";
  });

  quizDiv.innerHTML = html;
}

async function submitAnswers() {
  const answers = [];
  const quizDiv = document.getElementById("quiz");

  quizDiv.querySelectorAll('input[type="radio"]:checked').forEach((input) => {
    answers.push(input.value);
  });

  try {
    const response = await fetch(`${BASE_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });
    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error("Error submitting answers:", error);
  }
}

function displayResult(result) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<h2>Your Score: ${result.score}/${result.feedback.length}</h2>`;
  result.feedback.forEach((feedback) => {
    const message = feedback.correct
      ? "Correct!"
      : `Incorrect. Correct answer: ${feedback.correctAnswer}`;
    resultDiv.innerHTML += `<p><strong>Question:</strong> ${feedback.question}</p>
                                    <p><strong>Your Answer:</strong> ${feedback.answer}</p>
                                    <p><strong>Result:</strong> ${message}</p>`;
  });
}

document.getElementById("submitBtn").addEventListener("click", submitAnswers);

fetchQuestions();
