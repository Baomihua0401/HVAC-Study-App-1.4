document.addEventListener("DOMContentLoaded", function () { 
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");
    const reviewMistakesButton = document.getElementById("review-mistakes-btn");
    const chapterProgressList = document.getElementById("chapter-progress");

    let questions = [];
    let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];

    console.log("📌 章节进度 DOM:", chapterProgressList);
    if (!chapterProgressList) {
        console.error("❌ 错误: 章节进度列表的 DOM 元素未找到！");
    }

fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        console.log("✅ 题库加载成功:", questions);

        const totalChapters = Math.max(...questions.map(q => q.chapter));
        chapterSelect.innerHTML = "";

        // ✅ **插入此代码**
        let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];
        // ✅ **插入结束**

        for (let i = 1; i <= totalChapters; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Chapter ${i}`;
            chapterSelect.appendChild(option);

            // **更新章节进度显示**
            const listItem = document.createElement("li");
            listItem.textContent = `章节 ${i} - ${completedChapters.includes(i) ? "✅ 已完成" : "⚪ 未开始"}`;
            chapterProgressList.appendChild(listItem);
        }
    })
    .catch(error => console.error("❌ 加载题库失败:", error));

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

    console.log("📌 查看错题按钮:", reviewMistakesButton);
    if (reviewMistakesButton) {
       reviewMistakesButton.addEventListener("click", function () {
    let mistakes = JSON.parse(localStorage.getItem("mistakes")) || [];

    // ✅ **插入此代码**
    console.log("📌 当前错题:", mistakes);
    // ✅ **插入结束**

    if (mistakes.length === 0) {
        alert("暂无错题！");
        return;
    }

    localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
    window.location.href = "quiz.html";
});

    } else {
        console.error("❌ 错误: '查看错题' 按钮未找到！");
    }
});
