import { useState } from "react";
import { useEffect } from "react";
import useInterval from 'use-interval'
import Block from "./Block";
import TextRenderer from "react-pixel-text-renderer";

export default function Board(props) {

    const [snake, setSnake] = useState([new Block(0, 0)]);
    const [gameStatus, setGameStatus] = useState(1);
    const [snakeDirection, setSnakeDirection] = useState(0);
    const [snack, setSnack] = useState(new Block(0, 0));
    const [boardSize, setBoardSize] = useState(10);
    const [movementDelay, setMovementDelay] = useState(700);

    useEffect(() => {
        setBoardSize(props.size);
        setMovementDelay(props.delay);
        generateSnack();
    }, [])

    useEffect(() => {
        window.addEventListener('keydown', changeDirection, false);
        return () => {
            window.removeEventListener('keydown', changeDirection, false);
        }
    }, [snake])

    useInterval(() => {
        let newBlock;
        let inside = true;
        switch (snakeDirection) {
            case 0:
                if (snake[snake.length - 1].x < (boardSize - 1)) {
                    newBlock = new Block(snake[snake.length - 1].x + 1, snake[snake.length - 1].y);
                } else {
                    inside = false
                    gameOver();
                }
                break;
            case 1:
                if (snake[snake.length - 1].y < (boardSize - 1)) {
                    newBlock = new Block(snake[snake.length - 1].x, snake[snake.length - 1].y + 1);
                } else {
                    inside = false
                    gameOver();
                }
                break;
            case 2:
                if (snake[snake.length - 1].x > 0) {
                    newBlock = new Block(snake[snake.length - 1].x - 1, snake[snake.length - 1].y);
                } else {
                    inside = false
                    gameOver();
                }
                break;
            case 3:
                if (snake[snake.length - 1].y > 0) {
                    newBlock = new Block(snake[snake.length - 1].x, snake[snake.length - 1].y - 1);
                } else {
                    inside = false
                    gameOver();
                }
                break;
            default:
                break;
        }
        if (inside) {
            if (snack.isEqual(newBlock)) {
                setSnake([...snake, newBlock]);
                generateSnack();
                props.updateScore(snake.length);
            }
            else {
                setSnake([...snake.slice(1), newBlock])
            }
        }
    }, movementDelay);

    const generateSnack = () => {
        let snack;
        do {
            snack = new Block(Math.floor(Math.random() * (boardSize - 1)) + 1, Math.floor(Math.random() * (boardSize - 1)) + 1);
        } while (isSnackColliding(snack))
        setSnack(snack);
    }

    const isSnackColliding = (snack) => {
        for (let s in snake)
            if (snake[s].x === snack.x && snake[s].y === snack.y)
                return true;
        return false;
    }

    const changeDirection = async (key) => {
        switch (key.code) {
            case 'ArrowRight':
                setSnakeDirection(0);
                break;
            case 'ArrowDown':
                setSnakeDirection(1);
                break;
            case 'ArrowLeft':
                setSnakeDirection(2);
                break;
            case 'ArrowUp':
                setSnakeDirection(3);
                break;
            default:
                break;
        }
    }

    const gameOver = () => {
        setMovementDelay(null);
        setGameStatus(0);
        props.gameOver();
    }

    return (
        <div className='board-container'>
            <div className={gameStatus ? 'board' : 'board faded'}>
                <div className="snake-food" style={{ top: `${snack.y * 10}%`, left: `${snack.x * 10}%` }} />
                {
                    snake.map((s, id) =>
                        <div key={id} className="snake-block" style={{ top: `${s.y * 10}%`, left: `${s.x * 10}%` }}></div>
                    )
                }
            </div>
            {
                gameStatus === 0 ?
                    <div className="blink on-top">
                        <TextRenderer
                            color={[0, 128, 0]}
                            text={"GAME OVER"}
                            scale={9}
                            charSpaces={9}
                            animate={true}
                        />
                    </div>
                    :
                    null
            }
        </div>
    )
}