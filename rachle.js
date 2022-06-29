//rachle v1.2 29 June 2022 by aiyudot khom

//rachle is a word game that provides a new solution each day up to around March 2027
//It involves a user trying to guess a 5 letter word. They have up to 6 tries to pick it
//After each try, the user is told either if a letter is in the right place or whether the solution letter is closer to A or Z

//-----------------------------------------------------------

var words=[]; //array to store list of valid 5 letter words. The first 2300 are candidates for the solution

//get the list of valid 5 letter words and load it into the array "words"
function preload() {
  words = loadStrings('rachle.txt');
}

//-----------------------------------------------------------

var nletters=5; // puzzle is to find a 5 letter word
var nlevels=6; // there are 6 tries to solve the puzzle

var letter=0; //current letter
var level=0; //current level

var maxlevelforclues=nlevels; //set to nlevels for easiest game. Any number less makes it progressivly harder 

// constants for various states of the game
var playing=1; 
var gamewon=2; 
var gamelost=3; 
    
var state=playing; //initialise to playing

//the various states for each cell of the game (each level has one cell for each letter)
var trynotentered=1; //a letter has not been entered into the cell yet
var tryentered=2; //a letter has been entered into the cell, but the whole word has not been entered yet
var tryevaluated=3; //the word that this letter is part of has been entered (so this letter has been evaluated and found to not be correct)
var tryfound=4; //the letter has been evaluated as matching the correct letter

//data structures to store the guesses that are made
var tries_letter = []; //store the letters that are entered 
var tries_closeness = []; //record how close the letter is to correct letter
var tries_state = []; //record the state of this cell - one of 4 possible states

var keypressed=false; //flag to keep track of when valid keys from the keyboard have been entered
var kbchar=0; //stores the current valid key entered from the keyboard

var thisword; //stores the correct word

//colours used for the display of the puzzle
var backgroundcolour; 
var cellbackground; 
var cellborder; 
var foundbackground; 
var wrongbackground; 
var textcolour; 

//varliables to help display the puzzle
var canvasx; // x dimension of canvas; 
var canvasy; //y dimension of canvas; 
var xoff; //offset to draw block of cells
var yoff; 
var xspace; //multiplier to space the cells apart
var yspace; 
var cell; //size of each cell

var keyxoff; //position of keyboard in mobile device
var keyyoff; 
var keysize; //size of keys on mobile device
var keyspace; //space between keys
var nkeys; //max number of keys on a row of the mobile keyboard

var invalidword=false; //flag to record if a word entered is not a valid 5 letter word

let buttonHELP; //help button
let buttonSHARE; //share button
var sharetext; //share text

var gamenumber; //first game was on 1 Jan 2022 and numbers go up once per day

let isMobile; //flag to indicate if device is mobile or desktop

// variables for all the keys on a mobile device - QWRTY, return and backspace
let buttonA, buttonB, buttonC, buttonD, buttonE, buttonF, buttonG, buttonH, buttonI; 
let buttonJ, buttonK, buttonL, buttonM, buttonN, buttonO, buttonP, buttonQ, buttonR; 
let buttonS, buttonT, buttonU, buttonV, buttonW, buttonX, buttonY, buttonZ; 
let buttonRETURN, buttonBACKSPACE;  

let windowwidth, windowheight; //size of browser window
let wx=0.0; //xoffset used to ensure the game is centred on the browser window

let sharebuttonx, sharebuttony; //location of share button

let lastgamenumber; //stores the number of the last game played
let enteredwords=""; //string that stores words that have been entered
let lastenteredwords; //string that stores words that have been entered in a previous attempt at this game
let winningmessage=["Freaky", "Extraordinary", "Amazing", "Great work", "Good effort", "Phew"]; 

//-----------------------------------------------------------

