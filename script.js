//const word="Practice, writing skills with paragraph typing exercises. This practice lesson consists of short paragraphs about interesting subjects".split(' ');
const word="The journey, which I remember well, was very pleasant. I made friends with many people on the train. One lady gave me a box of shells. My father made holes in these so that I could string them, and for a long time they kept me happy and contented. The conductor, too, was kind.".split(' ');

let wpm_Data=[];
let seconds=[];
const inputField=document.querySelector('#words');
const game=document.querySelector('#game');
const remainTime=document.querySelector('.left_time');
const reset=document.querySelector('.reset');
const wpm_result=document.querySelector('.wpm_speed');
const acc_result=document.querySelector('.acc');
const chart_result=document.querySelector('.chart');
const graph=document.querySelector('.chart_graph');

const setGameSetting=document.querySelector('.set-game-setting');
const setGameTime=document.querySelector('.set-game-time');
let intialTime=document.querySelector('.intial-Time');


let gameTime=15;
let timeStart=true;
let endtime;
const addClass=(el,name)=>{
    el.className+=' '+name;
}
const removeClass=(el,name)=>{
    el.className =el.className.replace(name,'');
}

const newGame=function(){
    for(let i=1;i<=gameTime;i++){
        seconds.push(i);
    }
    remainTime.innerHTML=gameTime+'';
    inputField.innerHTML='';
    word.forEach(el=>{
       inputField.innerHTML+=`<div class='word'><span class="letter">${el.split('').join('</span><span class="letter">')}</span></div>`;
    })
    const _word=document.querySelector('.word');
    const letter=document.querySelector('.letter');
    
    addClass(_word,'current');
    addClass(letter,'current');

    //set the curser
    
    const nextLetter=document.querySelector('.letter.current');

     const cursor=document.getElementById('cursor');
        cursor.style.top=nextLetter.getBoundingClientRect().top + 'px';
        cursor.style.left=nextLetter.getBoundingClientRect().left + 'px';

}

setGameTime.addEventListener('click',(e)=>{
    if(intialTime){
        intialTime.style.color='#ffff';
    }
    intialTime=e.target;
    // console.log(e.target)
    e.target.style.color='#FC626A';
    gameTime=Number(e.target.textContent);
    //for the chart seconds
    seconds=[];
    for(let i=1;i<=gameTime;i++){
        seconds.push(i);
    }
    remainTime.textContent=gameTime;
})
 
