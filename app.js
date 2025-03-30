// 修复后的 app.js

// 页面加载完成后执行
window.addEventListener("DOMContentLoaded", () => {
  const dbSelect = document.getElementById("db-select");
  const chapterSelect = document.getElementById("chapter-select");
  const startButton = document.getElementById("start-btn");
  const reviewButton = document.getElementById("review-btn");
  const progressList = document.getElementById("progress-list");

  let questions = [];
  let completed = JSON.parse(localStorage.getItem("completedChapters")) || {};

  // 监听题库切换
  dbSelect.addEventListener("change", loadChapters);

  function loadChapters() {
    const selectedDB = dbSelect.value;
    const dbFile = selectedDB === "law" ? "questions_law.json" : "questions_skill.json";

    fetch(dbFile)
      .then(res => res.json())
      .then(data => {
        questions = data;
        localStorage.setItem("currentDB", dbFile);

        // 获取章节号最大值
        const totalChapters = Math.max(...questions.map(q => q.chapter));
        chapterSelect.innerHTML = "";
        progressList.innerHTML = "";

        for (let i = 1; i <= totalChapters; i++) {
          const opt = document.createElement("option");
          opt.value = i;
          opt.textContent = `Chapter ${i}`;
          chapterSelect.appendChild(opt);

          const li = document.createElement("li");
          const status = completed[`${dbFile}-${i}`] ? "✅ 已完成" : "⚪ 未开始";
          li.textContent = `章节 ${i} - ${status}`;
          progressList.appendChild(li);
        }
      })
      .catch(err => {
        console.error("加载题库失败", err);
        alert("题库文件加载失败，请检查文件路径");
      });
  }

  // 开始答题
  startButton.addEventListener("click", () => {
    const chapter = parseInt(chapterSelect.value);
    const chapterQuestions = questions.filter(q => q.chapter === chapter);
    if (!chapterQuestions.length) return alert("当前章节无题目");

    localStorage.setItem("currentQuestions", JSON.stringify(chapterQuestions));
    localStorage.setItem("currentQuestionIndex", "0");
    window.location.href = "quiz.html";
  });

  // 查看错题
  reviewButton.addEventListener("click", () => {
    const mistakes = JSON.parse(localStorage.getItem("mistakes")) || [];
    if (!mistakes.length) return alert("暂无错题");

    localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
    localStorage.setItem("currentQuestionIndex", "0");
    window.location.href = "quiz.html";
  });

  // 默认加载
  loadChapters();
});
