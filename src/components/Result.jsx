import { useNavigate } from "react-router-dom";

export default function Result({ score, updateScore }) {
  const navigate = useNavigate();
  const goToHome = () => {
    updateScore();
    navigate("/");
  };
  return (
    <>
      <div>Score: {score}</div>
      <button onClick={() => goToHome()}>Home</button>
    </>
  );
}