function getResult(gameTime) {
    const wordsTotal = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = wordsTotal.indexOf(lastTypedWord) + 1;
    const typedWords = wordsTotal.slice(0, lastTypedWordIndex);
     
    const correctWords = typedWords.filter(word => {
      const letters = [...word.children];
      const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
      const correctLetters = letters.filter(letter => letter.className.includes('correct'));
      return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
     
     return{ 
        wpm:Math.round(correctWords.length / (gameTime/60)),
        acc:(correctWords.length/typedWords.length)*100 
    }
}
const gameOver=()=>{
    //   gameBox.innerHTML='';
    const result=  getResult(gameTime);
    // console.log(result.wpm, result.acc);
    // console.log(wpm_Data);
    wpm_result.textContent=result.wpm;
    acc_result.textContent=Math.round(result.acc?result.acc:'0')+'%'; 
    graph.innerHTML='';
    graph.innerHTML=' <canvas id="myChart"></canvas>'
    createChart(seconds,wpm_Data);
    remainTime.style.display='none';
    game.style.display='none';
    chart_result.style.display='flex';
    setGameSetting.style.display='none';
} 

game.addEventListener('keyup',(e)=>{
   
     if(timeStart){
        timeStart=false;
        let time=gameTime
        endtime= setInterval(()=>{
       remainTime.innerHTML=time--;
       wpm_Data.push(getResult(gameTime-time).wpm)
       if(time<0){
           clearInterval(endtime);
           gameOver();
        return;
       }
    },1000)  
}
    // console.log(e);
    const key=e.key;
    const currentWord=document.querySelector('.word.current');
    const currentLetter=document.querySelector('.letter.current');
    // (?) check null
    const expected=currentLetter?.innerHTML||' ';
    const isLetter=key.length==1 && key!=' ';
    const isSpace=key===' ';
    const isBackspace = key === 'Backspace';
    // console.log(isBackspace)
    const isFirstLetter=currentLetter===currentWord.firstChild;
    // console.log(key,expected)

    if(isLetter){
        if(currentLetter){
             addClass(currentLetter,key===expected?'correct':'incorrect')
              removeClass(currentLetter,'current');
              //Check in word is letter is a last letter if true change the word
              if(currentLetter.nextSibling){
              addClass(currentLetter.nextSibling,'current')
              }
        }
        else{
            const incorrectLetter=document.createElement('span');
            incorrectLetter.innerHTML=key;
            incorrectLetter.className='letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }
    if(isSpace){
        if(expected !=' '){
            const lettersToInvalidate=[...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter=>{
                addClass(letter,'incorrect');
            }); 

        }
        removeClass(currentWord,'current');
        addClass(currentWord.nextSibling,'current');
        if(currentLetter){ 
            removeClass(currentLetter,'current');
        }
            addClass(currentWord.nextSibling.firstChild,'current');

    }
    if(isBackspace){
        if(currentWord==inputField.firstChild && currentLetter==currentWord.firstChild){

        }
        else if(currentLetter && isFirstLetter){
            //make prev wrod current , last letter current
            removeClass(currentWord,'current'); 
            addClass(currentWord.previousSibling,'current');
            removeClass(currentLetter,'current');
            addClass(currentWord.previousSibling.lastChild,'current');
            removeClass(currentWord.previousSibling.lastChild,'incorrect')
            removeClass(currentWord.previousSibling.lastChild,'correct');
        }
        if(currentLetter && !isFirstLetter){
            //move back one
            removeClass(currentLetter,'current');
            addClass(currentLetter.previousSibling,'current');
            removeClass(currentLetter.previousSibling,'incorrect');
            removeClass(currentLetter.previousSibling,'correct');
        }

        //word last position
        if(!currentLetter){
            addClass(currentWord.lastChild,'current');
            removeClass(currentWord.lastChild,'incorrect');
            removeClass(currentWord.lastChild,'correct');
        }
    }

    //MOVE line / words
    if(currentWord.getBoundingClientRect().top>235){
         const words=document.getElementById('words');
         const margin=parseInt(words.style.marginTop || '0px');
         words.style.marginTop=(margin-35)+'px';
    }

    //move the cursor
    //The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
    const nextWord=document.querySelector('.word.current');
    const nextLetter=document.querySelector('.letter.current');

     const cursor=document.getElementById('cursor');
     if(nextLetter){
        cursor.style.top=nextLetter.getBoundingClientRect().top + 'px';
        cursor.style.left=nextLetter.getBoundingClientRect().left + 'px';
     }
     else{
        cursor.style.top=nextWord.getBoundingClientRect().top+ 6 + 'px';
        cursor.style.left=nextWord.getBoundingClientRect().right + 'px';
     }
})

reset.addEventListener('click',(e)=>{
   
    //clearInterval before start a new game 
    wpm_Data=[];
    seconds=[];
    clearInterval(endtime);
    timeStart=true;
    remainTime.style.display='block';
    game.style.display='block';
    chart_result.style.display='none';
    setGameSetting.style.display='flex';
    newGame();

})

const createChart=(seconds,wpm_Data)=>{
       // Sample WPM data
    //    const wpmData = [60, 70, 80, 85, 90, 75, 100, 95, 110, 105, 120, 115];
    const wpmData = [...wpm_Data];

       // Chart.js configuration
       const ctx = document.getElementById('myChart').getContext('2d');
       const chart = new Chart(ctx, {
         type: 'line',
         data: {
           labels:[...seconds],
           datasets: [{
             label: 'WPM',
             data: wpmData,
             borderColor: '#FC626A',
             fill: false,
             tension: 0.2
           }]
         },
         options: {  
           responsive: true,
           maintainAspectRatio:false, 
           scales: {
             y: {
               beginAtZero: true,
               title: {
                 display: true,
                 text: 'Word Per Minutes'
               }
             }
           }
           
         }
       });
}
   
newGame();