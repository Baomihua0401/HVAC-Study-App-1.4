document.addEventListener("DOMContentLoaded", function () {
    const bankSelect = document.getElementById("bank-select");
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");
    const reviewMistakesButton = document.getElementById("review-btn");
    const progressList = document.getElementById("progress-list");

    let questions = [];
    let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || {};

    function loadQuestions() {
        const bank = bankSelect.value;
        let file = "";
        if (bank === "law") file = "questions_law.json";
        if (bank === "skill") file = "questions_skill.json";

        fetch(file)
            .then(response => response.json())
            .then(data => {
                questions = data;
                const totalChapters = Math.max(...questions.map(q => q.chapter));

                chapterSelect.innerHTML = "";
                for (let i = 1; i <= totalChapters; i++) {
                    const option = document.createElement("option");
                    option.value = i;
                    option.textContent = `Chapter ${i}`;
                    chapterSelect.appendChild(option);
                }

                renderProgress();
            })
            .catch(error => {
                console.error("加载题库失败:", error);
                alert("❌ 无法加载题库，请稍后再试。");
            });
    }

    function renderProgress() {
        const bank = bankSelect.value;
        const bankProgress = completedChapters[bank] || [];
        const totalChapters = chapterSelect.options.length;

        progressList.innerHTML = "";
        for (let i = 1; i <= totalChapters; i++) {
            const li = document.createElement("li");
            li.textContent = `章节 ${i} - ${bankProgress.includes(i) ? "✅ 已完成" : "⚪ 未开始"}`;
            progressList.appendChild(li);
        }
    }

    startButton.addEventListener("click", () => {
        const bank = bankSelect.value;
        const chapter = parseInt(chapterSelect.value);
        if (!questions.length) {
            alert("❌ 题库尚未加载，请稍后再试！");
            return;
        }
        const chapterQuestions = questions.filter(q => q.chapter === chapter);
        if (chapterQuestions.length === 0) {
            alert(`⚠️ 章节 ${chapter} 暂无题目。`);
            return;
        }

        localStorage.setItem("currentQuestions", JSON.stringify(chapterQuestions));
        localStorage.setItem("currentQuestionIndex", "0");
        localStorage.setItem("currentBank", bank);
        window.location.href = "quiz.html";
    });

    reviewMistakesButton.addEventListener("click", () => {
        const bank = bankSelect.value;
        const mistakes = JSON.parse(localStorage.getItem(`mistakes_${bank}`)) || [];
        if (mistakes.length === 0) {
            alert("暂无错题！");
            return;
        }
        localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
        localStorage.setItem("currentQuestionIndex", "0");
        localStorage.setItem("currentBank", bank);
        window.location.href = "quiz.html";
    });

    bankSelect.addEventListener("change", () => {
        loadQuestions();
    });

    loadQuestions();
});