//set up the program
function setup() {
  
  //get window dimensions
  windowwidth = window.innerWidth;
  windowheight = window.innerHeight;
  //print (windowwidth, windowheight); 
  //setup colours
  backgroundcolour=color(255, 255,255); 
  cellbackground=color (200); //was (79, 44, 82);
  cellborder=color(255, 218, 203); 
  foundbackground=color(27, 200, 27); 
  wrongbackground=color(255, 36, 29); 
  textcolour=color(79, 44, 82); 
  
  //find out if the user is using a mobile device
  isMobile = window.matchMedia("(any-pointer:coarse)").matches;
  //print("ismobile", isMobile); 
  
  if (isMobile) { //if device is mobile, then set up dimensions and set up mobile keyboard
    //set canvas dimensions
    xcanvas=320.0; 
    ycanvas=568.0; 
    //create canvas - the x dimension is the full width of the window
    //so that the puzzle can be centred horizontally
    createCanvas(int(windowwidth), int(ycanvas)); //display size
    background(backgroundcolour); 
    //define the size of the cells that store entered letters
    cell=40.0; 
    //define the space between cells
    xspace=0.1*cell; 
    yspace=0.25*cell;
    //if the window is larger than the canvas, then 
    //set wx to an offset so that the puzzle is centred horizontally
    if (windowwidth>xcanvas) wx=(windowwidth-xcanvas)/2.0; 
    //define the offsets for the grid of cells
    xoff=wx+(xcanvas - (cell*nletters) -(xspace*(float(nletters-1))))/2.0; 
    yoff=68.0; 
    //initilise the max number of keys on a row of the mobile keyboard
    nkeys=10; 
    //determine the x size of the keys of the mobile keyboard
    keysizex=xcanvas/(nkeys+1); 
    //determine the space between keys
    keyspace=(xcanvas-(keysizex*nkeys))/(float (nkeys-1)); //9 spaces between 10 keys 
    //get the offsets for the location of the keyboard
    keyxoff=wx+(xcanvas-keysizex*nkeys-keyspace*(nkeys-1))/2.0;
    keyyoff=yoff+(cell+yspace)*nlevels+yspace; 
    //determine the y size of the keyboard
    keysizey=(ycanvas-keyyoff-(keyspace*2))/3.0; 
    //print(keyxoff, keyyoff); 
    //display the keyboard
    setupkeyboard(); 
 
  } else { //set up display variables for a laptop/desktop device
    //define the canvas
    xcanvas=450.0; 
    ycanvas=700.0; 
    //create the canvas, the x dimension is the width of the dsiplay
    //so that the puzzle can be centred horizontally
    createCanvas(int(windowwidth), int(ycanvas)); 
    //define the cell size in the grid and spaces between cells
    cell=50.0; 
    xspace=0.1*cell; 
    yspace=0.25*cell;
    //if window is wider than canvas then define offset to centre puzzle horizontally
    if (windowwidth>xcanvas) wx=(windowwidth-xcanvas)/2.0; 
    //define x and y offsets for the puzzle grid
    xoff=wx+(xcanvas - (cell*nletters) -(xspace*(float(nletters-1))))/2.0; 
    yoff=68.0; 
  }
  
  //set up the help button to the top left of the puzzle
  buttonHELP = createButton('?');
  buttonHELP.position(wx,0);
  buttonHELP.size(cell*0.7, cell*0.7); 
  buttonHELP.mousePressed(showhelp); //run the showhelp function when pressed

  //ensure all the words in the word list are in upper case
  for (var i = 0 ; i < words.length; i++) { 
    words[i] = words[i].toUpperCase(); 
  }
  
  //create the data structures to store the game info
  for ( i=0; i<nlevels; i++) {
    tries_letter[i]=[]; //letters entered
    tries_closeness[i]=[]; //how close the letter is to the correct letter
    tries_state[i]=[]; //state of this try 
  }
    
  //initialise a game
  setupgame(); 
}

//-----------------------------------------------------------

