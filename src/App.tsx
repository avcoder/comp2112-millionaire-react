import { useState, useEffect } from "react";
import feather from "feather-icons";
import "./App.css";
import { Html5Entities } from "html5entitieses6";
import { money as levels } from "./utils/money.ts";

const entities = new Html5Entities();

type Question = {
  type: "multiple";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: [string];
};

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState("");
  const [index, setIndex] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    function sortQ(questions: Question[]): Question[] {
      // @ts-expect-error Object.groupBy is relatively new
      const categorizedQs = Object.groupBy(
        questions,
        ({ difficulty }: { difficulty: string }) => difficulty
      );
      return [
        ...categorizedQs.easy,
        ...categorizedQs.medium,
        ...categorizedQs.hard,
      ];
    }

    async function getQuestions() {
      const res = await fetch("./trivia.json");
      const data = await res.json();
      const questions = sortQ(data.results);
      setQuestions([...questions]);
      setIndex(0);
    }

    getQuestions();

    // show data-feather icons
    feather.replace();
  }, []);

  useEffect(() => {
    if (index >= 0) {
      const q = questions[index];
      setCurrentQ(q.question);

      // shuffle answers
      const shuffledAnswers = [...q.incorrect_answers, q.correct_answer].sort(
        () => 0.5 - Math.random()
      );
      setAnswers([...shuffledAnswers]);
      setCategory(q.category);
    }
  }, [index, questions]);

  const decode = () => {
    console.log("decoding");
    return entities.decode(currentQ);
  };

  const getNextQ = () => {
    console.log("nextQ");
    setIndex((prevIndex) => prevIndex + 1);
  };

  const handleFinalAnswer = (finalAnswer: string) => {
    if (finalAnswer === questions[index].correct_answer) {
      getNextQ();
    }
  };

  return (
    <>
      <div id="app">
        <main>
          <div className="header">{category}</div>
          <h1 className="question">{decode()}</h1>

          <button
            id="a"
            className="item-a"
            onClick={() => handleFinalAnswer(answers[0])}
          >
            <span className="letter">A: </span>
            <span>{entities.decode(answers[0])}</span>
          </button>
          <button
            id="b"
            className="item-b"
            onClick={() => handleFinalAnswer(answers[1])}
          >
            <span className="letter">B: </span>
            <span>{entities.decode(answers[1])}</span>
          </button>
          <button
            id="c"
            className="item-c"
            onClick={() => handleFinalAnswer(answers[2])}
          >
            <span className="letter">C: </span>
            <span>{entities.decode(answers[2])}</span>
          </button>
          <button
            id="d"
            className="item-d"
            onClick={() => handleFinalAnswer(answers[3])}
          >
            <span className="letter">D: </span>
            <span>{entities.decode(answers[3])}</span>
          </button>
        </main>

        <aside>
          <section>
            <button id="fifty_fifty">
              <i data-feather="help-circle"></i>
            </button>
            <button id="ask_audience">
              <i data-feather="users"></i>
            </button>
            <button id="phone_friend">
              <i data-feather="phone-call"></i>
            </button>
          </section>

          <ul>
            {levels.map((level) => (
              <li className={index === level.level - 1 ? "active" : ""}>
                {level.level} - ${level.amount}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}

export default App;
