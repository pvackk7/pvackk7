const questions = [
  {
    subject:"Reading & Writing", skill:"Information and Ideas",
    passage:"In an experiment, researchers compared temperatures on sidewalks shaded by mature trees with those shaded by recently planted trees. The mature trees reduced midday temperatures more, but the researchers noted that the difference could shrink as the younger trees developed fuller canopies.",
    prompt:"Which conclusion is best supported by the passage?",
    choices:[
      "Newly planted trees will eventually provide more shade than mature trees.",
      "Mature trees currently provide more cooling, though younger trees may become more effective.",
      "Sidewalk temperature depends entirely on the age of nearby trees.",
      "Newly planted trees have no measurable effect on sidewalk temperature."
    ],
    correct:1,
    explanation:"The experiment found a present advantage for mature trees, but the researchers left open the possibility that younger trees could catch up as they grow."
  },
  {
    subject:"Reading & Writing", skill:"Words in Context",
    passage:"When the museum first received the collection, its catalog was provisional: staff revised the descriptions repeatedly as additional letters and photographs came to light.",
    prompt:"As used in the text, what does “provisional” most nearly mean?",
    choices:["Tentative", "Exhaustive", "Controversial", "Decorative"],
    correct:0,
    explanation:"The catalog was subject to revision as more evidence appeared, so its initial descriptions were tentative rather than final."
  },
  {
    subject:"Math", skill:"Percentages",
    passage:null,
    prompt:"A ticket costs $50. Its price increases by 20% and then decreases by 20% of the new price. What is the final price, in dollars?",
    choices:["40", "48", "50", "52"],
    correct:1,
    explanation:"After the increase, the price is $60. Decreasing $60 by 20% gives $60 − $12 = $48. A 20% rise and fall don't cancel because the base changes."
  },
  {
    subject:"Math", skill:"Algebra",
    passage:null,
    prompt:"For the function g(x) = 3(x − 2) + 7, what value of x satisfies g(x) = 25?",
    choices:["6", "7", "8", "10"],
    correct:2,
    explanation:"Set 3(x − 2) + 7 = 25. Then 3(x − 2) = 18, so x − 2 = 6 and x = 8."
  }
];

const area = document.getElementById("question-area");
const number = document.getElementById("question-number");
const xp = document.getElementById("beta-xp");
const level = document.getElementById("beta-level");
const progress = document.getElementById("beta-progress-fill");
let index = 0;
let correct = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
}

function renderQuestion() {
  const question = questions[index];
  number.textContent = String(index + 1).padStart(2,"0") + " / " + String(questions.length).padStart(2,"0");
  area.innerHTML = '<div class="quiz-skill">' + escapeHTML(question.subject) + ' · ' + escapeHTML(question.skill) + '</div>' +
    (question.passage ? '<p class="quiz-passage">' + escapeHTML(question.passage) + '</p>' : '') +
    '<h2>' + escapeHTML(question.prompt) + '</h2>' +
    '<div class="quiz-choices">' + question.choices.map((choice, i) => '<button class="quiz-choice" type="button" data-choice="' + i + '"><span class="quiz-letter">' + "ABCD"[i] + '</span><span>' + escapeHTML(choice) + '</span></button>').join('') + '</div>' +
    '<div class="quiz-feedback" id="quiz-feedback" role="status" hidden></div>' +
    '<button class="beta-primary quiz-next" id="quiz-next" type="button" hidden>' + (index === questions.length - 1 ? "See results" : "Next question") + '<span aria-hidden="true">→</span></button>';

  area.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
      const selected = Number(button.dataset.choice);
      const isCorrect = selected === question.correct;
      correct += Number(isCorrect);
      area.querySelectorAll("[data-choice]").forEach(option => {
        option.disabled = true;
        if (Number(option.dataset.choice) === question.correct) option.classList.add("correct");
        if (Number(option.dataset.choice) === selected && !isCorrect) option.classList.add("incorrect");
      });
      const feedback = document.getElementById("quiz-feedback");
      feedback.hidden = false;
      feedback.innerHTML = '<strong>' + (isCorrect ? 'Correct! +10 XP' : 'Good attempt.') + '</strong><p>' + escapeHTML(question.explanation) + '</p>';
      if (isCorrect) {
        xp.textContent = correct * 10 + " XP";
        document.getElementById(["flower-one","flower-two","flower-three","flower-four"][correct-1]).classList.add("grown");
      }
      level.textContent = correct >= 3 ? "LVL 02" : "LVL 01";
      progress.style.width = Math.round((index + 1) / questions.length * 100) + "%";
      document.getElementById("quiz-next").hidden = false;
    });
  });
  document.getElementById("quiz-next").addEventListener("click", () => {
    index++;
    if (index === questions.length) return finish();
    renderQuestion();
  });
}

function finish() {
  number.textContent = "COMPLETE";
  area.innerHTML = '<div class="quiz-skill">CHALLENGE COMPLETE</div><h2>Your world just grew.</h2><p class="quiz-complete">You got <strong>' + correct + ' of ' + questions.length + '</strong> right and earned <strong>' + correct * 10 + ' XP</strong>.</p><p>Imagine doing this across dozens of skills, a whole garden and your SAT score progress.</p><button class="beta-primary" id="restart" type="button">Play again <span aria-hidden="true">↻</span></button><a class="beta-invite" href="./">Back to SolveTheory ↗</a>';
  document.getElementById("restart").addEventListener("click", () => {
    index = 0;
    correct = 0;
    xp.textContent = "0 XP";
    level.textContent = "LVL 01";
    progress.style.width = "0%";
    document.querySelectorAll(".beta-flower").forEach(el => el.classList.remove("grown"));
    renderQuestion();
  });
}

document.getElementById("start-preview")?.addEventListener("click", renderQuestion);