//function to set up a virtual keyboard for a mobile device
//each key is created and positioned as per a QRTY keyboard
//enter (aka return) is position to the bottom left 
//delete (aka backspace) to the bottom right
//for each key a function is defined to service the key when pressed
function setupkeyboard() {
  //top row of keys
  let i=0; 
  let j=0; 
  buttonQ = createButton('Q');
  buttonQ.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonQ.size(keysizex, keysizey); 
  buttonQ.mousePressed(Qtouched); 
  i+=1; 
  buttonW = createButton('W');
  buttonW.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonW.size(keysizex, keysizey); 
  buttonW.mousePressed(Wtouched); 
  i+=1; 
  buttonE = createButton('E');
  buttonE.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonE.size(keysizex, keysizey); 
  buttonE.mousePressed(Etouched); 
  i+=1; 
    buttonR = createButton('R');
  buttonR.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonR.size(keysizex, keysizey); 
  buttonR.mousePressed(Rtouched); 
  i+=1; 
    buttonT = createButton('T');
  buttonT.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonT.size(keysizex, keysizey); 
  buttonT.mousePressed(Ttouched); 
  i+=1; 
    buttonY = createButton('Y');
  buttonY.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonY.size(keysizex, keysizey); 
  buttonY.mousePressed(Ytouched); 
  i+=1; 
    buttonU = createButton('U');
  buttonU.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonU.size(keysizex, keysizey);
  buttonU.mousePressed(Utouched); 
  i+=1; 
    buttonI = createButton('I');
  buttonI.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonI.size(keysizex, keysizey);   
  buttonI.mousePressed(Itouched); 
  i+=1; 
    buttonO = createButton('O');
  buttonO.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonO.size(keysizex, keysizey); 
  buttonO.mousePressed(Otouched); 
  i+=1; 
    buttonP = createButton('P');
  buttonP.position(keyxoff+i*(keysizex+keyspace), keyyoff);
  buttonP.size(keysizex, keysizey); 
  buttonP.mousePressed(Ptouched); 
  //middle row of keys
  i=0.5; 
  j=+1; 
  buttonA = createButton('A');
  buttonA.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonA.size(keysizex, keysizey); 
  buttonA.mousePressed(Atouched); 
  i+=1; 
    buttonS = createButton('S');
  buttonS.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonS.size(keysizex, keysizey); 
  buttonS.mousePressed(Stouched); 
  i+=1; 
    buttonD = createButton('D');
  buttonD.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonD.size(keysizex, keysizey); 
  buttonD.mousePressed(Dtouched); 
  i+=1; 
    buttonF = createButton('F');
  buttonF.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonF.size(keysizex, keysizey); 
  buttonF.mousePressed(Ftouched); 
  i+=1; 
    buttonG = createButton('G');
  buttonG.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonG.size(keysizex, keysizey); 
  buttonG.mousePressed(Gtouched); 
  i+=1; 
    buttonH = createButton('H');
  buttonH.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonH.size(keysizex, keysizey); 
  buttonH.mousePressed(Htouched); 
  i+=1; 
    buttonJ = createButton('J');
  buttonJ.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonJ.size(keysizex, keysizey); 
  buttonJ.mousePressed(Jtouched); 
  i+=1; 
    buttonK = createButton('K');
  buttonK.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonK.size(keysizex, keysizey);   
  buttonK.mousePressed(Ktouched); 
  i+=1; 
    buttonL = createButton('L');
  buttonL.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonL.size(keysizex, keysizey); 
  buttonL.mousePressed(Ltouched); 
  //bottom row of keys
  i=0; 
  j+=1; 
  buttonRETURN = createButton('ENT');
  buttonRETURN.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonRETURN.size(keysizex*1.5, keysizey); 
  buttonRETURN.mousePressed(RETURNtouched); 
  i+=1.5; 
    buttonZ = createButton('Z');
  buttonZ.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonZ.size(keysizex, keysizey); 
  buttonZ.mousePressed(Ztouched); 
  i+=1; 
      buttonX = createButton('X');
  buttonX.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonX.size(keysizex, keysizey); 
  buttonX.mousePressed(Xtouched); 
  i+=1; 
      buttonC = createButton('C');
  buttonC.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonC.size(keysizex, keysizey); 
  buttonC.mousePressed(Ctouched); 
  i+=1; 
      buttonV = createButton('V');
  buttonV.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonV.size(keysizex, keysizey);  
  buttonV.mousePressed(Vtouched); 
  i+=1; 
      buttonB = createButton('B');
  buttonB.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonB.size(keysizex, keysizey); 
  buttonB.mousePressed(Btouched); 
  i+=1; 
      buttonN = createButton('N');
  buttonN.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonN.size(keysizex, keysizey); 
  buttonN.mousePressed(Ntouched); 
  i+=1; 
      buttonM = createButton('M');
  buttonM.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonM.size(keysizex, keysizey); 
  buttonM.mousePressed(Mtouched); 
  i+=1; 
  buttonBACKSPACE = createButton('DEL');
  buttonBACKSPACE.position(keyxoff+i*(keysizex+keyspace), keyyoff+j*(keysizey+keyspace));
  buttonBACKSPACE.size(keysizex*1.5, keysizey); 
  buttonBACKSPACE.mousePressed(BACKSPACEtouched); 
}

