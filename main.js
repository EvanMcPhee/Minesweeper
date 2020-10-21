//This code was adapted from code provided by the couse instructor
window.addEventListener('load', main);

var time = 0;

/**
 * callback for the top button
 * - set the state to the requested size
 * - generate a solvable state
 * - render the state
 * 
 * @param {state} s 
 * @param {number} cols 
 * @param {number} rows 
 */
function button_cb(thegame, rows, cols) {
  if(rows < 14){
    thegame.init(rows,cols,10);
  } else {
    thegame.init(rows,cols,40);
  }
  startTime();
  render(thegame);
}

/**
 * creates enough cards for largest board (9x9)
 * registers callbacks for cards
 * 
 */
function prepare_dom(thegame) {
    const grid = document.querySelector(".grid");
    const nCards = 14 * 18 ; // max grid size
    console.log(nCards);
    for( let i = 0 ; i < nCards ; i ++) {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-cardInd", i);
      card.addEventListener("click", () => {
        card_click_cb(thegame, i);
      });
      card.addEventListener("contextmenu", () => {
        card_hold_cb(thegame,i);
      });
      grid.appendChild(card);
    }
}


/**
 * updates DOM to reflect current state
 * - hides unnecessary cards by setting their display: none
 * - adds "flipped" class to cards that were flipped
 * 
 * @param {object} s 
 */
function render(thegame) {
    const grid = document.querySelector(".grid");
    grid.style.gridTemplateColumns = `repeat(${thegame.ncols}, 1fr)`;
    list = thegame.getRendering();
    stat = thegame.getStatus();
    document.querySelector(".flagCount").innerHTML = stat.nmines - stat.nmarked;
    fullrender = "";
    for(let i = 0; i < list.length; i++){
      fullrender = fullrender += list[i];
    }
    for( let i = 0 ; i < grid.children.length ; i ++) {
      const card = grid.children[i];
      const ind = Number(card.getAttribute("data-cardInd"));
      if( ind >= thegame.nrows * thegame.ncols) {
        card.style.display = "none";
      }
      else {
      card.style.display = "block";
      switch(fullrender[ind]){
        case "H":
          stripClasses(card);
          card.classList.add("hidden");
          break;
        case "F":
          stripClasses(card)
          card.classList.add("flag");
          break;
        case "M":
          stripClasses(card)
          card.classList.add("mine");
          break;
        case "0":
          stripClasses(card)
          card.classList.add("zero");
          break;
        case "1":
          stripClasses(card)
          card.classList.add("one");
          break;
        case "2":
          stripClasses(card)
          card.classList.add("two");
          break;
        case "3":
          stripClasses(card)
          card.classList.add("three");
          break;
        case "4":
          stripClasses(card)
          card.classList.add("four");
          break;
        case "5":
          stripClasses(card)
          card.classList.add("five");
          break;
        case "6":
          stripClasses(card)
          card.classList.add("six");
          break;
        case "7":
          stripClasses(card)
          card.classList.add("seven");
          break;
        case "8":
          stripClasses(card)
          card.classList.add("eight");
          break;
        default:
          console.log("How did you get here?")
          console.log(fullrender[i]);
      }
        
    }
    }
  }
   
function stripClasses(card){
  card.classList.remove("hidden");
  card.classList.remove("flag");
  card.classList.remove("mine");
  card.classList.remove("zero");
  card.classList.remove("one");
  card.classList.remove("two");
  card.classList.remove("three");
  card.classList.remove("four");
  card.classList.remove("five");
  card.classList.remove("six");
  card.classList.remove("seven");
  card.classList.remove("eight");
}

/**
 * callback for clicking a card
 * - toggle surrounding elements
 * - check for winning condition
 * @param {state} s 
 * @param {HTMLElement} card_div 
 * @param {number} ind 
 */
function card_click_cb(thegame, ind) {
    const col = ind % thegame.ncols;
    const row = Math.floor(ind / thegame.ncols);
    thegame.uncover(row,col);
    render(thegame);
    // check if we won and activate overlay if we did
    
    
    if(thegame.getStatus().exploded){
      stopTimer();
      document.querySelector(".big").innerHTML = "You Lost";
      document.querySelector("#overlay").classList.toggle("active");
      
    } else if(thegame.getStatus().done){
      stopTimer();
      document.querySelector(".big").innerHTML = "You Win!";
      document.querySelector("#overlay").classList.toggle("active");
    }
    
  }

function card_hold_cb(thegame,ind){
  const col = ind % thegame.ncols;
  const row = Math.floor(ind / thegame.ncols);
  thegame.mark(row,col);
  render(thegame);
}
  
function main(){
     // get browser dimensions - not used in thise code
    let html = document.querySelector("html");
    console.log("Your render area:", html.clientWidth, "x", html.clientHeight)

    let thegame = new MSGame();
  
     // register callbacks for buttons
    document.querySelectorAll(".menuButton").forEach((button) =>{
        [rows,cols] = button.getAttribute("data-size").split("x").map(s=>Number(s));
        button.innerHTML = `${rows} &#x2715; ${cols}`
        button.addEventListener("click", button_cb.bind(null, thegame, rows, cols));
    });

    // callback for overlay click - hide overlay and regenerate game
    document.querySelector("#overlay").addEventListener("click", () => {
        document.querySelector("#overlay").classList.remove("active");
        button_cb(thegame,thegame.nrows,thegame.ncols)
        render(thegame); 
    });
    prepare_dom(thegame);
    // simulate pressing 4x4 button to start new game
    button_cb(thegame, 8, 10);


}

function startTime(){
    if(time != 0){
      stopTimer();
    }
    time = 0;
    var interval;
    timeinterval = setInterval(function(){
        time++;
        document.querySelectorAll(".timeCount")[0].innerHTML = time;
        document.querySelectorAll(".timeCount")[1].innerHTML = time;
    },1000);
}

function stopTimer(){
    clearInterval(timeinterval);
    time = 0;
}

