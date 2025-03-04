document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const langButton = document.getElementById("toggle-lang");

    let currentQuestions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    let currentIndex = 0;
    let isEnglish = true; // 默认英语
    let answered = false; // 是否已经回答

    function loadQuestion() {
        answered = false; // 重置回答状态
        nextButton.style.display = "none"; // 先隐藏下一题按钮
        if (currentIndex >= currentQuestions.length) {
            questionText.innerText = "题目已完成！";
            optionsContainer.innerHTML = "";
            return;
        }

        const question = currentQuestions[currentIndex];
        questionText.innerText = isEnglish ? question.question_en : question.question_cn;

        optionsContainer.innerHTML = "";
        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.innerText = isEnglish ? option.en : option.cn;
            button.addEventListener("click", () => checkAnswer(index, question.correct, question));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(index, correctIndex, question) {
        if (answered) return; // 防止重复点击
        answered = true;

        let message;
        if (index === correctIndex) {
            message = isEnglish ? "Correct! 🎉" : "回答正确！🎉";
        } else {
            message = isEnglish ? `Wrong ❌\nCorrect answer: ${question.options[correctIndex].en}\n\nExplanation:\n${question.explanation_en}`
                               : `回答错误 ❌\n正确答案：${question.options[correctIndex].cn}\n\n解析：\n${question.explanation_cn}`;
        }

        alert(message); // 显示正确答案和解析
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