//-----------------------------------------------------------


//initialise the game. 
function setupgame() {
  let i, j, count, thischar; 
  //initialise the data structure
  for (i = 0 ; i < nlevels; i++) { 
    for (j = 0 ; j < nletters; j++) { 
      tries_letter[i][j]=0; // initialise to a null char
      tries_closeness[i][j]= 0; 
      tries_state[i][j]=trynotentered; 
    }
  }
  
  //get the game number and the word to solve for
  gamenumber=dayssince1Jan2022(); 
  thisword=words[gamenumber]; //get solution word based on number of days since 1Jan2022. This ensures a new solution each day
  //print(thisword); 
  
  //initialise variables
  level=0; 
  letter=0;
  keypressed=false; 
  kbchar=0; 
  state=playing; 
  invalidword=false; 
  
  //see if today's game has already been started (or fully played)
  //if so, then load the words that have already been entered
  lastgamenumber=int(getItem('lastgamenumber')); //find out the last game played
  if (lastgamenumber==null) lastgamenumber=0; //set this to zero if no game has ever been played
  if (lastgamenumber==gamenumber) { //if this game has been started
    lastenteredwords=getItem('enteredwords'); //get words entered during last attempt of this game
    //access each letter of previous entered words
    //and load these into the data structure
    //and after each word, process and ENTER
    count=0; 
    for (i=0; i<lastenteredwords.length; i++) {
      kbchar=lastenteredwords.charAt(i); 
      processgamekeyaction(); 
      count+=1; 
      //if a full word has been entered, then 
      //process an ENTER key to validate the word
      if (count==nletters) {
        kbchar=ENTER; 
        processgamekeyaction(); 
        count=0; 
      }
    }
  }
  
  //display the game board, 
  background(backgroundcolour); 
  drawboard(); 
  
  //if game has previously been played and won or lost then display the won or lost info
  if (state==gamewon) {
    drawgamewon();     
  } else if (state==gamelost) {
    drawgamelost();     
  }
}

//respond to a valid key stroke during the playing of the game
function processgamekeyaction() {
  var tempword; //variable to store entered word
  var count; //count of the number of letters that match the correct word
  var i; 
  var j; 
  
  keypressed=false; //clear the flag so that another key can be received later
  
  //take different actions based on which valid key was entered
  if (kbchar==BACKSPACE) { // a backspace was typed, so delete the last letter entered
    invalidword=false; //given that the user has hit the backspace key, ensure this flag is reset. This will remove any error message displayed re invalid word
    //remove the letter from the letter count and from the data structures (reinitialising them)
    letter-=1; 
    tries_letter[level][letter]= 0; 
    tries_closeness[level][letter]= 0;
    tries_state[level][letter]=trynotentered;
    
  } else if (kbchar==ENTER && letter>=nletters) { //if a full word has been entered in the current level and an enter was typed then process the word
    //construct the entered word and store it in tempword
    tempword=""; 
    for ( j = 0 ; j < nletters; j++) tempword=tempword+tries_letter[level][j]; 
    if (findword(tempword)) { //check the word is valid (using the findword function) and if so, then check each letter against the correct word
      count=0; // keep count of how many letters match the correct word
      for ( j = 0 ; j < nletters; j++) { //step through each letter
        if (tries_letter[level][j]==thisword.charAt(j)) { //if the letter matches the correct word, then record this and increment the count
          tries_state[level][j]=tryfound; 
          count+=1; 
        } else { //if the letter doesn't match the correct letter then record this
          tries_state[level][j]=tryevaluated; 
        }
      }
      
      //As a valid word has been entered, store it so that is is reloaded if the game is run again today
      if (level==0) {
        storeItem('lastgamenumber', str(gamenumber)); //for the first word entered, store that this game has been attempted
        storeItem('gamestate', str(state)); //for the first word, store the game's state
      }
      //append the entered word to the string of entered words
      enteredwords=enteredwords+tempword;   
      //and store it to local storage
      storeItem('enteredwords', enteredwords); 
      
      letter=0; //reset the current letter to 0 in preparation for entering letters in the next level
      level+=1; //incremenet the level
      if (count==nletters) { //if all the letters matched the correct word then the game is won
        state=gamewon; 
      } else if (level >= nlevels) { //else, if the game has exceeded the allowed number of levels, then the game is lost
        state=gamelost; 
      }
      //now the game is ended, store the state - either won or lost 
      storeItem('gamestate', str(state)); 
    } else { // word entered is not in the list of words, so set a flag to note this. 
      invalidword=true; 
    }
  } else { // if a letter has been typed then store this into the data structures (including noting how close it is to the correct letter)
    if (letter<nletters) {
      tries_letter[level][letter]=kbchar; 
      tries_closeness[level][letter]= unchar(kbchar)-unchar(thisword[letter]); //charAt(letter)); //asciichar-string.byte(string.sub(thisword, letter, letter))
      tries_state[level][letter]=tryentered; 
      letter+=1; //move on to the next letter in the word
    }
  }
}

