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
        alert("⚠️ 题库加载失败，请返回选择章节！");
        window.location.href = "index.html";
        return;
    }

    let mistakes = JSON.parse(localStorage.getItem("mistakes")) || [];
    let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];

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
            // 如果错题列表中有这个题，并且做对了，就移除
            mistakes = mistakes.filter(q => q.question_en !== questions[currentQuestionIndex].question_en);
        } else {
            // 只有不在错题列表中的，才加入错题
            if (!mistakes.some(q => q.question_en === questions[currentQuestionIndex].question_en)) {
                mistakes.push(questions[currentQuestionIndex]);
            }
        }

        localStorage.setItem("mistakes", JSON.stringify(mistakes));

        explanationText.textContent = (currentLanguage === "cn") ? questions[currentQuestionIndex].explanation_cn : questions[currentQuestionIndex].explanation_en;
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

            // **✅ 只有所有题目都完成，才标记章节为已完成**
            if (!completedChapters.includes(chapterNumber)) {
                completedChapters.push(chapterNumber);
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
