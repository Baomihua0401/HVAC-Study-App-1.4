// ✅ app.js 完整代码：支持多题库选择

document.addEventListener("DOMContentLoaded", function () {
    const quizSelect = document.getElementById("quiz-select");
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");
    const reviewButton = document.getElementById("review-btn");
    const progressList = document.getElementById("progress-list");

    let allQuestions = {};

    function updateProgressDisplay(questions, completedChapters) {
        progressList.innerHTML = "";
        const totalChapters = Math.max(...questions.map(q => q.chapter));

        for (let i = 1; i <= totalChapters; i++) {
            const item = document.createElement("li");
            const completed = completedChapters.includes(i);
            item.textContent = `章节 ${i} - ${completed ? "✅ 已完成" : "⚪ 未开始"}`;
            progressList.appendChild(item);
        }
    }

    // 加载所有题库
    Promise.all([
        fetch("questions-law.json").then(res => res.json()),
        fetch("questions-skill.json").then(res => res.json())
    ]).then(([law, skill]) => {
        allQuestions = { law, skill };
        console.log("📘 所有题库加载成功:", allQuestions);
        onQuizChange();
    });

    function onQuizChange() {
        const quiz = quizSelect.value;
        const questions = allQuestions[quiz] || [];

        chapterSelect.innerHTML = "";
        const totalChapters = Math.max(...questions.map(q => q.chapter));
        for (let i = 1; i <= totalChapters; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Chapter ${i}`;
            chapterSelect.appendChild(option);
        }

        const completedChapters = JSON.parse(localStorage.getItem(`completedChapters_${quiz}`)) || [];
        updateProgressDisplay(questions, completedChapters);
    }

    quizSelect.addEventListener("change", onQuizChange);

    startButton.addEventListener("click", () => {
        const quiz = quizSelect.value;
        const chapter = parseInt(chapterSelect.value);
        const questions = allQuestions[quiz]?.filter(q => q.chapter === chapter);

        if (!questions || questions.length === 0) {
            alert("⚠️ 当前章节没有题目");
            return;
        }

        localStorage.setItem("currentQuestions", JSON.stringify(questions));
        localStorage.setItem("currentQuiz", quiz);
        localStorage.setItem("currentQuestionIndex", "0");
        window.location.href = "quiz.html";
    });

    reviewButton.addEventListener("click", () => {
        const quiz = quizSelect.value;
        const mistakes = JSON.parse(localStorage.getItem(`mistakes_${quiz}`)) || [];

        if (mistakes.length === 0) {
            alert("暂无错题！");
            return;
        }

        localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
        localStorage.setItem("currentQuiz", quiz);
        localStorage.setItem("fromMistake", "true");
        window.location.href = "quiz.html";
    });
});
