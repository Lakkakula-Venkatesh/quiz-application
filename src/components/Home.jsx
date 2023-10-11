import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ajax from "superagent";

export default function Home({ setQuizParams }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const countRef = React.createRef("");
  const categoryRef = React.createRef("");
  const difficultyRef = React.createRef("");
  const typeRef = React.createRef("");

  const categoryAPI = process.env.REACT_APP_CATEGORY_API;

  useEffect(() => {
    ajax.get(categoryAPI).then(res => {
      setCategories(res.body.trivia_categories);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (countRef.current.value === "") {
      alert("Please Select number of questions between 5 & 20");
      return;
    }
    setQuizParams(
      {
        amount: countRef.current.value,
        category: categoryRef.current.value,
        difficulty: difficultyRef.current.value,
        type: typeRef.current.value,
        token: (Math.random() + 1).toString(36).substring(2)
      },
      () => navigate("/question")
    );
  };

  return (
    <>
      <h1>Welcome to the most Interactive Quiz ever seen!</h1>
      <input
        type="number"
        name="amount"
        id="question-count"
        ref={countRef}
        min={5}
        max={20}
        defaultValue={5}
      />
      <br />
      <select name="category" id="category" ref={categoryRef}>
        {categories.map((category, index) => (
          <option key={index} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <br />
      <select name="difficulty" id="difficulty" ref={difficultyRef}>
        <option value="easy">Basic</option>
        <option value="medium">Moderate</option>
        <option value="hard">Difficult</option>
      </select>
      <br />
      <select name="type" id="type" ref={typeRef}>
        <option value="boolean">True/False</option>
        <option value="multiple">Multiple Choice</option>
      </select>

      <button type="submit" onClick={handleSubmit}>
        Start Quiz
      </button>
    </>
  );
}
