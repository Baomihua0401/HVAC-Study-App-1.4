nextButton.addEventListener("click", function () {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        alert(`🎉 章节完成！正确率: ${Math.round((correctAnswers / questions.length) * 100)}%`);

        // 获取章节号
        let chapterNumber = questions[0].chapter;
        let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];
        if (!completedChapters.includes(chapterNumber)) {
            completedChapters.push(chapterNumber);
        }
        localStorage.setItem("completedChapters", JSON.stringify(completedChapters));

        window.location.href = "index.html";
    }
});
