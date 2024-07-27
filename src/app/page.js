"use client";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const arrows = ["↑", "↓", "←", "→"];
  const [typedArrows, setTypedArrows] = useState([]);
  const [currentArrowIndex, setCurrentArrowIndex] = useState(0);
  const [totalKeyPresses, setTotalKeyPresses] = useState(0);
  const [correctKeyPresses, setCorrectKeyPresses] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [leaderboard, setLeaderboard] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [gameStatus, setGameStatus] = useState("start"); // Manage game button state

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setTimeElapsed((new Date() - startTime) / 1000);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameActive, startTime]);

  const startGame = () => {
    const newTypedArrows = Array.from(
      { length: 10 },
      () => arrows[Math.floor(Math.random() * arrows.length)]
    );
    setTypedArrows(newTypedArrows);
    setCurrentArrowIndex(0);
    setTotalKeyPresses(0);
    setCorrectKeyPresses(0);
    setGameActive(true);
    setStartTime(new Date());
    setTimeElapsed(0);
    setErrorMessage("");
    setGameStatus("cancel"); // Change button to Cancel
  };

  const cancelGame = () => {
    setTypedArrows([]);
    setCurrentArrowIndex(0);
    setTotalKeyPresses(0);
    setCorrectKeyPresses(0);
    setGameActive(false);
    setStartTime(null);
    setTimeElapsed(0);
    setAccuracy(100);
    setErrorMessage("");
    setGameStatus("start"); // Change button to Start
  };

  const restartGame = () => {
    startGame(); // Start a new game, which will also update the gameStatus
  };

  const checkInput = useCallback(
    (event) => {
      if (!gameActive) return;

      setTotalKeyPresses((prev) => prev + 1);

      const arrowKeyMap = {
        ArrowUp: "↑",
        ArrowDown: "↓",
        ArrowLeft: "←",
        ArrowRight: "→",
      };

      const typedArrow = arrowKeyMap[event.key];
      if (!typedArrow) return;

      const currentArrow = typedArrows[currentArrowIndex];
      const arrowElements = document.querySelectorAll(".arrow");

      if (typedArrow === currentArrow) {
        arrowElements[currentArrowIndex].classList.remove("current");
        arrowElements[currentArrowIndex].classList.add("correct");
        setCurrentArrowIndex((prev) => prev + 1);
        setCorrectKeyPresses((prev) => prev + 1);
        setErrorMessage("");

        if (currentArrowIndex + 1 === typedArrows.length) {
          const timeTaken = (new Date() - startTime) / 1000;
          setGameActive(false);
          setGameStatus("restart"); // Show Restart button
          setLeaderboard((prev) => [
            ...prev,
            {
              time: timeTaken,
              accuracy: ((correctKeyPresses + 1) / (totalKeyPresses + 1)) * 100,
            },
          ]);
        }
      } else {
        arrowElements[currentArrowIndex].classList.add("wrong");
        setErrorMessage("Wrong arrow!");
      }

      setAccuracy(((correctKeyPresses + 1) / (totalKeyPresses + 1)) * 100);
    },
    [
      gameActive,
      typedArrows,
      currentArrowIndex,
      startTime,
      totalKeyPresses,
      correctKeyPresses,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", checkInput);
    return () => {
      window.removeEventListener("keydown", checkInput);
    };
  }, [checkInput]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <header className="bg-gray-800 text-white text-center py-3 w-full">
        <h1 className="text-3xl font-bold">Arrow Up</h1>
      </header>
      <main className="container mx-auto my-5 p-4">
        <section className="bg-white shadow-md rounded p-4 mb-5">
          <div className="flex justify-center mb-4" id="arrowContainer">
            {typedArrows.map((arrow, index) => (
              <span
                key={index}
                className={`arrow ${
                  index === currentArrowIndex ? "current" : ""
                } ${index < currentArrowIndex ? "correct" : ""} ${
                  index === currentArrowIndex && errorMessage ? "wrong" : ""
                }`}
              >
                {arrow}
              </span>
            ))}
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="p-2 border rounded w-full"
              id="arrowInput"
              placeholder="Type the arrows..."
              disabled={!gameActive}
            />
          </div>
          <button
            className="bg-gray-800 text-white py-2 px-4 rounded w-full"
            onClick={
              gameStatus === "start"
                ? startGame
                : gameStatus === "cancel"
                ? cancelGame
                : restartGame
            }
          >
            {gameStatus === "start"
              ? "Start Game"
              : gameStatus === "cancel"
              ? "Cancel"
              : "Restart"}
          </button>
          <div className="mt-3 text-center" id="timer">
            Time: {timeElapsed.toFixed(2)}s
          </div>
          <div className="text-center mt-2" id="accuracy">
            Accuracy: {accuracy.toFixed(2)}%
          </div>
          <div className="text-red-500 text-center mt-2" id="errorMessage">
            {errorMessage}
          </div>
        </section>
        <section className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-3">Leaderboard</h2>
          <ul className="list-none p-0" id="leaderboard">
            {leaderboard.map((entry, index) => (
              <li key={index} className="border-b py-2">
                Time: {entry.time.toFixed(2)}s<br /> Accuracy:{" "}
                {entry.accuracy.toFixed(2)}%
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="bg-gray-800 text-white text-center py-3 w-full">
        <p>&copy; 2024 Arrower. All rights reserved.</p>
      </footer>
      <style jsx>{`
        .arrow {
          font-size: 2rem;
          margin: 0 0.5rem;
          padding: 10px;
          border-radius: 50%;
          border: 2px solid transparent;
          display: inline-block;
        }

        .arrow.current {
          border-color: blue;
        }

        .arrow.correct {
          background-color: lightgreen;
        }

        .arrow.wrong {
          background-color: lightcoral;
        }
      `}</style>
    </div>
  );
}
