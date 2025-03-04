document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const langButton = document.getElementById("toggle-lang");

    let currentQuestions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    let currentIndex = 0;
    let isEnglish = true; // 默认语言：英语
    let answered = false; // 记录是否已经回答

    function loadQuestion() {
        answered = false; // 允许新回答
        nextButton.style.display = "none"; // 先隐藏“下一题”按钮
        optionsContainer.innerHTML = ""; // 清空上次的选项

        if (currentIndex >= currentQuestions.length) {
            questionText.innerText = isEnglish ? "All questions completed!" : "所有题目已完成！";
            return;
        }

        const question = currentQuestions[currentIndex];
        questionText.innerText = isEnglish ? question.question_en : question.question_cn;

        // 显示选项
        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.innerText = isEnglish ? option.en : option.cn;
            button.addEventListener("click", () => checkAnswer(index, question.correct, question, button));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(index, correctIndex, question, selectedButton) {
        if (answered) return; // 防止重复回答
        answered = true;

        // 禁用所有选项按钮
        document.querySelectorAll(".option-btn").forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.6"; // 让已选项变灰
        });

        let message;
        if (index === correctIndex) {
            message = isEnglish ? "✅ Correct!" : "✅ 回答正确！";
            selectedButton.style.backgroundColor = "green"; // 绿色背景
            selectedButton.style.color = "white";
        } else {
            message = isEnglish 
                ? `❌ Wrong!\nCorrect answer: ${question.options[correctIndex].en}\n\nExplanation:\n${question.explanation_en}`
                : `❌ 回答错误！\n正确答案：${question.options[correctIndex].cn}\n\n解析：\n${question.explanation_cn}`;
            selectedButton.style.backgroundColor = "red"; // 红色背景
            selectedButton.style.color = "white";
        }

        // 显示解析信息
        const explanationBox = document.createElement("div");
        explanationBox.innerText = message;
        explanationBox.style.marginTop = "20px";
        explanationBox.style.padding = "10px";
        explanationBox.style.border = "1px solid black";
        explanationBox.style.backgroundColor = "#f9f9f9";
        explanationBox.style.fontWeight = "bold";
        optionsContainer.appendChild(explanationBox);

        nextButton.style.display = "block"; // 显示“下一题”按钮
    }

    // 监听“下一题”按钮
    nextButton.addEventListener("click", function () {
        currentIndex++;
        loadQuestion();
    });

    // 监听“返回章节”按钮
    backButton.addEventListener("click", function () {
        window.location.href = "index.html"; // 返回章节选择页
    });

    // 监听“语言切换”按钮
    langButton.addEventListener("click", function () {
        isEnglish = !isEnglish;
        langButton.innerText = isEnglish ? "Switch to 中文" : "切换到 English";
        loadQuestion();
    });

    loadQuestion(); // 加载第一道题
});
