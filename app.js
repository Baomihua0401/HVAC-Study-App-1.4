// ✅ app.js

document.addEventListener("DOMContentLoaded", function () {
    const bankSelect = document.getElementById("bank-select");
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");
    const reviewMistakesButton = document.getElementById("review-mistakes-btn");
    const chapterProgressList = document.getElementById("progress-list");

    let questions = [];

    function loadQuestions() {
        const bank = bankSelect.value;
        const fileName = bank === "skill" ? "questions_skill.json" : "questions_law.json";

        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                questions = data;

                const totalChapters = Math.max(...questions.map(q => q.chapter));
                chapterSelect.innerHTML = "";
                chapterProgressList.innerHTML = "";

                const completedChapters = JSON.parse(localStorage.getItem(`completedChapters_${bank}`)) || [];

                for (let i = 1; i <= totalChapters; i++) {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = `Chapter ${i}`;
                    chapterSelect.appendChild(option);

                    const li = document.createElement("li");
                    li.textContent = `章节 ${i} - ${completedChapters.includes(i) ? "✅ 已完成" : "⚪ 未开始"}`;
                    chapterProgressList.appendChild(li);
                }
            })
            .catch(error => console.error("加载题库失败:", error));
    }

    bankSelect.addEventListener("change", loadQuestions);
    loadQuestions();

    startButton.addEventListener("click", function () {
        const selectedChapter = parseInt(chapterSelect.value);
        const bank = bankSelect.value;
        const chapterQuestions = questions.filter(q => q.chapter === selectedChapter);

        if (chapterQuestions.length === 0) {
            alert("该章节暂无题目");
            return;
        }

        localStorage.setItem("currentBank", bank);
        localStorage.setItem("currentQuestions", JSON.stringify(chapterQuestions));
        localStorage.setItem("currentQuestionIndex", "0");
        window.location.href = "quiz.html";
    });

    reviewMistakesButton.addEventListener("click", function () {
        const bank = bankSelect.value;
        const mistakes = JSON.parse(localStorage.getItem(`mistakes_${bank}`)) || [];

        if (mistakes.length === 0) {
            alert("暂无错题");
            return;
        }

        localStorage.setItem("currentBank", bank);
        localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
        localStorage.setItem("currentQuestionIndex", "0");
        window.location.href = "quiz.html";
    });
});
