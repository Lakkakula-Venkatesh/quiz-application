import { useNavigate } from "react-router-dom";

export default function Result({ score, updateScore, questionParams, time }) {
  const navigate = useNavigate();

  const goToHome = () => {
    updateScore();
    navigate("/");
  };

  const goToQuestions = () => {
    updateScore();
    navigate("/question");
  };

  const getPercentage = () => {
    return (score / questionParams.amount) * 100;
  };

  return (
    <div className="result-content">
      <h1>Result</h1>
      <div className="result-div">Total Questions: {questionParams.amount}</div>
      <div className="result-div">Time Taken: {time}</div>
      <div className="result-div">Correct Answers: {score}</div>
      <div className="result-div">Your Score: {getPercentage()}%</div>
      <div className="result-div">Passing Score: 60%</div>
      <div className="btn-div">
        <button
          className="btn btn-primary first-btn"
          onClick={() => goToQuestions()}
        >
          Play Again
        </button>
        <button
          className="btn btn-primary second-btn"
          onClick={() => goToHome()}
        >
          Home
        </button>
      </div>
    </div>
  );
}
