export default class Block {
    x = 0;
    y = 0;
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    isEqual(block) {
        return this.x===block.x && this.y===block.y;
    }
}