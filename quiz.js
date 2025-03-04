// 确保 DOM 完全加载后才执行 JS
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded, executing quiz.js...");

    // 获取页面上的元素
    const languageSwitch = document.getElementById("language-switch");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const quizContainer = document.getElementById("quiz-container");

    // **调试：检查元素是否正确获取**
    console.log("🔍 Checking Elements:");
    console.log("languageSwitch:", languageSwitch);
    console.log("nextButton:", nextButton);
    console.log("backButton:", backButton);
    console.log("quizContainer:", quizContainer);

    // **防止 quizContainer 为空时报错**
    if (!quizContainer) {
        console.error("❌ Error: quiz-container not found! HTML may not be fully loaded.");
        return; // 终止脚本，避免后续 `null` 访问报错
    }

    // **添加语言切换功能**
    if (languageSwitch) {
        languageSwitch.addEventListener("click", toggleLanguage);
    } else {
        console.error("❌ Error: language-switch button not found!");
    }

    // **添加下一题按钮功能**
    if (nextButton) {
        nextButton.addEventListener("click", nextQuestion);
    } else {
        console.error("❌ Error: next-btn button not found!");
    }

    // **添加返回章节选择功能**
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "index.html"; // 返回章节页面
        });
    } else {
        console.error("❌ Error: back-btn button not found!");
    }

    // **加载题目**
    loadQuestions();
});

// **语言切换功能**
function toggleLanguage() {
    const currentLang = localStorage.getItem("language") || "cn";
    const newLang = currentLang === "cn" ? "en" : "cn";
    localStorage.setItem("language", newLang);
    location.reload(); // 刷新页面，应用语言切换
}

// **加载题目**
function loadQuestions() {
    console.log("🔄 Loading questions...");
    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    console.log("✅ Loaded Questions:", questions);

    if (questions.length === 0) {
        alert("⚠️ 题库加载失败，请返回重新选择章节！");
        window.location.href = "index.html"; // 返回章节选择
        return;
    }

    displayQuestion(0); // 显示第一道题
}

// **显示题目**
function displayQuestion(index) {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const explanationText = document.getElementById("explanation");
    const nextButton = document.getElementById("next-btn");

    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    if (index >= questions.length) {
        alert("🎉 题目已完成，返回章节选择！");
        window.location.href = "index.html";
        return;
    }

    let currentQuestion = questions[index];
    let lang = localStorage.getItem("language") || "cn";

    questionText.textContent = currentQuestion[`question_${lang}`];
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option, i) => {
        let button = document.createElement("button");
        button.textContent = option[lang];
        button.classList.add("option-btn");
        button.addEventListener("click", function () {
            checkAnswer(i, currentQuestion.correct, explanationText, nextButton);
        });
        optionsContainer.appendChild(button);
    });
}

// **检查答案**
function checkAnswer(selected, correct, explanationText, nextButton) {
    let buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn, index) => {
        if (index === correct) {
            btn.style.backgroundColor = "green"; // 正确答案变绿色
        }
        if (index === selected && selected !== correct) {
            btn.style.backgroundColor = "red"; // 选错的变红色
        }
        btn.disabled = true; // 禁止再次选择
    });

    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    let currentIndex = localStorage.getItem("currentQuestionIndex") || 0;
    explanationText.textContent = questions[currentIndex].explanation_cn; // 显示解析
    explanationText.classList.remove("hidden");

    nextButton.classList.remove("hidden"); // 显示下一题按钮
    localStorage.setItem("currentQuestionIndex", parseInt(currentIndex) + 1);
}

// **下一题**
function nextQuestion() {
    let currentIndex = parseInt(localStorage.getItem("currentQuestionIndex")) || 0;
    displayQuestion(currentIndex);
}
