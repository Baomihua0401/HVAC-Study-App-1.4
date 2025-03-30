// quiz.js

// 支持多题库（Law 和 Skill）
// 根据 currentBank 分别维护 localStorage key 名称

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Quiz.js loaded!");

    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const explanationText = document.getElementById("explanation");
    const languageSwitch = document.getElementById("language-switch");
    const progressText = document.getElementById("progress");
    const accuracyText = document.getElementById("accuracy");

    const currentBank = localStorage.getItem("currentBank") || "law";
    let currentLanguage = localStorage.getItem("language") || "cn";

    const LS = (key) => `${currentBank}_${key}`;

    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    let questions = JSON.parse(localStorage.getItem(LS("currentQuestions"))) || [];
    if (questions.length === 0) {
        alert("⚠️ 题库加载失败，请返回选择章节！");
        window.location.href = "index.html";
        return;
    }

    let mistakes = JSON.parse(localStorage.getItem(LS("mistakes"))) || [];
    let completedChapters = JSON.parse(localStorage.getItem(LS("completedChapters"))) || [];
    let currentChapter = questions[0].chapter;

    if (completedChapters.includes(currentChapter)) {
        completedChapters = completedChapters.filter(ch => ch !== currentChapter);
        localStorage.setItem(LS("completedChapters"), JSON.stringify(completedChapters));
    }

    function updateLanguageButton() {
        languageSwitch.textContent = currentLanguage === "cn" ? "Switch to English" : "切换至中文";
    }

    languageSwitch.addEventListener("click", () => {
        currentLanguage = currentLanguage === "cn" ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        updateLanguageButton();
        loadQuestion();
    });

    updateLanguageButton();

    function loadQuestion() {
        const q = questions[currentQuestionIndex];
        questionText.textContent = currentLanguage === "cn" ? q.question_cn : q.question_en;

        optionsContainer.innerHTML = "";
        q.options.forEach((opt, i) => {
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.textContent = currentLanguage === "cn" ? opt.cn : opt.en;
            btn.addEventListener("click", () => checkAnswer(i, q.correct));
            optionsContainer.appendChild(btn);
        });

        explanationText.classList.add("hidden");
        nextButton.classList.add("hidden");
    }

    function checkAnswer(selectedIndex, correctIndex) {
        const buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === correctIndex) btn.classList.add("correct");
            if (i === selectedIndex && i !== correctIndex) btn.classList.add("wrong");
        });

        const q = questions[currentQuestionIndex];

        if (selectedIndex === correctIndex) {
            correctAnswers++;
            mistakes = mistakes.filter(m => m.question_en !== q.question_en);
        } else {
            if (!mistakes.some(m => m.question_en === q.question_en)) {
                mistakes.push(q);
            }
        }

        localStorage.setItem(LS("mistakes"), JSON.stringify(mistakes));

        explanationText.textContent = currentLanguage === "cn" ? q.explanation_cn : q.explanation_en;
        explanationText.classList.remove("hidden");

        nextButton.classList.remove("hidden");

        progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
        accuracyText.textContent = `${Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100)}%`;
    }

    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert(`🎉 章节完成！正确率: ${Math.round((correctAnswers / questions.length) * 100)}%`);

            if (!completedChapters.includes(currentChapter) && mistakes.length === 0) {
                completedChapters.push(currentChapter);
                localStorage.setItem(LS("completedChapters"), JSON.stringify(completedChapters));
            }

            window.location.href = "index.html";
        }
    });

    backButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    progressText.textContent = `0 / ${questions.length}`;
    accuracyText.textContent = `0%`;

    loadQuestion();
});
