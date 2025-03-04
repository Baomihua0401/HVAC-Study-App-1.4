document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const langButton = document.getElementById("toggle-lang");

    let currentQuestions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    let currentIndex = 0;
    let isEnglish = true; // 默认英语

    function loadQuestion() {
        if (currentIndex >= currentQuestions.length) {
            questionText.innerText = "题目已完成！";
            optionsContainer.innerHTML = "";
            nextButton.style.display = "none";
            return;
        }

        const question = currentQuestions[currentIndex];
        questionText.innerText = isEnglish ? question.question_en : question.question_cn;

        optionsContainer.innerHTML = "";
        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.innerText = isEnglish ? option.en : option.cn;
            button.addEventListener("click", () => checkAnswer(index, question.correct));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(index, correctIndex) {
        if (index === correctIndex) {
            alert("回答正确！");
        } else {
            alert("回答错误！");
        }
        currentIndex++;
        loadQuestion();
    }

    // 监听“下一题”按钮
    nextButton.addEventListener("click", loadQuestion);

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
