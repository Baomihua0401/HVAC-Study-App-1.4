// app.js - 仅支持法律题库，按章节选择

let questions = [];
let currentQuestionIndex = 0;
let selectedChapter = 1;

// 页面加载时获取 JSON 题库
fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    questions = data.filter(q => q.category === "法律题库"); // 仅加载法律题库
    populateChapterOptions();
  })
  .catch((error) => console.error("Error loading questions:", error));

// 填充章节选项
function populateChapterOptions() {
  const chapterSelect = document.getElementById("chapter-select");
  chapterSelect.innerHTML = "";
  
  const chapters = [...new Set(questions.map(q => q.chapter))];
  
  chapters.forEach((chapter) => {
    let option = document.createElement("option");
    option.value = chapter;
    option.textContent = `第 ${chapter} 章`;
    chapterSelect.appendChild(option);
  });
}

// 开始答题
function startQuiz() {
  selectedChapter = parseInt(document.getElementById("chapter-select").value);
  currentQuestionIndex = 0;
  const filteredQuestions = questions.filter(q => q.chapter === selectedChapter);
  questions = filteredQuestions;
  displayQuestion();
}

// 显示题目
function displayQuestion() {
  if (currentQuestionIndex >= questions.length) {
    document.getElementById("quiz-container").innerHTML = "<h3>所有问题已完成！</h3>";
    return;
  }
  
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = question.question_en;
  
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  
  question.options.forEach((option, index) => {
    let button = document.createElement("button");
    button.textContent = option.en;
    button.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(button);
  });
}

// 检查答案
function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestionIndex].correct;
  if (selectedIndex === correctIndex) {
    alert("Correct!");
  } else {
    alert("Wrong! Correct answer: " + questions[currentQuestionIndex].options[correctIndex].en);
  }
  currentQuestionIndex++;
  displayQuestion();
}
