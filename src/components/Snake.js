import { useState } from "react"
import { useEffect } from "react"

export default class Snake {
    body = []
    direction = 0;

    changeDirection(dir) {
        this.direction = dir;
    }

    move() {

    }

    getBody() {
        this.body.map((s, id) =>
            <div key={id} className="snake-block" style={{ top: `${s.y * 10}%`, left: `${s.x * 10}%` }}></div>
        )
    }
}