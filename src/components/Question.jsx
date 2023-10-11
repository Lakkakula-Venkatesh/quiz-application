import { useEffect, useState } from "react";
import ajax from "superagent";
import { useNavigate } from "react-router-dom";

export default function Question({ questionParams, updateScore }) {
  const navigate = useNavigate();

  const questionsAPI = process.env.REACT_APP_QUESTIONS_API;

  const [questionNumer, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [optionSelected, setOptionSelected] = useState(false);

  const updateNext = () => {
    setLoading(true);
    setOptions([]);
    if (!isLastQuestion()) {
      updateScore(score);
      navigate("/result");
    }

    setQuestionNumber(questionNumer + 1);
  };

  const isLastQuestion = () => questionNumer !== Number(questionParams.amount);

  const validateRightAnswer = e => {
    if (optionSelected) {
      alert("Already selected an answer");
      return;
    }
    if (e.target.outerText === answer) setScore(score + 1);
    setOptionSelected(true);
  };

  const generateRandom = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const fillOptions = result => {
    if (questionParams.type === "boolean") {
      setOptions([...options, "True", "False"]);
      return;
    }

    let temp = [];

    const ind = generateRandom(0, 3);
    // eslint-disable-next-line array-callback-return
    result.incorrect_answers.map((value, index) => {
      if (index === ind) {
        temp.push(result.correct_answer);
      }
      temp.push(value);
    });

    if (temp.length === 3) temp.push(result.correct_answer);
    setOptions(temp);
  };

  useEffect(() => {
    ajax
      .get(questionsAPI)
      .query({
        amount: 1,
        difficulty: questionParams.difficulty,
        type: questionParams.type,
        category: questionParams.category
      })
      .then(res => {
        let result = res.body.results[0];

        setOptionSelected(false);
        setQuestion(result.question);
        setAnswer(result.correct_answer);
        fillOptions(result);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionNumer]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>Score: {score}</div>
          <div>
            Question {questionNumer} of {questionParams.amount}
          </div>
          <div>{question}</div>
          {options.map((option, index) => (
            <div
              key={index}
              value={option}
              onClick={e => validateRightAnswer(e)}
            >
              {option}
            </div>
          ))}
          <button onClick={() => updateNext()}>
            {isLastQuestion() ? "Next" : "End Quiz"}
          </button>
        </>
      )}
    </>
  );
}
