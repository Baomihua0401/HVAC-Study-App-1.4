document.addEventListener("DOMContentLoaded", function () {
    let questions = [];
    let currentQuestionIndex = 0;
    let selectedChapter = "";
    
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            populateChapterOptions();
        })
        .catch(error => console.error("Error loading questions.json:", error));
    
    function populateChapterOptions() {
        const chapterSelect = document.getElementById("chapter-select");
        const chapters = [...new Set(questions.map(q => q.chapter))];
        
        chapters.forEach(chapter => {
            let option = document.createElement("option");
            option.value = chapter;
            option.textContent = chapter;
            chapterSelect.appendChild(option);
        });
    }
    
    window.startQuiz = function () {
        selectedChapter = document.getElementById("chapter-select").value;
        currentQuestionIndex = 0;
        loadQuestion();
        document.getElementById("chapter-selection").style.display = "none";
        document.getElementById("quiz-container").style.display = "block";
    }
    
    function loadQuestion() {
        const filteredQuestions = questions.filter(q => q.chapter === selectedChapter);
        if (currentQuestionIndex >= filteredQuestions.length) {
            alert("已完成本章节所有题目！");
            location.reload();
            return;
        }
        
        const questionData = filteredQuestions[currentQuestionIndex];
        document.getElementById("question").textContent = questionData.question_cn;
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = "";
        
        questionData.options.forEach((option, index) => {
            let button = document.createElement("button");
            button.textContent = option.cn;
            button.onclick = function () { checkAnswer(index, questionData.correct, questionData); };
            optionsContainer.appendChild(button);
        });
    }
    
    function checkAnswer(selectedIndex, correctIndex, questionData) {
        if (selectedIndex === correctIndex) {
            alert("正确！\n\n" + questionData.explanation_cn);
        } else {
            alert("错误！正确答案是：" + questionData.options[correctIndex].cn + "\n\n解析：" + questionData.explanation_cn);
        }
        currentQuestionIndex++;
        loadQuestion();
    }
    
    window.nextQuestion = function () {
        currentQuestionIndex++;
        loadQuestion();
    }
});
