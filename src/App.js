import { useCallback, useEffect, useState } from "react";
import "./App.css";

import blue from "./Images/blue-candy.png";
import green from "./Images/green-candy.png";
import orange from "./Images/orange-candy.png";
import purple from "./Images/purple-candy.png";
import red from "./Images/red-candy.png";
import yellow from "./Images/yellow-candy.png";
import blank from "./Images/blank.png";

const width = 8;
const minCombinationWidth = 3;
const candyColors = [blue, red, green, orange, yellow, purple];

function App() {
  const [currentColorBoard, setCurrentColorBoard] = useState();

  const [draggedCandy, setDraggedCandy] = useState("");
  const [dropCandy, setDropCandy] = useState("");
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isDragging, setIsDragging] = useState(true);

  useEffect(() => {
    createBoard();
    // getTotalNumberOfCombinationFromWidth();
  }, []);

  // const getTotalNumberOfCombinationFromWidth = () => {
  //   let currentIndex = 0;
  //   while (!combinationArray.includes(minCombinationWidth)) {
  //     combinationArray.push((width - currentIndex) / 2);
  //     currentIndex = currentIndex + 2;
  //   }
  //   console.log("getTotalNumberOfCombinationFromWidth", combinationArray);
  // };

  const isSameIndexInRowAndColumn = (
    rowColorColumnCombination,
    columnFirstIndex
  ) => {
    console.log(
      "hello row",
      rowColorColumnCombination,
      columnFirstIndex,
      rowColorColumnCombination.includes(columnFirstIndex)
    );
    return rowColorColumnCombination.includes(columnFirstIndex);
  };

  const newColorCombinationChecker = useCallback(() => {
    let removeArray = [];
    for (let i = 0; i < width * width; i++) {
      const baseColor = currentColorBoard[i];
      const temp = [i];
      const tempRow = [i];

      for (let j = i + width; j < width * width; j = j + width) {
        if (baseColor === currentColorBoard[j]) {
          temp.push(j);
        } else {
          break;
        }
      }

      for (let k = i + 1; k < width * width; k++) {
        if (baseColor === currentColorBoard[k]) {
          tempRow.push(k);
        } else {
          break;
        }
      }

      if (tempRow.length >= minCombinationWidth) {
        tempRow.forEach((i) => (currentColorBoard[i] = blank));
        // removeArray = removeArray.concat(tempRow);
        setScoreDisplay((scoreDisplay) => scoreDisplay + tempRow.length);
        console.log({ removeArray });
      }

      if (temp.length >= minCombinationWidth) {
        temp.forEach((i) => (currentColorBoard[i] = blank));
        setScoreDisplay((scoreDisplay) => scoreDisplay + temp.length);

        // removeArray = removeArray.concat(temp);
        console.log({ removeArray });
      }
    }
    // removeArray.forEach((attr) => {
    //   currentColorBoard[attr] = blank;
    // });
  }, [currentColorBoard]);

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i < 64 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorBoard[i] === blank) {
        let randomColor =
          candyColors[Math.floor(Math.random() * candyColors.length)];
        currentColorBoard[i] = randomColor;
      }

      if (currentColorBoard[i + width] === blank) {
        currentColorBoard[i + width] = currentColorBoard[i];
        currentColorBoard[i] = blank;
      }
    }
  }, [currentColorBoard]);

  const rearrangeBoard = useCallback(() => {
    console.log("rearrange is called");

    if (draggedCandy >= 0 && dropCandy >= 0) {
      const tempColorBoard = currentColorBoard.slice();
      const temp = tempColorBoard[draggedCandy];
      tempColorBoard[draggedCandy] = tempColorBoard[dropCandy];
      tempColorBoard[dropCandy] = temp;
      setCurrentColorBoard(tempColorBoard);
      setMoves((moves) => moves + 1);
    }
  }, [draggedCandy, dropCandy, currentColorBoard]);

  useEffect(() => {
    const timer = setInterval(() => {
      newColorCombinationChecker();
      moveIntoSquareBelow();
      setCurrentColorBoard([...currentColorBoard]);
    }, 100);

    return () => clearInterval(timer);
  }, [
    newColorCombinationChecker,
    moveIntoSquareBelow,
    setCurrentColorBoard,
    currentColorBoard,
  ]);

  const createBoard = () => {
    const randomColorArrangement = [];
    console.log("colors", currentColorBoard);
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }

    setCurrentColorBoard(randomColorArrangement);
  };

  const dragStart = (e) => {
    console.log(e.target.getAttribute("data-id"), "dragStart");
    e.target.style.transition = "all 2s";
    setDraggedCandy(Number(e.target.getAttribute("data-id")));
  };

  console.log("change");
  const dragEnd = (e) => {
    console.log(e.target.getAttribute("data-id"), "dragEnd");
    e.target.style.transition = "all 2s";

    const validMoves = [
      draggedCandy - 1,
      draggedCandy - width,
      draggedCandy + 1,
      draggedCandy + width,
    ];

    const validMove = validMoves.includes(dropCandy);

    console.log(validMove, validMoves, dropCandy, draggedCandy, "hello");

    validMove && rearrangeBoard();
    setIsDragging(true);
  };

  const drop = (e) => {
    console.log(e.target.getAttribute("data-id"), "drop");
    setDropCandy(Number(e.target.getAttribute("data-id")));
  };

  return (
    <div className="app">
      <div className="game-board">
        {currentColorBoard?.map((color, index) => (
          <div className={`candy-image-container`}>
            <img
              className={` ${isDragging ? "beginDrag" : "readyDrop"}`}
              onDragOver={(e) => {
                e.preventDefault();
                console.log("drag is over");
                setIsDragging(false);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                console.log("drag is enter");
              }}
              onDragLeave={(e) => {
                e.preventDefault();

                console.log("drag is leave");
              }}
              onDragStart={dragStart}
              onDragEnd={dragEnd}
              onDrop={drop}
              draggable={true}
              data-id={index}
              alt={index}
              key={index}
              src={color}
              // style={{ backgroundColor: color }}
            />
          </div>
        ))}
      </div>
      <div className="score-board">
        <h2>Score:{scoreDisplay}</h2>
        <h2>Moves:{moves}</h2>
      </div>
    </div>
  );
}

export default App;
