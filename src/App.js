import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Question from "./components/Question";
import Result from "./components/Result";

function App() {
  const [questionParams, setQuestionParams] = React.useState({});
  const [score, setScore] = useState(0);

  const setParamsAndStartQuiz = (params, callback) => {
    setQuestionParams(params);
    callback();
  };
  return (
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
            />
          }
        />
        <Route
          path="/result"
          element={<Result score={score} updateScore={() => setScore(0)} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
