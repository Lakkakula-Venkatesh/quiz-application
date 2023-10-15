import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Question from "./components/Question";
import Result from "./components/Result";

function App() {
  const [questionParams, setQuestionParams] = React.useState({});
  const [score, setScore] = useState(0);
  const [time, setTime] = useState("");

  const setParamsAndStartQuiz = (params, callback) => {
    setQuestionParams(params);
    callback();
  };

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setQuizParams={(params, callback) =>
                  setParamsAndStartQuiz(params, callback)
                }
              />
            }
          />
          <Route
            path="/question"
            element={
              <Question
                questionParams={questionParams}
                updateScore={score => setScore(score)}
                updateTime={e => setTime(e)}
              />
            }
          />
          <Route
            path="/result"
            element={
              <Result
                score={score}
                updateScore={() => setScore(0)}
                questionParams={questionParams}
                time={time}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
