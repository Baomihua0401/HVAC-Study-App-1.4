document.addEventListener("DOMContentLoaded", function () {
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");

    let questions = [];

    // 加载 questions.json
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            console.log("✅ 题库加载成功:", questions);

            // 获取所有章节
            const totalChapters = Math.max(...questions.map(q => q.chapter));
            chapterSelect.innerHTML = ""; // 清空原有选项

            for (let i = 1; i <= totalChapters; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `Chapter ${i}`;
                chapterSelect.appendChild(option);
            }
        })
        .catch(error => console.error("❌ 加载题库失败:", error));

    // "开始答题" 按钮
    startButton.addEventListener("click", function () {
        if (!questions.length) {
            alert("⚠️ 题库尚未加载，请稍后再试！");
            return;
        }

        // 获取选中的章节
        const selectedChapter = parseInt(chapterSelect.value);
        console.log("📌 选择章节:", selectedChapter);

        // 过滤出该章节的题目
        const chapterQuestions = questions.filter(q => q.chapter === selectedChapter);
        if (chapterQuestions.length === 0) {
            alert(`⚠️ 章节 ${selectedChapter} 还没有题目！`);
            return;
        }

        // 存储选中的题目到 localStorage
        localStorage.setItem("currentQuestions", JSON.stringify(chapterQuestions));
        localStorage.setItem("currentQuestionIndex", "0"); // 题目索引重置为 0

        console.log("📥 题库已存入 localStorage:", chapterQuestions);
        window.location.href = "quiz.html"; // 跳转到答题页面
    });
});