//-----------------------------------------------------------

// if the game has been won, then display info about this and invite user to hit enter to start the game again
function drawgamewon() {
  var x = wx+xcanvas/2.0; 
  var y=yoff+(cell+yspace)*nlevels+yspace; 
  if (isMobile) removekeyboard(); //remove the mobile keyboard at the end of the game
  textSize(30); 
  textAlign(CENTER, CENTER); 
  fill(textcolour); 
  noStroke (); 
  text (winningmessage[level-1], x, y); 
  
  //display the share button and define the function that is called when it is hit
  sharebuttonx=xoff; 
  sharebuttony=y+24; 
  //set up a button to copy result to the clipboard
  buttonSHARE = createButton('Share');
  buttonSHARE.style('background-color', color(27, 200, 27));
  buttonSHARE.size(cell*2, cell); 
  buttonSHARE.position(sharebuttonx, sharebuttony); 
  buttonSHARE.mousePressed(CopyToClipboard);
}

//-----------------------------------------------------------

// if the game has been lost, then display info about this, including the correct word, and invite user to hit enter to start the game again
function drawgamelost() {
  var x = wx+xcanvas/2.0; 
  var y=yoff+(cell+yspace)*nlevels+yspace; 
  if (isMobile) removekeyboard(); //remove the mobile keyboard at the end of the game
  textSize(24); 
  textAlign(CENTER, CENTER); 
  fill(textcolour); 
  noStroke(); 
  text("The word was "+thisword, x, y); 
  text("Better luck tomorrow.", x, y+26); 
  
  //display the share button and define the function that is called when it is hit
  sharebuttonx=xoff; 
  sharebuttony=y+50; 
  //set up a button to copy the result to the clipboard
  buttonSHARE = createButton('Share');
  buttonSHARE.style('background-color', color(27, 200, 27));
  buttonSHARE.size(cell*2, cell); 
  buttonSHARE.position(sharebuttonx, sharebuttony); 
  buttonSHARE.mousePressed(CopyToClipboard);
}

//-----------------------------------------------------------
//function that displays user help info via a popup alert
//the alert stays displayed until the user hits ok
function showhelp() {
  let mytext=""; 
  mytext=mytext+"You have six goes to guess a word.\n\n"
  mytext=mytext+"Each guess must be a valid five-letter word\n\n";
  mytext=mytext+"Hit the enter button to submit.\n\n"; 
  mytext=mytext+"A green tile means the letter is in the correct spot.\n\n"; 
  if (maxlevelforclues<nlevels) {
    mytext=mytext+"And for the first "+str(maxlevelforclues)+ " guesses, each tiles will give you a clue...\n\n"; 
  } else {
    mytext=mytext+"And for each guess, each tile will give you a clue...\n\n"; 
  }
  mytext=mytext+"a down arrow means the correct letter is closer to A; and\n"; 
  mytext=mytext+"an up arrow mean the correct letter is closer to Z.\n\n"; 
  mytext=mytext+"There is a new word to solve every day.\n\n"; 
  alert(mytext); 
}

//-----------------------------------------------------------

