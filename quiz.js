document.addEventListener("DOMContentLoaded", function () {
    let currentLanguage = localStorage.getItem("language") || "cn"; // 默认中文
    let currentQuestionIndex = 0;
    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];

    const languageSwitchBtn = document.getElementById("language-switch");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");

    // 📌 更新语言切换按钮文本
    function updateLanguageButton() {
        if (currentLanguage === "cn") {
            languageSwitchBtn.textContent = "切换至英语";
        } else {
            languageSwitchBtn.textContent = "Switch to Chinese";
        }
    }

    // 📌 切换语言并存储
    languageSwitchBtn.addEventListener("click", function () {
        currentLanguage = currentLanguage === "cn" ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        updateLanguageButton(); // 更新按钮文本
        loadQuestion(); // 重新加载题目
    });

    // 📌 加载题目
    function loadQuestion() {
        if (questions.length === 0) {
            alert("题库加载失败，请返回选择章节！");
            window.location.href = "index.html";
            return;
        }
        const question = questions[currentQuestionIndex];

        // 使用当前语言显示问题和选项
        questionText.textContent = currentLanguage === "cn" ? question.question_cn : question.question_en;
        optionsContainer.innerHTML = ""; // 清空选项
        question.options.forEach((option, index) => {
            const btn = document.createElement("button");
            btn.textContent = currentLanguage === "cn" ? option.cn : option.en;
            btn.classList.add("option-btn");
            btn.dataset.index = index;
            optionsContainer.appendChild(btn);
        });

        updateLanguageButton(); // 确保切换语言时，按钮显示正确文本
    }

    loadQuestion(); // 加载第一题
});
