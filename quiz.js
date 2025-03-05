document.addEventListener("DOMContentLoaded", function () {
    console.log("Quiz.js loaded!");

    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const explanationText = document.getElementById("explanation");
    const languageSwitch = document.getElementById("language-switch");
    const progressText = document.getElementById("progress");
    const accuracyText = document.getElementById("accuracy");

    if (!nextButton || !backButton || !questionText || !optionsContainer) {
        console.error("❌ Error: One or more DOM elements not found!");
        return;
    }

    let currentLanguage = localStorage.getItem("language") || "cn";
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    if (questions.length === 0) {
        alert("⚠️ 题库加载失败，请返回选择章节！");
        window.location.href = "index.html";
        return;
    }

    console.log("Loaded Questions:", questions);
    progressText.textContent = `0 / ${questions.length}`;

    function updateLanguageButton() {
        languageSwitch.textContent = (currentLanguage === "cn") ? "Switch to English" : "切换至中文";
    }

    languageSwitch.addEventListener("click", function () {
        currentLanguage = (currentLanguage === "cn") ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        updateLanguageButton();
        loadQuestion();
    });

    updateLanguageButton();

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            console.error("❌ No more questions available.");
            return;
        }

        let question = questions[currentQuestionIndex];
        if (!question) {
            console.error("❌ Invalid question data.");
            return;
        }
        
        questionText.textContent = (currentLanguage === "cn") ? question.question_cn : question.question_en;

        optionsContainer.innerHTML = "";
        question.options.forEach((option, index) => {
            let button = document.createElement("button");
            button.classList.add("option-btn");
            button.textContent = (currentLanguage === "cn") ? option.cn : option.en;
            button.addEventListener("click", function () {
                checkAnswer(index, question.correct);
            });
            optionsContainer.appendChild(button);
        });

        explanationText.textContent = (currentLanguage === "cn") ? question.explanation_cn : question.explanation_en;
        explanationText.classList.add("hidden");

        nextButton.classList.add("hidden");
    }

    function checkAnswer(selectedIndex, correctIndex) {
        let buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === correctIndex) {
                button.classList.add("correct");
            }
            if (index === selectedIndex && index !== correctIndex) {
                button.classList.add("wrong");
            }
        });

        if (selectedIndex === correctIndex) {
            correctAnswers++;
        }

        explanationText.classList.remove("hidden");
        nextButton.classList.remove("hidden");

        progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
        accuracyText.textContent = `${Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100)}%`;
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert(`🎉 章节完成！正确率: ${Math.round((correctAnswers / questions.length) * 100)}%`);
                    let chapterNumber = questions[0].chapter;
        let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];

        if (!completedChapters.includes(chapterNumber)) {
            completedChapters.push(chapterNumber);
        }

        localStorage.setItem("completedChapters", JSON.stringify(completedChapters));

        // **添加调试信息**
        console.log("✅ 已完成章节存入 localStorage:", completedChapters);
window.location.href = "index.html";
        }
    });

    backButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    loadQuestion();
});