//draw the game board
function drawboard () {
  //float barheight; 
  var x; 
  var y; 
  
  //display the game title
  textSize(50); 
  textAlign(CENTER, CENTER); 
  fill(textcolour); 
  noStroke(); 
  text("RACHLE", wx+xcanvas/2.0, 24.0);
  textSize(14); 
  text("no. "+str(gamenumber), wx+xcanvas/2.0, 50);
  
  //set up text size for writing the letters of the entered words
  textSize(24); 
  textAlign(CENTER, CENTER); 
  //step through each cell in the display grid
  for (var i = 0 ; i < nlevels; i++) { //step through each level (row)
    y=yoff+(float(i))*(cell+yspace); 
//get the y position for this level
    for (var j = 0 ; j < nletters; j++) { //step through each cell in a level
      x=xoff+(float (j))*(cell+xspace); //get the x position for this cell
      if (tries_state[i][j]==trynotentered) { //if a letter has not yet been typed, then just show the text box
        fill(cellbackground); 
        stroke(cellborder); 
        rect (x, y, cell, cell); 
      } else if (tries_state[i][j]==tryentered) { //if a letter has been typed, but the word not entered yet, then show the letter in the text box
        fill(cellbackground); 
        stroke(cellborder); 
        rect (x, y, cell, cell); 
        fill (textcolour); 
        stroke (textcolour); 
        text(tries_letter[i][j], x+cell/2.0, y+cell/2); 
      } else if (tries_state[i][j]==tryevaluated) { //if the word for this level has been entered and this letter does not match the result, then show the letter and an arrow showing if the correct letter is closer to A or Z
        fill(cellbackground); 
        stroke(cellborder); 
        rect (x, y, cell, cell); // draw the cel
        fill (textcolour); 
        stroke (textcolour); 
        text(tries_letter[i][j], x+cell/2.0, y+cell/2); //draw the letter
        fill (wrongbackground); 
        stroke(wrongbackground); 
        //barheight=cell * float (tries_closeness[i][j])/26.0; 
        if (i < maxlevelforclues) { //if this variable is set to less than nlevels, then for levels greater than it, the arrows are not shown
          if (tries_closeness[i][j]>0) { //show the arrows. Arrows showing the correct letter is closer to A are on the left of the letter, start in the middle height of the cell and point down. For the correct letter closer to Z, the arrow is on the right, pointing up
            rect (x+0.18*cell, y+0.5*cell, 0.04*cell, 0.3*cell); 
            triangle (x+0.1*cell, y+0.8*cell, x+0.3*cell, y+0.8*cell, x+0.2*cell, y+0.9*cell); 
            //rect(xoff+(float(j)-1.0)*(cell*xspace)+4.0, height-(yoff+(float(nlevels)-float(i))*(cell*yspace)), cell/8.0, -barheight); 
          } else {
            rect (x+0.82*cell, y+0.5*cell, -0.04*cell, -0.3*cell); 
            triangle (x+0.9*cell, y+0.2*cell, x+0.7*cell, y+0.2*cell, x+0.8*cell, y+0.1*cell); 
            //triangle (x+0.1*cell, y+0.8*cell, x+0.3*cell, y+0.8*cell, x+0.2*cell, y+0.9*cell); 
            //rect(xoff+(float(j)-1.0)*(cell*xspace)+cell-(cell/8.0)-4.0,  height-(yoff+(float(nlevels)-float(i))*(cell*yspace)+(cell-barheight)), cell/8.0, barheight); 
          }
        }
      } else if (tries_state[i][j]==tryfound) { //if the word has been entered and the letter is correct, then show it with a green background
        fill(foundbackground); 
        stroke(cellborder); 
        rect (x, y, cell, cell); 
        fill (textcolour); 
        stroke (textcolour); 
        text(tries_letter[i][j], x+cell/2.0, y+cell/2); 
      }
    }
  } 
  if (invalidword) { //if a word has been entered that is invalid, then display this error message
    fill (textcolour); 
    noStroke (); 
    textSize(14); 
    textAlign(LEFT, CENTER); 
    x=xoff+(cell+xspace)*float (nletters); 
    y=yoff+float (level)*(cell+yspace)+cell/2.0;
    text("Not in", x, y); 
    text("word list", x, y+16); 
    //println("Not in word list.", x, y); 
  }
}

//-----------------------------------------------------------

//see if the word passed to this function is in the list of words. If so, return true, else return false. 
function findword (word) {
  var i=0; 
  var found=false; 
  //println(word); 
  while ((!found) && (i<words.length)) {
    if (word==words[i]) {
      found=true; 
    } else {
      i+=1;
    }
  }
  return found; 
}


//-----------------------------------------------------------


