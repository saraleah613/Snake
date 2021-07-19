let g;
let appleX;
let appleY;
let rndX, rndY;
let scoreApples = 0;
let scr;
let interval;
let canPlay = true;
//localStorage.setItem('highScore', 0);
class Apple {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.color = 'green';
        this.radius = 12
    }
    draw(ctx) {
        ctx.beginPath()
        // עיגול שלם
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
    clear() {
    }
}
class b {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.color = 'white';
        this.radius = 12
    }
    drawClose(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
    clear(ctx) {
        ctx.clearRect(this.x - this.radius-1, this.y - this.radius-1, this.radius * 2+2, this.radius * 2+2)
    }
}
class Snake {
    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;
        this.color = 'red';
        this.radius = 12
        // אחד סגור מינוס אחד פתוח
        this.state = 1
        // ברירת מחדל שהולך שמאלה
        this.side = 37
        // שומר כמה תפוחים כבר אכל 
        this.applesEaten = 0
        //  מערך ששומר את הבטן של הנחש לכל חלק יש איקס ווואי
        this.index = 1;
        this.stm = [];
        this.stm[0] = (new b(this.x, this.y))
    }
    drawClose(ctx) {
        ctx.beginPath()
        // עיגול שלם
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
    drawOpen(ctx) {
        let start1;
        let start2;
        switch (this.side) {
            case 37:
                start1 = -0.25
                start2 = 1.25
                break;
            case 38:
                start1 = -0.25
                start2 = 0.25
                break;
            case 39:
                start1 = 0.25
                start2 = 0.75
                break;
            case 40:
                start1 = 0.75
                start2 = 1.25
                break;
        }
        ctx.fillStyle = this.color
        ctx.beginPath()
        //  חצי עיגול למטה 
        ctx.arc(this.x, this.y, this.radius, start1 * Math.PI, (start1 + 1) * Math.PI)
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        //  חצי עיגול למעלה 
        ctx.arc(this.x, this.y, this.radius, start2 * Math.PI, (start2 + 1) * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
    drawB(ctx) {
        for (let i = 1; i < this.index; i++) {
            this.stm[i].drawClose(ctx);
        }
    }
    clearB(ctx) {
        for (let i = 1; i < this.index; i++) {
            this.stm[i].clear(ctx);
        }
    }
    //////////////////////////
    clear(ctx) {
        ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2 , this.radius * 2 )
    }
    // כאשר לא נמצא בשורות של התפוח לא יכול ללכת
    // גבולות הלוח
    canNotgo() {
        if (this.x <= 2 || this.y <= 2 || this.x >= 798 || this.y >= 598) {
            loss();
        }
    }
    // בדיקה  - האם אפשר לעשות את זה או לא , האם זה יעבור בשורות בדיוק ,בלי לאכול חצי תפוח
    canChangeSide() {
        return this.x % 51 == 43 && this.y % 51 == 43
    }
    moveXY() {
        switch (this.side) {
            case 37: {
                this.x = this.x - 2
                this.stm[0].x = this.x
                for (let i = this.index - 1; i > 0; i--) {
                    this.stm[i].x = this.stm[i - 1].x;
                    this.stm[i].y = this.stm[i - 1].y
                }
                break;
            }
            case 38: {
                this.y = this.y - 2
                this.stm[0].y = this.y
                for (let i = this.index - 1; i > 0; i--) {
                    this.stm[i].x = this.stm[i - 1].x;
                    this.stm[i].y = this.stm[i - 1].y
                }

                break;
            }
            case 39: {
                this.x = this.x + 2
                this.stm[0].x = this.x

                for (let i = this.index - 1; i > 0; i--) {
                    this.stm[i].x = this.stm[i - 1].x;
                    this.stm[i].y = this.stm[i - 1].y
                }

                break;
            }
            case 40: {
                this.y = this.y + 2
                this.stm[0].y = this.y
                for (let i = this.index - 1; i > 0; i--) {
                    this.stm[i].x = this.stm[i - 1].x;
                    this.stm[i].y = this.stm[i - 1].y
                }
                break;
            }
        }
    }
}
class Game {
    constructor() {
        this.context = document.querySelector('#cnv').getContext('2d')
        this.width = 800
        this.heigth = 600
        this.nextSide = 0
        this.apples = []
        this.pm = new Snake(399, 298)
        this.pm.drawClose(this.context)
    }
    creatApple() {
        rndX = Math.floor(Math.random() * 780)
        rndY = Math.floor(Math.random() * 540)
        while (rndX % 51 != 43 || rndY % 51 != 43) {
            rndX = Math.floor(Math.random() * 780)
            rndY = Math.floor(Math.random() * 540)
        }
        appleX = rndX;
        appleY = rndY;
        let a = new Apple(rndX, rndY)
        a.draw(this.context)
        this.apples.push(a)
    }
    changePockman() {
        this.pm.state = this.pm.state * -1
    }
    changeSide(code) {
        if (this.pm.canChangeSide())
            this.pm.side = code
        else {
            this.nextSide = code
        }
    }
    eat() {
        this.pm.applesEaten++;
        scoreApples = this.pm.applesEaten;
        let xx = this.pm.x
        let yy = this.pm.y
        // בדיקת כיון הנחש
        switch (this.pm.side) {
            case 37: xx = this.pm.x + 24
                break;
            case 38: yy = this.pm.y + 24
                break;
            case 39: xx = this.pm.x - 24
                break;
            case 40: yy = this.pm.y - 24
                break;
        }
        //הוספת בטן
        this.pm.stm[this.pm.index] = new b(xx, yy)
        this.pm.index++;
        this.pm.stm[this.pm.index] = new b(xx, yy)
        this.pm.index++;
        this.pm.stm[this.pm.index] = new b(xx, yy)
        this.pm.index++;
        this.pm.stm[this.pm.index] = new b(xx, yy)
        this.pm.index++;
        this.pm.stm[this.pm.index] = new b(xx, yy)
        this.pm.index++;
        this.creatApple();
    }
    ///////////////////
    movePM() {
        this.pm.canNotgo();
        if (this.pm.x == rndX && this.pm.y == rndY || (this.pm.x >= (rndX - 1) && this.pm.x <= (rndX + 1) && this.pm.y >= (rndY - 1) && this.pm.y <= (rndY + 1))) {
            this.eat();
        }
        this.pm.clear(this.context);
        this.pm.clearB(this.context);
        this.pm.moveXY();
        this.pm.drawB(this.context);
        if (this.nextSide != 0 && this.pm.canChangeSide()) {
            this.pm.side = this.nextSide;
            this.nextSide = 0
        }
        if (this.pm.state == 1)
            this.pm.drawClose(this.context)
        else {
            this.pm.drawOpen(this.context)
        }
    }
}
function startGame() {
    g = new Game()
    document.querySelector('#score').innerHTML = `the high score is: ${localStorage.getItem('highScore')}`
    if(localStorage==null){
        localStorage.setItem('highScore', 0);
    }
    g.creatApple();
    window.addEventListener('keydown', () => {
        if (event.keyCode >= 37 && event.keyCode <= 40)
            g.changeSide(event.keyCode);
    })
    interval = setInterval(() => {
        g.changePockman();
    }, 200)
    loop()
}
function loop() {
    g.movePM()
    if (canPlay == true) {
        requestAnimationFrame(loop)
    }
}

function loss() {
    clearInterval(interval);
    canPlay = false;
    document.querySelector("body").innerHTML = "";
    let ddd = document.createElement('h1');
    //let sss= document.createElement('div');
    //sss.setAttribute('id', 'score')
    ddd.innerHTML = `you loss, sorry!       \n your score is ${g.pm.applesEaten}`;
    document.querySelector("body").appendChild(ddd);
   scr = scoreApples
    let highScore1 = localStorage.getItem('highScore')
    if (highScore1 < scr)
        localStorage.setItem('highScore', scr);
    console.log(localStorage);
    let sss = document.createElement('h2');
    sss.innerHTML=`the high score is: ${localStorage.getItem('highScore')}`
    document.querySelector("body").appendChild(sss);

 }
// function saveScore() {
//     //document.querySelector("body").innerHTML = "";
//     scr = scoreApples
//     let highScore1 = localStorage.getItem('highScore')
//     if (highScore1 < scr)
//         localStorage.setItem('highScore', scr);
//     console.log(localStorage);
//    // document.querySelector('#score').innerHTML = `the high score is: ${localStorage.getItem('highScore')}`
//    let sss = document.createElement('h2');
//     sss.innerHTML=`the high score is: ${localStorage.getItem('highScore')}`
//     document.querySelector("body").appendChild(sss);

//   // document.querySelector('#score').innerHTML = `the high score is: ${localStorage.getItem('highScore')}`
// }
