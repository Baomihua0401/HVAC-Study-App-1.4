document.addEventListener("DOMContentLoaded", function () {
    let currentLanguage = localStorage.getItem("language") || "cn"; // 默认中文
    let currentQuestionIndex = 0;
    let correctAnswers = 0; // 记录答对的题目数
    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];

    const languageSwitchBtn = document.getElementById("language-switch");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const explanationText = document.getElementById("explanation");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const progressText = document.getElementById("progress");
    const scoreText = document.getElementById("score");

    // 📌 更新进度和正确率
    function updateProgress() {
        progressText.textContent = `进度: ${currentQuestionIndex + 1} / ${questions.length}`;
        let percentage = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
        scoreText.textContent = `正确率: ${percentage}%`;
    }

    // 📌 更新语言切换按钮文本
    function updateLanguageButton() {
        languageSwitchBtn.textContent = currentLanguage === "cn" ? "切换至英语" : "Switch to Chinese";
    }

    // 📌 切换语言并存储
    languageSwitchBtn.addEventListener("click", function () {
        currentLanguage = currentLanguage === "cn" ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        updateLanguageButton();
        loadQuestion(); // 重新加载题目
    });

    // 📌 监听返回章节按钮
    backButton.addEventListener("click", function () {
        window.location.href = "index.html"; // 返回章节选择页面
    });

    // 📌 加载题目
    function loadQuestion() {
        if (questions.length === 0) {
            alert("题库加载失败，请返回选择章节！");
            window.location.href = "index.html";
            return;
        }

        const question = questions[currentQuestionIndex];
        questionText.textContent = currentLanguage === "cn" ? question.question_cn : question.question_en;
        optionsContainer.innerHTML = ""; // 清空选项
        explanationText.classList.add("hidden"); // 隐藏解析
        nextButton.classList.add("hidden"); // 隐藏下一题按钮

        question.options.forEach((option, index) => {
            const btn = document.createElement("button");
            btn.textContent = currentLanguage === "cn" ? option.cn : option.en;
            btn.classList.add("option-btn");
            btn.dataset.index = index;
            btn.addEventListener("click", () => checkAnswer(index)); // 绑定答案点击事件
            optionsContainer.appendChild(btn);
        });

        updateProgress(); // 更新进度信息
        updateLanguageButton(); // 确保切换语言时，按钮显示正确文本
    }

    // 📌 检查答案
    function checkAnswer(selectedIndex) {
        const question = questions[currentQuestionIndex];
        const correctIndex = question.correct;
        const optionButtons = document.querySelectorAll(".option-btn");

        optionButtons.forEach((btn, index) => {
            btn.disabled = true; // 选项锁定
            if (index === correctIndex) {
                btn.style.backgroundColor = "green"; // 正确答案高亮绿色
                btn.style.color = "white";
            } else if (index === selectedIndex) {
                btn.style.backgroundColor = "red"; // 选错时，高亮红色
                btn.style.color = "white";
            }
        });

        if (selectedIndex === correctIndex) {
            correctAnswers++; // 答对加分
        }

        // 显示解析
        explanationText.textContent = currentLanguage === "cn" ? question.explanation_cn : question.explanation_en;
        explanationText.classList.remove("hidden");

        nextButton.classList.remove("hidden"); // 显示下一题按钮
    }

    // 📌 监听下一题按钮
    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion(); // 加载下一题
        } else {
            alert(`🎉 章节完成！您的正确率为 ${Math.round((correctAnswers / questions.length) * 100)}%`);
            window.location.href = "index.html";
        }
    });

    loadQuestion(); // 加载第一题
});