//this function is called whenever a key is pressed. Use it to filter out invalid key strokes and only pass on valid key strokes to be processed
//Whilst the game is playing, valid keystrokes are loaded into kbchar and the keypressed flag is set. 
//If the enter key is hit after the game is ended, then a new game is started
function keyPressed() {
   //print (keyCode, ENTER, BACKSPACE, letter, nletters); 
  if (state==playing) { //if the game is currently playing, look for valid key strokes
    keypressed=true; //flag that a key has been pressed
    if ((keyCode >= 97) && (keyCode  <= 122)) { //if a lower case char has been entered, then convert it to upper case and load it into the kbchar variable
      //print("lower case char", key, keyCode)
      kbchar=char (keyCode-32);
       //print("converted to upper case char", kbchar)
    } else if ((keyCode  >= 65) && (keyCode  <= 90)) { //get upper case key and store it in kbchar
    //print ("upper case char", key, keyCode)
      kbchar=char(keyCode); 
    } else if ((keyCode ==13) && (letter==nletters)) { //only accept a return) key if a full word has been entered into a level 
      //print(keyCode, "enter entered")
      kbchar=ENTER; 
    } else if ((keyCode==8) && (letter>0)) { //only accept a  delete key if at least one letter has been entered into a level
      kbchar=BACKSPACE; 
      //print(keyCode, "backspace entered"); 
    } else { //the key entered was not valid for this stage of the game, so clear the flag
      keypressed=false; 
    }
  } 
  
  //if the game is playing and a valid key was pressed
  //then process the action and display the game board
  //as part of processing the game action, the state could change from playing to gamewon or gamelost
  if ((state==playing) && keypressed) {
    processgamekeyaction(); 
    background(backgroundcolour); 
    drawboard(); 
  }
  
  //if state has changed from playing to gamewon or gamelost
  //then draw the gameboard and then display info relevant to 
  //winning or losing
  if (state==gamewon) {
    background(backgroundcolour); 
    drawboard(); 
    drawgamewon(); 
  } else if (state==gamelost) {
    background(backgroundcolour); 
    drawboard(); 
    drawgamelost(); 
  }

  return false; //suggestion from p5 webpage to include this
}


//-----------------------------------------------------------


//this function is called whenever a key is pressed. Use it to filter out invalid key strokes and only pass on valid key strokes to be processed
//Whilst the game is playing, valid keystrokes are loaded into kbchar and the keypressed flag is set. 
//If the enter key is hit after the game is ended, then a new game is started
function servicetouch(keycodetouched) {
 //print (keyCode, ENTER, BACKSPACE, letter, nletters); 
  if (state==playing) { //if the game is currently playing, look for valid key strokes
    keypressed=true; //flag that a key has been pressed
    if ((keycodetouched  >= 65) && (keycodetouched  <= 90)) { //get upper case key and store it in kbchar
      //print ("upper case char", key, keyCode)
      kbchar=char(keycodetouched); 
    } else if ((keycodetouched ==13) && (letter==nletters)) { //only accept a return) key if a full word has been entered into a level 
      //print("enter entered")
      kbchar=ENTER; 
    } else if ((keycodetouched==8) && (letter>0)) { //only accept a  delete key if at least one letter has been entered into a level
      kbchar=BACKSPACE; 
    } else { //the key entered was not valid for this stage of the game, so clear the flag
      //print("backspace entered")
      keypressed=false; 
    }
  } 
  
  //if the game is playing and a valid key was touched
  //then process the action and display the game board
  //as part of processing the game action, the state could change from playing to gamewon or gamelost
  if ((state==playing) && keypressed) {
    processgamekeyaction(); 
    background(backgroundcolour); 
    drawboard(); 
  }
  
  //if state has changed from playing to gamewon or gamelost
  //then draw the gameboard and then display info relevant to 
  //winning or losing
  if (state==gamewon) {
    background(backgroundcolour); 
    drawboard(); 
    drawgamewon(); 
  } else if (state==gamelost) {
    background(backgroundcolour); 
    drawboard(); 
    drawgamelost(); 
  }
  
  //return false; //suggestion from p5 webpage to include this
}

//-----------------------------------------------------------

