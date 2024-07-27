"use client";
import { useState, useEffect, useCallback } from "react";

export default function ArrowUp() {
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
  const [gameStatus, setGameStatus] = useState("start");

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
    setGameStatus("cancel");
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
    setGameStatus("start");
  };

  const restartGame = () => {
    startGame();
  };

  const checkInput = useCallback(
    (event) => {
      // Prevent the default action of arrow keys (scrolling)
      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
      }
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
          setGameStatus("restart");
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
    <main className="container mx-auto my-5 p-4 sm:px-6 lg:px-8">
      <section className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-center gap-4 mb-4">
          {typedArrows.map((arrow, index) => (
            <span
              key={index}
              className={`arrow ${
                index === currentArrowIndex ? "border-blue-500" : ""
              } ${index < currentArrowIndex ? "bg-green-200" : ""} ${
                index === currentArrowIndex && errorMessage ? "bg-red-200" : ""
              } p-4 text-2xl rounded-full border-2 border-transparent transition-all duration-300`}
              aria-label={`Arrow ${arrow}`}
            >
              {arrow}
            </span>
          ))}
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="p-3 border rounded-lg w-full text-lg"
            id="arrowInput"
            placeholder="Type the arrows..."
            disabled={!gameActive}
            aria-label="Type the arrows"
          />
        </div>
        <button
          className="bg-gray-800 text-white py-3 px-6 rounded-lg w-full text-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
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
        <div className="mt-4 text-center text-lg font-medium" id="timer">
          Time: {timeElapsed.toFixed(2)}s
        </div>
        <div className="text-center text-lg font-medium mt-2" id="accuracy">
          Accuracy: {accuracy.toFixed(2)}%
        </div>
        <div
          className="text-red-500 text-center mt-2 text-lg font-medium"
          id="errorMessage"
        >
          {errorMessage}
        </div>
      </section>
      <section className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <ul className="list-none p-0">
          {leaderboard.map((entry, index) => (
            <li key={index} className="border-b py-3 text-lg font-medium">
              Time: {entry.time.toFixed(2)}s <br /> Accuracy:{" "}
              {entry.accuracy.toFixed(2)}%
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
