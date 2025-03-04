document.addEventListener("DOMContentLoaded", function () {
    let currentLanguage = localStorage.getItem("language") || "cn"; // 默认语言为中文
    let currentQuestionIndex = 0;
    let questions = JSON.parse(localStorage.getItem("currentQuestions")) || [];

    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");
    const backButton = document.getElementById("back-btn");
    const switchLangButton = document.getElementById("switch-lang");

    if (questions.length === 0) {
        alert("题库未正确加载，请检查是否选择了章节！");
        window.location.href = "index.html"; // 返回主页
        return;
    }

    console.log("Loaded Questions:", questions);

    function displayQuestion() {
        let question = questions[currentQuestionIndex];

        // 更新题目文本
        questionText.textContent = `${currentQuestionIndex + 1}. ` + 
            (currentLanguage === "cn" ? question.question_cn : question.question_en);

        // 清空旧选项
        optionsContainer.innerHTML = "";

        // 生成选项按钮
        question.options.forEach((option, index) => {
            let optionButton = document.createElement("button");
            optionButton.classList.add("option-btn");
            optionButton.textContent = currentLanguage === "cn" ? option.cn : option.en;
            optionButton.dataset.index = index;
            optionButton.addEventListener("click", () => checkAnswer(index, optionButton));
            optionsContainer.appendChild(optionButton);
        });

        nextButton.style.display = "none"; // 隐藏下一题按钮
    }

    function checkAnswer(selectedIndex, selectedButton) {
        let correctIndex = questions[currentQuestionIndex].correct;

        // 禁用所有选项
        document.querySelectorAll(".option-btn").forEach(button => {
            button.disabled = true;
            if (parseInt(button.dataset.index) === correctIndex) {
                button.style.backgroundColor = "green"; // 正确答案高亮
                button.style.color = "white";
            }
        });

        if (selectedIndex === correctIndex) {
            selectedButton.style.backgroundColor = "green";
            selectedButton.style.color = "white";
        } else {
            selectedButton.style.backgroundColor = "red"; // 选错标红
            selectedButton.style.color = "white";
        }

        // 显示解析
        let explanationText = document.createElement("p");
        explanationText.classList.add("explanation");
        explanationText.textContent = 
            (currentLanguage === "cn" ? questions[currentQuestionIndex].explanation_cn : questions[currentQuestionIndex].explanation_en);
        optionsContainer.appendChild(explanationText);

        nextButton.style.display = "block"; // 显示下一题按钮
    }

    nextButton.addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            alert("你已完成本章节的所有题目！");
            window.location.href = "index.html";
        }
    });

    backButton.addEventListener("click", function () {
        window.location.href = "index.html"; // 返回章节选择
    });

    switchLangButton.addEventListener("click", function () {
        currentLanguage = currentLanguage === "cn" ? "en" : "cn";
        localStorage.setItem("language", currentLanguage);
        displayQuestion(); // 重新渲染当前题目
    });

    // 初始加载
    displayQuestion();
});
