/*
1) when u click any button game starts
2)first click ->level-1 and so on click++, button flash->which says which button to click to continue game if clicked wrong you willl get out
3)comput two arrays
    i)one is the array which needs to be clicked to stay in game
    ii)sec one is the one user clicks, even if we found one mismatch then we say user is out
    if complete seuqnece is matched level increases
*/

let gameSeq=[];
let userSeq=[];
let btns = ["yellow", "red", "purple", "green"];

let started= false;
let lvl=0, maxScore=0;

let h2=document.querySelector("h2");

document.addEventListener("keypress", function() {
    if(started === false) {
        console.log("Game started");
        started=true;
        levelUp();
    }
 })

 function btnFlash(btn) {
    btn.classList.add("flash");
    setTimeout(() => {
        btn.classList.remove("flash");
    }, 250);
 }

 function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(() => {
        btn.classList.remove("userFlash");
    }, 250);
 }

 function levelUp() {
    userSeq=[];//means we want user to click all the colors correct utill this seq
    //if all are correct then add new clr to level up
    //we are creating a new user sequence for every lvl
    lvl+=1;
    h2.innerText= `Level ${lvl}`;

    let random=Math.floor(Math.random()*3);
    let randClr=btns[random];
    let rand=document.querySelector(`.${randClr}`);
    gameSeq.push(randClr);//adding rand clr to sequence
    console.log(gameSeq)
    //choose any random btn
    btnFlash(rand);
 }

 let allBtns=document.querySelectorAll('.btn');

 function check(ind) {
    //curr level is the size of both sequences
    // let ind=lvl-1;

    if(userSeq[ind] === gameSeq[ind]) {
    //when all sequneces matches then inc lvl and generate new clr
        if(userSeq.length == gameSeq.length) {
            // levelUp();
            setTimeout(levelUp, 250);
        }
        
    } else {//use innerHTML beacuse we are using bold tag
        //if we are using innerText then it will display as plain text
        maxScore = Math.max(maxScore, lvl);
        h2.innerHTML=`Game over! Your score was <b>${lvl}</b>. <br>Your highest Score is <b>${maxScore}</b>. <br> Press any key to start.`
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function() {
            document.querySelector("body").style.backgroundColor = 'white';
        }, 250);
        reset();
    }
 }

function btnPress() {
    // console.log("Button was pressed");
    //this is button which we clicked
    let btnClick=this;
    userFlash(btnClick);

    userClr=btnClick.getAttribute("id");
    userSeq.push(userClr);

    check(userSeq.length-1);//sending index to check val with gameseq
}

for(btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq=[];
    userSeq=[];
    lvl=0;
}