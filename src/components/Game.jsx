import { useState } from "react";
import { useEffect } from "react";
import Board from "./Board";

export default function Game() {

    const[score,setScore] = useState(0);

    useEffect(() => {
    }, [])


    return (
        <div className="game">
            <div className="score">
                Score: {score}
            </div>
            <Board size={10} delay={700} updateScore={(score) => {setScore(score);console.log(score)}}/>
        </div>
    )
}