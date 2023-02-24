import { useState } from "react";
import { useEffect } from "react";
import Board from "./Board";
import TextRenderer from 'react-pixel-text-renderer';

export default function Game() {

    const [score, setScore] = useState(0);
    //const [gameMode, setGameMode] = useState(0);
    const [gameStatus, setGameStatus] = useState(0);

    useEffect(() => {
        setGameStatus(1);
    }, [])

    return (
        <div className="game">
            <div className="container">
                <div className="content">
                    <TextRenderer
                        color={[0, 128, 0]}
                        text={'SCORE'}
                        scale={5}
                        charSpaces={5}
                        animate={false}
                    />

                </div>
                <div className="content">
                    <TextRenderer
                        color={[0, 128, 0]}
                        text={score.toString()}
                        scale={5}
                        charSpaces={score.toString().length}
                        animate={false}
                    />
                </div>
            </div>
            <div>
                <Board size={10} delay={700} gameOver={() => setGameStatus(0)} updateScore={(score) => { setScore(score) }} />
            </div>
        </div>
    )
}