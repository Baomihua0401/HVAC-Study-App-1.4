document.addEventListener("DOMContentLoaded", function () {
    let chapterSelect = document.getElementById("chapter-select");
    let startButton = document.getElementById("start-btn");
    let quizContainer = document.getElementById("quiz-container");

    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            let chapters = new Set(); // 使用 Set 避免重复章节
            data.forEach(question => chapters.add(question.chapter));

            // 清空下拉框并插入章节选项
            chapterSelect.innerHTML = "";
            chapters.forEach(chapter => {
                let option = document.createElement("option");
                option.value = chapter;
                option.textContent = chapter; 
                chapterSelect.appendChild(option);
            });

            // 监听章节选择 & 开始答题
            startButton.addEventListener("click", function () {
                let selectedChapter = chapterSelect.value;
                let filteredQuestions = data.filter(q => q.chapter === selectedChapter);

                if (filteredQuestions.length > 0) {
                    localStorage.setItem("selectedQuestions", JSON.stringify(filteredQuestions));
                    window.location.href = "quiz.html"; // 跳转到答题页面
                } else {
                    alert("该章节没有题目，请选择其他章节！");
                }
            });
        })
        .catch(error => console.error("Error loading questions:", error));
});
