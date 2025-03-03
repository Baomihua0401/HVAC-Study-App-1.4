document.addEventListener("DOMContentLoaded", function () {
    let questions = JSON.parse(localStorage.getItem("currentQuestions"));
    let currentQuestionIndex = 0;

    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            alert("本章节题目已完成！");
            window.location.href = "index.html"; // 返回首页
            return;
        }

        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question_cn; // 显示中文题目

        optionsContainer.innerHTML = "";
        question.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option.cn;
            button.addEventListener("click", function () {
                if (index === question.correct) {
                    alert("回答正确！");
                } else {
                    alert("回答错误！");
                }
            });
            optionsContainer.appendChild(button);
        });
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        loadQuestion();
    });

    loadQuestion(); // 初始加载
});
