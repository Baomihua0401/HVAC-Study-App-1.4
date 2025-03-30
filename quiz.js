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

    let currentLanguage = localStorage.getItem("language") || "cn";
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    if (questions.length === 0) {
        alert("\u26a0\ufe0f \u9898\u5e93\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u8fd4\u56de\u9009\u62e9\u7ae0\u8282！");
        window.location.href = "index.html";
        return;
    }

    let mistakes = JSON.parse(localStorage.getItem("mistakes")) || [];
    let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];
    let currentChapter = questions[0].chapter;

    if (completedChapters.includes(currentChapter)) {
        completedChapters = completedChapters.filter(ch => ch !== currentChapter);
        localStorage.setItem("completedChapters", JSON.stringify(completedChapters));
    }

    function updateLanguageButton() {
        languageSwitch.textContent = (currentLanguage === "cn") ? "Switch to English" : "\u5207\u6362\u81f3\u4e2d\u6587";
    }

    languageSwitch.addEventListener("click", function () {
        currentLanguage = (currentLanguage === "cn") ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        updateLanguageButton();
        loadQuestion();
    });

    updateLanguageButton();

    function loadQuestion() {
        let question = questions[currentQuestionIndex];
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

        explanationText.classList.add("hidden");
        nextButton.classList.add("hidden");

        progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
        accuracyText.textContent = `${Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100)}%`;
    }

    function checkAnswer(selectedIndex, correctIndex) {
        let buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((button, index) => {
            button.disabled = true;
            if (index === correctIndex) button.classList.add("correct");
            if (index === selectedIndex && index !== correctIndex) button.classList.add("wrong");
        });

        if (selectedIndex === correctIndex) {
            correctAnswers++;
            mistakes = mistakes.filter(q => q.question_en !== questions[currentQuestionIndex].question_en);
        } else {
            if (!mistakes.some(q => q.question_en === questions[currentQuestionIndex].question_en)) {
                mistakes.push(questions[currentQuestionIndex]);
            }
        }

        localStorage.setItem("mistakes", JSON.stringify(mistakes));

        explanationText.textContent = (currentLanguage === "cn") ? questions[currentQuestionIndex].explanation_cn : questions[currentQuestionIndex].explanation_en;
        explanationText.classList.remove("hidden");
        nextButton.classList.remove("hidden");
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert(`\ud83c\udf89 \u7ae0\u8282\u5b8c\u6210\uff01\u6b63\u786e\u7387: ${Math.round((correctAnswers / questions.length) * 100)}%`);

            if (!completedChapters.includes(currentChapter) && mistakes.length === 0) {
                completedChapters.push(currentChapter);
                localStorage.setItem("completedChapters", JSON.stringify(completedChapters));
            }

            window.location.href = "index.html";
        }
    });

    backButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    loadQuestion();
});
