// 题库（示例，只显示部分，完整的1000道题需要加载）
const questions = [
    {
        question_en: "What is the primary factor to consider in HVAC load calculations?",
        question_cn: "在设计暖通空调系统时，负载计算的首要因素是什么？",
        options: [
            { en: "Building square footage", cn: "建筑面积" },
            { en: "Outdoor temperature", cn: "室外温度" },
            { en: "Heat gain and loss", cn: "热量增益和损失" },
            { en: "Equipment cost", cn: "设备成本" }
        ],
        correct: 2,
        explanation_en: "HVAC load calculations focus on heat gain and loss...",
        explanation_cn: "暖通空调负载计算的重点是热量增益和损失..."
    },
    // 这里应添加完整的1000道题
];

let currentQuestion = 0;
let language = "en";

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const languageButton = document.createElement("button");

// 语言切换按钮
languageButton.textContent = "Switch to Chinese";
languageButton.onclick = toggleLanguage;
document.body.insertBefore(languageButton, document.body.firstChild);

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
}

// 检查答案
function checkAnswer(selected) {
    const correct = questions[currentQuestion].correct;
    alert(selected === correct ? "Correct!" : "Wrong answer!");
    document.getElementById("explanation").textContent = language === "en" ? questions[currentQuestion].explanation_en : questions[currentQuestion].explanation_cn;
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

// 加载第一题
loadQuestion();
