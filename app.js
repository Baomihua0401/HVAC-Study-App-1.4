// ✅ app.js 支持 Skill / Law 多题库 + 按章节筛选

document.addEventListener("DOMContentLoaded", function () {
  const bankSelect = document.getElementById("bank-select");
  const chapterSelect = document.getElementById("chapter-select");
  const startButton = document.getElementById("start-btn");
  const reviewButton = document.getElementById("review-btn");
  const progressList = document.getElementById("progress-list");

  let questionsMap = {}; // 保存题库数据：{ law: [...], skill: [...] }

  const bankMap = {
    law: "questions_law.json",
    skill: "questions_skill.json"
  };

  function loadBank(bank) {
    fetch(bankMap[bank])
      .then(res => res.json())
      .then(data => {
        questionsMap[bank] = data;
        renderChapters(data, bank);
        renderProgress(data, bank);
      });
  }

  function renderChapters(data, bank) {
    const chapters = [...new Set(data.map(q => q.chapter))].sort((a, b) => a - b);
    chapterSelect.innerHTML = chapters.map(ch => `<option value="${ch}">Chapter ${ch}</option>`).join("");
  }

  function renderProgress(data, bank) {
    const chapters = [...new Set(data.map(q => q.chapter))].sort((a, b) => a - b);
    const completed = JSON.parse(localStorage.getItem(`completedChapters_${bank}`)) || [];
    progressList.innerHTML = chapters.map(ch => `<li>章节 ${ch} - ${completed.includes(ch) ? "✅ 已完成" : "⚪ 未开始"}</li>`).join("");
  }

  bankSelect.addEventListener("change", () => {
    const selectedBank = bankSelect.value;
    loadBank(selectedBank);
  });

  startButton.addEventListener("click", () => {
    const bank = bankSelect.value;
    const chapter = parseInt(chapterSelect.value);
    const filtered = questionsMap[bank].filter(q => q.chapter === chapter);
    if (!filtered.length) return alert("该章节无题目");
    localStorage.setItem("currentBank", bank);
    localStorage.setItem("currentQuestions", JSON.stringify(filtered));
    window.location.href = "quiz.html";
  });

  reviewButton.addEventListener("click", () => {
    const bank = bankSelect.value;
    const mistakes = JSON.parse(localStorage.getItem(`mistakes_${bank}`)) || [];
    if (!mistakes.length) return alert("暂无错题");
    localStorage.setItem("currentBank", bank);
    localStorage.setItem("currentQuestions", JSON.stringify(mistakes));
    window.location.href = "quiz.html";
  });

  // 默认加载 law
  bankSelect.value = "law";
  loadBank("law");
});
