const questions = [
    {
        question: "What is the primary factor to consider in HVAC load calculations?",
        options: ["Building square footage", "Outdoor temperature", "Heat gain and loss", "Equipment cost"],
        correct: 2
    },
    {
        question: "Which refrigerant is commonly used in residential HVAC systems?",
        options: ["R-22", "R-134a", "R-410A", "Ammonia"],
        correct: 2
    }
];

let currentQuestion = 0;
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");

function loadQuestion() {
    const q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = "";
    q.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsElement.appendChild(button);
    });
}

function checkAnswer(selected) {
    const correct = questions[currentQuestion].correct;
    alert(selected === correct ? "Correct!" : "Wrong answer!");
    currentQuestion = (currentQuestion + 1) % questions.length;
    loadQuestion();
}

nextButton.onclick = loadQuestion;
loadQuestion();