//function to determine the number of days since 1 January 2022
//The solution word is sourced from the words array using this number as an index
//With 2039 valid solution words, this means the game is valid up to around March 2027. 
function dayssince1Jan2022() {
  var d=day(); 
  var m=month(); 
  var y=year (); 
  var leapmonths=[31,29,31,30,31,30,31,31,30,31,30,31]; 
  var nonleapmonths=[31,28,31,30,31,30,31,31,30,31,30,31]; 
  var nd=0; 
  var yy, mm; 

  //calculate number of days from whole years since 1 Jan 2022
  if (y>2022) {
    for (yy=2022; yy<y; yy++) if ((yy==2024) || (yy==2028)) nd+=366; else nd+=365; 
  }
  
  //calculate number of days from whole months since the start of the current year
  if (m>1) {
    if ((y==2024) || (y==2028)) {
      for (mm=1; mm<m; mm++) nd+=leapmonths[mm-1]; 
    }
    else {
      for (mm=1; mm<m; mm++) nd+=nonleapmonths[mm-1]; 
    }
  }
  
  //add days of current month
  nd+=d; 
  
  return nd; 
}

//-----------------------------------------------------------

//create a text summary of the game to a string
//and then copy this to the clipboard
function CopyToClipboard() {
  var i, j; 
  
  myText="Rachle "+str(gamenumber)+ "\n"; 
  if (state==gamelost) {
    myText=myText+"-/"+str(nlevels)+"\n"; 
  } else if (state==gamewon) {
    myText=myText+str(level)+"/"+str(nlevels)+"\n"; 
  }
  for (i=0; i<nlevels; i++) {
    for (j=0; j<nletters; j++) {
      if (tries_state[i][j]==tryevaluated) {
        if (tries_closeness[i][j]<0) {
          myText=myText+"⬆️";  //"↑";
        } else {
          myText=myText+"⬇️"; //"↓"; 
        }
      } else if (tries_state[i][j]==tryfound) {
        myText=myText+"🟩"; //" * "; 
      }
    }
    myText=myText+"\n";  
  }
  
  copyStringToClipboard (myText);
  
  //display message to indicate text has been copied to clipboard
  textSize(14)
  textAlign(LEFT, CENTER); 
  text("Copied to clipboard",sharebuttonx + cell*2.5, sharebuttony+cell/2.0);
}

//-----------------------------------------------------------

//copy a string to the clipboard
function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}


//-----------------------------------------------------------

//remove the mobile keyboard
function removekeyboard() {
  buttonA.hide(); 
  buttonB.hide(); 
  buttonC.hide(); 
  buttonD.hide(); 
  buttonE.hide(); 
  buttonF.hide(); 
  buttonG.hide(); 
  buttonH.hide(); 
  buttonI.hide(); 
  buttonJ.hide(); 
  buttonK.hide(); 
  buttonL.hide(); 
  buttonM.hide(); 
  buttonN.hide(); 
  buttonO.hide(); 
  buttonP.hide(); 
  buttonQ.hide(); 
  buttonR.hide(); 
  buttonS.hide(); 
  buttonT.hide(); 
  buttonU.hide(); 
  buttonV.hide(); 
  buttonW.hide(); 
  buttonX.hide(); 
  buttonY.hide(); 
  buttonZ.hide(); 
  buttonRETURN.hide(); 
  buttonBACKSPACE.hide(); 
}

//-----------------------------------------------------------

function Atouched () {servicetouch(65); } //ascii for A
function Btouched () {servicetouch(66); }
function Ctouched () {servicetouch(67); }
function Dtouched () {servicetouch(68); }
function Etouched () {servicetouch(69); }
function Ftouched () {servicetouch(70); }
function Gtouched () {servicetouch(71); }
function Htouched () {servicetouch(72); }
function Itouched () {servicetouch(73); }
function Jtouched () {servicetouch(74); }
function Ktouched () {servicetouch(75); }
function Ltouched () {servicetouch(76); }
function Mtouched () {servicetouch(77); }
function Ntouched () {servicetouch(78); }
function Otouched () {servicetouch(79); }
function Ptouched () {servicetouch(80); }
function Qtouched () {servicetouch(81); }
function Rtouched () {servicetouch(82); }
function Stouched () {servicetouch(83); }
function Ttouched () {servicetouch(84); }
function Utouched () {servicetouch(85); }
function Vtouched () {servicetouch(86); }
function Wtouched () {servicetouch(87); }
function Xtouched () {servicetouch(88); }
function Ytouched () {servicetouch(89); }
function Ztouched () {servicetouch(90); }
function RETURNtouched () {servicetouch(13); }
function BACKSPACEtouched () {servicetouch(8); }

