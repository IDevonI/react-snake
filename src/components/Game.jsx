import { useState } from "react";
import { useEffect } from "react";
import Board from "./Board";
import TextRenderer from 'react-pixel-text-renderer';
import useSound from 'use-sound';
import sounds from '../sounds/8bit_game.mp3'

export default function Game() {

    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState(0);

    useEffect(() => {

    }, [])

    const [play] = useSound(sounds, {
        sprite: {
            start: [3500, 3000]
        },
        interrupt: true,
        volume: 0.2
    });

    return (
        <div className="game">
            {
                gameStatus ?
                    <>
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
                            <Board size={10} delay={700} updateScore={(score) => setScore(score)} backToMenu={() => setGameStatus(0)} />
                        </div>
                    </>
                    :
                    <button className="custom-btn" onClick={() => { setGameStatus(1); play({ id: 'start' }) }}>Play</button>
            }
        </div>
    )
}