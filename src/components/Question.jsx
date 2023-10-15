import { useEffect, useState } from "react";
import ajax from "superagent";
import he from "he";
import { useNavigate } from "react-router-dom";

export default function Question({ questionParams, updateScore, updateTime }) {
  const navigate = useNavigate();

  const questionsAPI = process.env.REACT_APP_QUESTIONS_API;

  const [questionNumer, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [optionSelected, setOptionSelected] = useState(false);

  const updateNext = () => {
    setLoading(true);
    setOptions([]);
    if (!isLastQuestion()) {
      updateScore(score);
      updateTime(`${("0" + minutes).slice(-2)}:
      ${("0" + seconds).slice(-2)}`);
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

    if (e.target.attributes.value.nodeValue === answer) setScore(score + 1);
    setOptionSelected(true);
  };

  const e = setInterval(() => {
    if (seconds === 59) {
      setMinutes(minutes + 1);
      setSeconds(0);
    } else setSeconds(seconds + 1);
    clearInterval(e);
  }, 1000);

  const generateRandom = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const fillOptions = result => {
    let temp = [];

    const ind = generateRandom(0, result.incorrect_answers.length);
    // eslint-disable-next-line array-callback-return
    result.incorrect_answers.map((value, index) => {
      if (index === ind) {
        temp.push(he.decode(result.correct_answer));
      }
      temp.push(he.decode(value));
    });

    if (temp.length === 3 || temp.length === 1)
      temp.push(he.decode(result.correct_answer));
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
        setQuestion(he.decode(result.question));
        setAnswer(he.decode(result.correct_answer));
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
        <div className="question-content">
          <div className="top-div">
            <div>Question {questionNumer}</div>
            <div>
              Time taken: {("0" + minutes).slice(-2)}:
              {("0" + seconds).slice(-2)}
            </div>
            <div>Score: {score}</div>
          </div>
          <div className="question-div">
            <div className="question-text">Q. {question}</div>
            <ul className="list-group options-div">
              {options.map((option, index) => (
                <li
                  className={`list-group-item option-div ${
                    optionSelected
                      ? option === answer
                        ? "right-answer"
                        : "wrong-answer"
                      : ""
                  }`}
                  key={index}
                  value={option}
                  onClick={e => validateRightAnswer(e)}
                >
                  {index + 1}. {option}{" "}
                  {optionSelected ? (
                    option === answer ? (
                      <i className="bi bi-check-circle"></i>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="button-div">
            <button className="btn btn-primary" onClick={() => updateNext()}>
              {isLastQuestion() ? "Next" : "End Quiz"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
