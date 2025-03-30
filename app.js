// app.js

const lawFile = "questions_law.json";
const skillFile = "questions_skill.json";

let currentBank = "law";
let currentFile = lawFile;

const bankSelect = document.getElementById("bank-select");
const chapterSelect = document.getElementById("chapter-select");
const startButton = document.getElementById("start-btn");
const reviewButton = document.getElementById("review-btn");
const progressList = document.getElementById("progress-list");

let questions = [];

function loadQuestions() {
    fetch(currentFile)
        .then((res) => res.json())
        .then((data) => {
            questions = data;
            const totalChapters = Math.max(...questions.map((q) => q.chapter));

            chapterSelect.innerHTML = "";
            for (let i = 1; i <= totalChapters; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `Chapter ${i}`;
                chapterSelect.appendChild(option);
            }

            renderProgress(totalChapters);
        })
        .catch((err) => console.error("加载题库失败", err));
}

function renderProgress(totalChapters) {
    const completed = JSON.parse(localStorage.getItem(`${currentBank}_completedChapters`)) || [];
    progressList.innerHTML = "";
    for (let i = 1; i <= totalChapters; i++) {
        const li = document.createElement("li");
        li.textContent = `章节 ${i} - ${completed.includes(i) ? "✅ 已完成" : "⚪ 未开始"}`;
        progressList.appendChild(li);
    }
}

bankSelect.addEventListener("change", () => {
    currentBank = bankSelect.value;
    currentFile = currentBank === "law" ? lawFile : skillFile;
    loadQuestions();
});

startButton.addEventListener("click", () => {
    if (!questions.length) return alert("题库加载失败！");
    const chapter = parseInt(chapterSelect.value);
    const chapterQuestions = questions.filter((q) => q.chapter === chapter);
    if (chapterQuestions.length === 0) return alert("此章节暂无题目");

    localStorage.setItem("currentQuestions", JSON.stringify(chapterQuestions));
    localStorage.setItem("currentBank", currentBank);
    window.location.href = "quiz.html";
});

reviewButton.addEventListener("click", () => {
    const mistakes = JSON.parse(localStorage.getItem(`${currentBank}_mistakes`)) || [];
    if (mistakes.length === 0) return alert("暂无错题");
    localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
    localStorage.setItem("currentBank", currentBank);
    window.location.href = "quiz.html";
});

// Initial load
loadQuestions();
