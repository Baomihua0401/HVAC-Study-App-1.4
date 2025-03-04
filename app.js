document.addEventListener("DOMContentLoaded", function () {
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");
    const reviewMistakesButton = document.getElementById("review-mistakes-btn");

    let questions = [];

    // 加载题库
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            console.log("✅ 题库加载成功:", questions);

            // 获取所有章节
            const totalChapters = Math.max(...questions.map(q => q.chapter));
            chapterSelect.innerHTML = ""; 

            for (let i = 1; i <= totalChapters; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `Chapter ${i}`;
                chapterSelect.appendChild(option);
            }
        })
        .catch(error => console.error("❌ 加载题库失败:", error));

    // 开始答题
    startButton.addEventListener("click", function () {
        if (!questions.length) {
            alert("⚠️ 题库尚未加载，请稍后再试！");
            return;
        }

        const selectedChapter = parseInt(chapterSelect.value);
        console.log("📌 选择章节:", selectedChapter);

        const chapterQuestions = questions.filter(q => q.chapter === selectedChapter);
        if (chapterQuestions.length === 0) {
            alert(`⚠️ 章节 ${selectedChapter} 还没有题目！`);
            return;
        }

        localStorage.setItem("currentQuestions", JSON.stringify(chapterQuestions));
        localStorage.setItem("currentQuestionIndex", "0"); 

        console.log("📥 题库已存入 localStorage:", chapterQuestions);
        window.location.href = "quiz.html";
    });

    // 查看错题
    reviewMistakesButton.addEventListener("click", function () {
        let mistakes = JSON.parse(localStorage.getItem("mistakes")) || [];
        if (mistakes.length === 0) {
            alert("暂无错题！");
            return;
        }
        localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
        window.location.href = "quiz.html";
    });
});
