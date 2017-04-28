$(document).ready(function() {
  //Declare all variables used
  var seq = [];
  var colors = ["green", "blue", "pink", "yellow"];
  var gameOn = false;
  var count = 0;
  var seqCount = 0;
  var guessCount = 0;
  var guessMode = false;
  var strictMode = false;
  var pause = 1500;
  var greenSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  var blueSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  var pinkSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  var yellowSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
  //Listens for click on toggle-switch and prepares game
  $(".toggle-switch").click(function() {
    $("h1#screen").toggleClass("screen-off screen-on");
    $("#led").removeClass("led-on").addClass("led-off");
    gameOn = !gameOn;
    resetFunc();
  });
  //Invokes genColor function which adds random color to seq array
  $("#start").click(function() {
    if (gameOn) {
      genColor(colors);
    }
  });
  //Invokes reset function to reset all variables to orig state. Then restarts the game with genColor
  $("#reset").click(function() {
    if (gameOn) {
      resetFunc();
      setTimeout(function() {
        genColor(colors);
      }, 1000);
    }
  });
  //Puts game into strictmode and toggles LED light above 'strict' button
  $("#strict").click(function() {
    if (gameOn) {
      strictMode = !strictMode;
      $("#led").toggleClass("led-off led-on");
    }
  });
  //Listens for click on any colour. Then invokes playerGuess to determine outcome of guess. 
  $(".color").mousedown(function() {
    if (gameOn === true && guessMode === true) { //Ensures that game is switched on.
      var id = $(this).attr("id");//Assigns selected colour's ID to variable. 
      $(this).toggleClass(id);//Toggles brightness of colour while pressed
      if (playerGuess(id, guessCount)) {//Checks whether guess is correct.
        guessCount++;
      } else if (!strictMode) {//Replays current sequence if user guesses incorrectly. 
        guessCount = guessCount;
        guessMode = false;
        setTimeout(function() {
          playSeq(seq);
        }, 2000)
      } else if (strictMode) {//Resets game if incorrect guess and game is in strictmode
        setTimeout(function() {
          resetFunc();
        }, 1200)
      }
    }
    if (guessMode && guessCount === seq.length) {//Checks if user has comepleted current sequence.
      if (count === 20) {//Runs winning function if user gets to 20th step.
        winFunc();
      } else {
        checkCount(count);//Checks count number and increases speed of game at certain levels. 
        guessMode = false;
        setTimeout(function() {
          genColor(colors);//Runs genColor function to add another colour to seq array.
        }, 1000);
      }
    }
  });

  $(".color").mouseup(function() {//Toggles brightness of colour once user has let go of mouse click
    var divId = $(this).attr("id");
    if ($(this).hasClass(divId)) {
      $(this).toggleClass(divId);
    }
  });

  function genColor(colorsArr) {//Function to generate all random colours and add them to seq array
    count++;
    $("#screen").text(("0" + count).slice(-2));//Makes sure that count always displays as 2 digits.
    setTimeout(function() {
      seq.push(colorsArr[Math.floor(Math.random() * colorsArr.length)]);
      playSeq(seq);//Plays sequence of colours for user to remember.
    }, 2000)
  }

  function playSeq(arr) {//Function that iterates through seq array.
    animateFunc(seqCount);//Function that animates and adds audio while iterating through seq array.
    seqCount++;
    if (seqCount < arr.length) {
      setTimeout(function() {
        playSeq(seq);
      }, pause)
    } else {//Stops sequence once finished as to wait for user to input guesses. 
      guessCount = 0;
      seqCount = 0;
      guessMode = true;
    }

  }

  function animateFunc(i) {//Animates seq array by toggling brightness class.
    $("#" + seq[i]).toggleClass(seq[i]);
    playSound(seq[i]);//Invokes audio function. 
    setTimeout(function() {
      $("#" + seq[i]).toggleClass(seq[i]);
    }, 500);
  }

  function playSound(sound) {//Checks colour and plays appropriate audio file.
    if (sound === "green") {
      greenSound.play();
    } else if (sound === "blue") {
      blueSound.play();
    } else if (sound === "pink") {
      pinkSound.play();
    } else if (sound === "yellow") {
      yellowSound.play();
    } else {//If user guesses incorrectly then all files played simultaneously.
      greenSound.play();
      blueSound.play();
      pinkSound.play();
      yellowSound.play();
    }
  }

  function playerGuess(id, num) {//Function that checks user's guess against sequence. 
    if (seq[num] === id) {
      playSound(id);
      return true;
    } else {
      playSound("error");
      errFunc();//Runs error function if user guesses incorrectly. 
      return false;
    }
  }

  function errFunc() {//Error function that animates game a certai way if user guesses wrong. 
    $("h1#screen").text("!!");
    var x = 0;
    var timer = setInterval(function() {
      $("h1#screen").toggleClass("screen-off")
      x++;
      if (x === 6) {
        clearInterval(timer);
        $("h1#screen").text(("0" + count).slice(-2));
      }
    }, 200);
  }

  function resetFunc() {//Reset function that reverts all variables back to original values.
    seq = [];
    seqCount = 0;
    count = 0;
    guessMode = false;
    guessCount = 0;
    pause = 1500;
    $(".color").removeClass("green blue pink yellow");
    $("h1#screen").text("--");
    if (strictMode) {
      genColor(colors);
    }
  }

  function checkCount(count) {//Checks count at start of each sequence. Changes speed at certain levels.
    if (count === 5) {
      pause = 1200;
    } else if (count === 9) {
      pause = 1000;
    } else if (count === 13) {
      pause = 750;
    }
  }

  function winFunc() {//Win function that only gets invoked once user gets to level 20. Animates game. 
    $("#green").addClass("green");
    $("#blue").addClass("blue");
    $("#pink").addClass("pink");
    $("#yellow").addClass("yellow");
    $("h1#screen").text(":)");
    var x = 0;
    var timer = setInterval(function() {
      $("#green").toggleClass("green");
      $("#blue").toggleClass("blue");
      $("#pink").toggleClass("pink");
      $("#yellow").toggleClass("yellow");
      $("h1#screen").toggleClass("screen-off");
      x++;
      if (x === 10) {
        clearInterval(timer);
        $(".color").removeClass("green blue pink yellow");
        resetFunc();
      }
    }, 200);
  }
});