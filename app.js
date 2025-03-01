import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 加载完整的1000道题库
const questions = [...]; // 这里应该是完整的JSON数据

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (!questions.length) {
      console.error("题库加载失败或为空");
    }
  }, []);

  const question = questions[currentQuestion];

  const handleAnswer = (option) => {
    setSelectedOption(option);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "cn" : "en"));
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Button onClick={toggleLanguage} className="mb-4">
        Switch to {language === "en" ? "Chinese" : "English"}
      </Button>
      <Card className="w-full max-w-lg p-4 text-center">
        <h2 className="text-xl font-bold mb-2">{language === "en" ? question.question_en : question.question_cn}</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(question.options).map(([key, value]) => (
            <Button
              key={key}
              className={`p-2 border ${selectedOption === key ? (key === question.correct_answer ? "bg-green-500" : "bg-red-500") : "bg-gray-200"}`}
              onClick={() => handleAnswer(key)}
              disabled={showExplanation}
            >
              {language === "en" ? value.en : value.cn}
            </Button>
          ))}
        </div>
      </Card>
      {showExplanation && (
        <Card className="w-full max-w-lg p-4 mt-4 bg-gray-100">
          <CardContent>
            <h3 className="font-semibold">{language === "en" ? "Explanation:" : "解析："}</h3>
            <p>{language === "en" ? question.explanation_en : question.explanation_cn}</p>
          </CardContent>
        </Card>
      )}
      <Button onClick={handleNextQuestion} className="mt-4">
        {language === "en" ? "Next Question" : "下一题"}
      </Button>
    </div>
  );
}
