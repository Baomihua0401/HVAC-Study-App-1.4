document.addEventListener("DOMContentLoaded", function () {
    const chapterSelect = document.getElementById("chapter-select");
    const startButton = document.getElementById("start-btn");

    let questions = [];
    let selectedChapter = 1; // 默认选择第 1 章

    // 加载 questions.json 题库
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;

            // 获取所有章节，并填充下拉框
            const totalChapters = Math.max(...questions.map(q => q.chapter)); // 获取最大章节号
            chapterSelect.innerHTML = ""; // 清空原有选项

            for (let i = 1; i <= totalChapters; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = `Chapter ${i}`;
                chapterSelect.appendChild(option);
            }
        })
        .catch(error => console.error("加载题库失败:", error));

    // 监听章节选择
    chapterSelect.addEventListener("change", function () {
        selectedChapter = parseInt(this.value);
    });

    // 监听 "开始答题" 按钮
    startButton.addEventListener("click", function () {
        if (!questions.length) {
            alert("题库尚未加载，请稍候再试。");
            return;
        }

        // 过滤出该章节的题目
        const chapterQuestions = questions.filter(q => q.chapter === selectedChapter);

        if (chapterQuestions.length === 0) {
            alert(`章节 ${selectedChapter} 还没有题目！`);
            return;
        }

        // 存储选中的题目到本地存储，并跳转到 quiz.html
        localStorage.setItem("currentQuestions", JSON.stringify(chapterQuestions));
        window.location.href = "quiz.html"; // 跳转到答题页面
    });
});
