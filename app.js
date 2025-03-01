let questions = [];
let currentQuestion = 0;
let language = "en";

// 获取 HTML 元素
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const languageButton = document.createElement("button");
const explanationElement = document.createElement("p");

// 语言切换按钮
languageButton.textContent = "Switch to Chinese";
languageButton.onclick = toggleLanguage;
document.body.insertBefore(languageButton, document.body.firstChild);

// 解析显示
explanationElement.id = "explanation";
document.body.appendChild(explanationElement);

// 加载 JSON 题库
fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        loadQuestion();
    })
    .catch(error => {
        console.error("Error loading questions:", error);
        questionElement.textContent = "Failed to load questions!";
    });

// 加载题目
function loadQuestion() {
    if (!questions.length) {
        questionElement.textContent = "Error: No questions available!";
        return;
    }

    const q = questions[currentQuestion];
    questionElement.textContent = language === "en" ? q.question_en : q.question_cn;
    optionsElement.innerHTML = "";

    q.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = language === "en" ? option.en : option.cn;
        button.onclick = () => checkAnswer(index);
        optionsElement.appendChild(button);
    });

    explanationElement.textContent = ""; // 清空解析
}

// 检查答案
function checkAnswer(selected) {
    const correct = questions[currentQuestion].correct;
    alert(selected === correct ? "Correct!" : "Wrong answer!");

    // 显示解析
    explanationElement.textContent = language === "en"
        ? questions[currentQuestion].explanation_en
        : questions[currentQuestion].explanation_cn;
}

// 切换语言
function toggleLanguage() {
    language = language === "en" ? "cn" : "en";
    languageButton.textContent = language === "en" ? "Switch to Chinese" : "切换到英语";
    loadQuestion();
}

// 下一题
nextButton.onclick = () => {
    currentQuestion = (currentQuestion + 1) % questions.length;
    loadQuestion();
};
