document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const explanationText = document.getElementById("explanation");
    const languageButton = document.getElementById("toggle-language");

    let currentQuestions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    let currentQuestionIndex = 0;
    let language = "cn"; // 默认语言为中文

    function loadQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
            alert("本章节题目已完成！");
            window.location.href = "index.html"; // 跳转回章节选择
            return;
        }

        const question = currentQuestions[currentQuestionIndex];
        questionText.textContent = language === "cn" ? question.question_cn : question.question_en;
        explanationText.style.display = "none"; // 隐藏解析
        optionsContainer.innerHTML = ""; // 清空选项

        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = language === "cn" ? option.cn : option.en;
            button.classList.add("option-btn");
            button.addEventListener("click", () => checkAnswer(index, question.correct));
            optionsContainer.appendChild(button);
        });

        nextButton.disabled = true; // 禁用“下一题”按钮，直到选择答案
    }

    function checkAnswer(selectedIndex, correctIndex) {
        const buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((btn, index) => {
            btn.disabled = true; // 禁用所有选项
            if (index === correctIndex) {
                btn.style.backgroundColor = "green"; // 标记正确答案
            } else if (index === selectedIndex) {
                btn.style.backgroundColor = "red"; // 标记错误答案
            }
        });

        explanationText.textContent = language === "cn" ? currentQuestions[currentQuestionIndex].explanation_cn : currentQuestions[currentQuestionIndex].explanation_en;
        explanationText.style.display = "block"; // 显示解析
        nextButton.disabled = false; // 启用“下一题”按钮
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        loadQuestion();
    });

    backButton.addEventListener("click", function () {
        window.location.href = "index.html"; // 返回章节选择
    });

    languageButton.addEventListener("click", function () {
        language = language === "cn" ? "en" : "cn";
        languageButton.textContent = language === "cn" ? "切换到 English" : "Switch to 中文";
        loadQuestion(); // 重新加载当前题目
    });

    loadQuestion();
});
