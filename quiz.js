document.addEventListener("DOMContentLoaded", function () {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");

    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];
    let currentQuestionIndex = 0;
    let answered = false; // 防止重复点击答案

    function loadQuestion() {
        answered = false;
        optionsContainer.innerHTML = ""; // 清空选项
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question_cn || currentQuestion.question_en;

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option.cn || option.en;
            button.classList.add("option-btn");
            button.onclick = () => checkAnswer(index, button, currentQuestion.correct, currentQuestion);
            optionsContainer.appendChild(button);
        });

        nextButton.style.display = "none"; // 隐藏下一题按钮，直到作答后显示
    }

    function checkAnswer(selectedIndex, selectedButton, correctIndex, question) {
        if (answered) return; // 防止重复点击
        answered = true;

        const buttons = document.querySelectorAll(".option-btn");

        buttons.forEach((btn, index) => {
            btn.disabled = true; // 选项锁定，防止再次点击
            if (index === correctIndex) {
                btn.style.backgroundColor = "green"; // 正确答案变绿色
                btn.style.color = "white";
            }
        });

        if (selectedIndex !== correctIndex) {
            selectedButton.style.backgroundColor = "red"; // 选错的变红色
            selectedButton.style.color = "white";
        }

        // 显示解析
        setTimeout(() => {
            alert(`解析: ${question.explanation_cn || question.explanation_en}`);
            nextButton.style.display = "block"; // 显示下一题按钮
        }, 500);
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert("本章节已完成！");
            window.location.href = "index.html";
        }
    });

    backButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    loadQuestion();
});
