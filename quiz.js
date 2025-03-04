console.log("Quiz.js loaded!"); // 确保 quiz.js 正确加载

document.addEventListener("DOMContentLoaded", function () {
    // 获取 DOM 元素
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const explanationText = document.getElementById("explanation");
    const languageSwitch = document.getElementById("language-switch");

    console.log("Next button:", nextButton);
    console.log("Back button:", backButton);

    if (!nextButton || !backButton || !questionText || !optionsContainer) {
        console.error("❌ Error: One or more DOM elements not found!");
        return;
    }

    let currentLanguage = localStorage.getItem("language") || "cn";
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    // 获取当前章节的题目
    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    if (questions.length === 0) {
        alert("⚠️ 题库加载失败，请返回选择章节！");
        window.location.href = "index.html";
        return;
    }
    console.log("Loaded Questions:", questions);

    // 语言切换功能
    function updateLanguageButton() {
        languageSwitch.textContent = (currentLanguage === "cn") ? "Switch to English" : "切换至中文";
    }

    languageSwitch.addEventListener("click", function () {
        currentLanguage = (currentLanguage === "cn") ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        updateLanguageButton();
        loadQuestion(); // 重新加载当前问题
    });

    updateLanguageButton(); // 初始化语言按钮

    // 加载问题
    function loadQuestion() {
        let question = questions[currentQuestionIndex];
        questionText.textContent = (currentLanguage === "cn") ? question.question_cn : question.question_en;

        // 清空选项
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

        // 隐藏解析和下一题按钮
        explanationText.classList.add("hidden");
        nextButton.classList.add("hidden");
    }

    // 检查答案
    function checkAnswer(selectedIndex, correctIndex) {
        let buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((button, index) => {
            button.disabled = true; // 禁用所有按钮
            if (index === correctIndex) {
                button.style.backgroundColor = "green"; // 正确答案变绿
            }
            if (index === selectedIndex && index !== correctIndex) {
                button.style.backgroundColor = "red"; // 错误答案变红
            }
        });

        if (selectedIndex === correctIndex) {
            correctAnswers++;
        }

        // 显示解析
        explanationText.textContent = (currentLanguage === "cn") ? questions[currentQuestionIndex].explanation_cn : questions[currentQuestionIndex].explanation_en;
        explanationText.classList.remove("hidden");

        // 显示下一题按钮
        nextButton.classList.remove("hidden");
    }

    // 监听 "下一题" 按钮
    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert(`🎉 章节完成！正确率: ${Math.round((correctAnswers / questions.length) * 100)}%`);

            // 记录完成的章节
            let chapterNumber = questions[0].chapter;
            let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];
            if (!completedChapters.includes(chapterNumber)) {
                completedChapters.push(chapterNumber);
            }
            localStorage.setItem("completedChapters", JSON.stringify(completedChapters));

            window.location.href = "index.html";
        }
    });

    // 监听 "返回章节选择" 按钮
    backButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    // 初始加载第一道题
    loadQuestion();
});
