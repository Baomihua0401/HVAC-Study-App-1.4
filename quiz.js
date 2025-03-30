// ✅ app.js
// 多题库 + 多章节，错题/完成度记录隔离

document.addEventListener("DOMContentLoaded", function () {
    const bankSelect = document.getElementById("bank-select");
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");
    const reviewButton = document.getElementById("review-btn");
    const progressList = document.getElementById("progress-list");

    let questionsByBank = {}; // 保存所有题库数据

    // 加载多个题库文件
    const banks = ["Law", "Skill"];
    let loadCount = 0;

    banks.forEach(bank => {
        fetch(`questions_${bank}.json`)
            .then(res => res.json())
            .then(data => {
                questionsByBank[bank] = data;
                loadCount++;
                if (loadCount === banks.length) {
                    initUI();
                }
            });
    });

    function initUI() {
        bankSelect.innerHTML = banks.map(bank => `<option value="${bank}">${bank}</option>`).join("");
        updateChapterOptions();
        updateProgress();
    }

    function updateChapterOptions() {
        const selectedBank = bankSelect.value;
        const questions = questionsByBank[selectedBank];
        const chapters = [...new Set(questions.map(q => q.chapter))].sort((a, b) => a - b);

        chapterSelect.innerHTML = chapters.map(ch => `<option value="${ch}">Chapter ${ch}</option>`).join("");
    }

    function updateProgress() {
        const selectedBank = bankSelect.value;
        const completed = JSON.parse(localStorage.getItem(`completedChapters_${selectedBank}`)) || [];
        const questions = questionsByBank[selectedBank];
        const chapters = [...new Set(questions.map(q => q.chapter))].sort((a, b) => a - b);

        progressList.innerHTML = chapters.map(ch => `<li>章节 ${ch} - ${completed.includes(ch) ? "✅ 已完成" : "⚪ 未开始"}</li>`).join("");
    }

    bankSelect.addEventListener("change", () => {
        updateChapterOptions();
        updateProgress();
    });

    startButton.addEventListener("click", () => {
        const bank = bankSelect.value;
        const chapter = parseInt(chapterSelect.value);

        const filtered = questionsByBank[bank].filter(q => q.chapter === chapter);
        if (filtered.length === 0) {
            alert("⚠️ 本章节无题目");
            return;
        }
        localStorage.setItem("currentQuestions", JSON.stringify(filtered));
        localStorage.setItem("currentBank", bank);
        window.location.href = "quiz.html";
    });

    reviewButton.addEventListener("click", () => {
        const bank = bankSelect.value;
        const mistakes = JSON.parse(localStorage.getItem(`mistakes_${bank}`)) || [];
        if (mistakes.length === 0) {
            alert("暂无错题！");
            return;
        }
        localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
        localStorage.setItem("currentBank", bank);
        window.location.href = "quiz.html";
    });
});
