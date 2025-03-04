document.addEventListener("DOMContentLoaded", function () {
    let currentLanguage = localStorage.getItem("language") || "cn";
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];

    const languageSwitchBtn = document.getElementById("language-switch");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const explanationText = document.getElementById("explanation");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const progressText = document.getElementById("progress");
    const scoreText = document.getElementById("score");

    function updateProgress() {
        progressText.textContent = `进度: ${currentQuestionIndex + 1} / ${questions.length}`;
        let percentage = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
        scoreText.textContent = `正确率: ${percentage}%`;
    }

    function updateLanguageButton() {
        languageSwitchBtn.textContent = currentLanguage === "cn" ? "切换至英语" : "Switch to Chinese";
    }

    languageSwitchBtn.addEventListener("click", function () {
        currentLanguage = currentLanguage === "cn" ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        updateLanguageButton();
        loadQuestion();
    });

    backButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    function loadQuestion() {
        if (questions.length === 0) {
            alert("题库加载失败，请返回选择章节！");
            window.location.href = "index.html";
            return;
        }

        const question = questions[currentQuestionIndex];
        questionText.textContent = currentLanguage === "cn" ? question.question_cn : question.question_en;
        optionsContainer.innerHTML = "";
        explanationText.classList.add("hidden");
        nextButton.classList.add("hidden");

        question.options.forEach((option, index) => {
            const btn = document.createElement("button");
            btn.textContent = currentLanguage === "cn" ? option.cn : option.en;
            btn.classList.add("option-btn");
            btn.dataset.index = index;
            btn.addEventListener("click", () => checkAnswer(index));
            optionsContainer.appendChild(btn);
        });

        updateProgress();
        updateLanguageButton();
    }

    function checkAnswer(selectedIndex) {
        const question = questions[currentQuestionIndex];
        const correctIndex = question.correct;
        const optionButtons = document.querySelectorAll(".option-btn");

        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === correctIndex) {
                btn.style.backgroundColor = "green";
            } else if (index === selectedIndex) {
                btn.style.backgroundColor = "red";
            }
        });

        if (selectedIndex !== correctIndex) {
            let mistakes = JSON.parse(localStorage.getItem("mistakes")) || [];
            if (!mistakes.some(q => q.question_en === question.question_en)) {
                mistakes.push(question);
            }
            localStorage.setItem("mistakes", JSON.stringify(mistakes));
        } else {
            // 答对后从错题本移除
            let mistakes = JSON.parse(localStorage.getItem("mistakes")) || [];
            mistakes = mistakes.filter(q => q.question_en !== question.question_en);
            localStorage.setItem("mistakes", JSON.stringify(mistakes));
        }

        explanationText.textContent = currentLanguage === "cn" ? question.explanation_cn : question.explanation_en;
        explanationText.classList.remove("hidden");
        nextButton.classList.remove("hidden");
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert(`🎉 章节完成！正确率: ${Math.round((correctAnswers / questions.length) * 100)}%`);
            window.location.href = "index.html";
        }
    });

    loadQuestion();
});
