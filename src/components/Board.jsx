import { useState } from "react";
import { useEffect } from "react";
import useInterval from 'use-interval'
import Block from "./Block";
import TextRenderer from "react-pixel-text-renderer";
import useSound from 'use-sound';
import sounds from '../sounds/8bit_game.mp3'

export default function Board(props) {

    const [snake, setSnake] = useState([new Block(0, 0)]);
    const [gameStatus, setGameStatus] = useState(1);
    const [snakeDirection, setSnakeDirection] = useState(0);
    const [snack, setSnack] = useState(null);
    const [boardSize, setBoardSize] = useState(10);
    const [movementDelay, setMovementDelay] = useState(null);
    const [countdown, setCountdown] = useState(3);

    const [play] = useSound(sounds, {
        sprite: {
            step: [26200, 400],
            point: [9300, 400],
            gameover: [22000, 1000],
        },
        interrupt: true,
        volume: 0.2
    });

    useEffect(() => {
        setTimeout(() => {
            setBoardSize(props.size);
            setMovementDelay(props.delay);
            generateSnack();
        }, 3000)
    }, [props])

    useEffect(() => {
        if (countdown > 0)
            setTimeout(() => setCountdown(countdown - 1), 1000);
    }, [countdown])

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
                play({ id: 'point' })
                setSnake([...snake, newBlock]);
                generateSnack();
                props.updateScore(snake.length);
            }
            else if (isBitingItself(newBlock)) {
                gameOver();
            } else {
                play({ id: 'step' });
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

    const isBitingItself = (newBlock) => {
        for (let s in snake) {
            if (snake[s].x === newBlock.x && snake[s].y === newBlock.y)
                return true;
        }
        return false;
    }

    const changeDirection = async (key) => {
        switch (key.code) {
            case 'ArrowRight':
                if (snakeDirection % 2 === 1)
                    setSnakeDirection(0);
                break;
            case 'ArrowDown':
                if (snakeDirection % 2 === 0)
                    setSnakeDirection(1);
                break;
            case 'ArrowLeft':
                if (snakeDirection % 2 === 1)
                    setSnakeDirection(2);
                break;
            case 'ArrowUp':
                if (snakeDirection % 2 === 0)
                    setSnakeDirection(3);
                break;
            default:
                break;
        }
    }

    const gameOver = () => {
        setMovementDelay(null);
        setGameStatus(0);
        play({ id: 'gameover' })
    }

    const snakeSkin = (idx, gameStatus) => {
        let skin = 'snake-body ';
        if (idx === snake.length - 1) {
            switch (snakeDirection) {
                case 0:
                    skin += 'snake-head-right';
                    break;
                case 1:
                    skin += 'snake-head-down';
                    break;
                case 2:
                    skin += 'snake-head-left';
                    break;
                case 3:
                    skin += 'snake-head-up';
                    break;
                default:
                    skin += 'snake-head-right';
                    break;
            }
        }
        if (gameStatus === 0) {
            skin += ' blink';
        }
        return skin;
    }

    return (
        <div className='board-container'>
            <div className={gameStatus ? 'board' : 'board faded'}>
                {
                    snack ?
                        <div className="snake-food" style={{ top: `${snack.y * 10}%`, left: `${snack.x * 10}%` }} />
                        :
                        null
                }
                {
                    snake.map((s, idx) =>
                        <div
                            key={idx}
                            className={snakeSkin(idx, gameStatus)}
                            style={{ top: `${s.y * 10}%`, left: `${s.x * 10}%` }}
                        />
                    )
                }
            </div>
            {
                countdown === 0 ?
                    gameStatus === 0 ?
                        <div className="on-top ">
                            <div className="center-container">
                                <div className="blink">
                                    <TextRenderer
                                        color={[0, 128, 0]}
                                        text={"GAME OVER"}
                                        scale={9}
                                        charSpaces={9}
                                        animate={true}
                                    />
                                </div>
                                <button className="custom-btn m30" onClick={() => window.location.reload(null)}>Back to menu</button>
                            </div>
                        </div>
                        :
                        <div />
                    :
                    <div className="on-top">
                        <div className="center-container">
                            <TextRenderer
                                color={[0, 128, 0]}
                                text={countdown.toString()}
                                scale={9}
                                charSpaces={1}
                                animate={false}
                            />
                        </div>
                    </div>
            }
        </div>
    )
}