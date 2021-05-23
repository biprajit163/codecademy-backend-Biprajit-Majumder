"use strict";

const fs = require("fs");
const ps = require("prompt-sync")({ sigint: true });

const ufo_data = require("./data/ufo.js");
const ufoArr = ufo_data.ufo_arr;

const message_data = fs.readFileSync("./data/messages.txt", "utf8");
const messageArr = message_data.split("\n");

// Pick a random codeword from the nouns Arr;
const nouns_data = fs.readFileSync("./data/nouns.txt", "utf8");
const nounsArr = nouns_data.split("\n");
let codeword = nounsArr[Math.floor(Math.random() * nounsArr.length)];


const playGame = () => {
  let isPlaying = true;

  let ufoLevel = 0;
  let nounsMatches = 0;
  let incorrectGuesses = [];
  let correctGuesses = [];

  let codeDash = [];
  for (let i = 0; i < codeword.length - 1; i++) {
    codeDash.push("_");
  }

  console.log(
    "UFO: The Game" +
      "\n" +
      "Instructions: save us from alien abduction by guessing letters in the codeword" +
      "\n"
  );

  while (isPlaying === true) {
    if (
      ufoLevel === ufoArr.length - 1 ||
      checkWin(codeword, codeDash) === true
    ) {
      if (ufoLevel === ufoArr.length - 1) {
        console.log("You lost the person is abducted!" + "\n");
      } else if (checkWin(codeword, codeDash) === true) {
        console.log(
          "Correct! You saved the person and earned a medal of honor!" +
            "\n" +
            "The codeword is:" +
            codeword
        );
      }

      isPlaying = endGame(isPlaying);

      codeword = nounsArr[Math.floor(Math.random() * nounsArr.length)];
      codeDash = [];
      correctGuesses = [];
      incorrectGuesses = [];
      for (let i = 0; i < codeword.length - 1; i++) {
        codeDash.push("_");
      }

      ufoLevel = 0;
    } else {
      if (
        ufoLevel === 0 ||
        correctGuesses.length === 0 ||
        incorrectGuesses.length === 0
      ) {
        let displayUfo = ufoArr[ufoLevel];
        console.log(displayUfo);
      }

      console.log(codeword);
      // console.log("correct guesses: " + correctGuesses);
      // console.log("incorrect guesses: " + incorrectGuesses + "\n");

      if (incorrectGuesses.length === 0) {
        console.log("Incorrect Guesses:" + "\n" + "None" + "\n");
      } else {
        console.log(
          "Incorrect Guesses:" +
            "\n" +
            incorrectGuesses.join(" ").toUpperCase() +
            "\n"
        );
      }

      console.log(codeDash.join(" ").toUpperCase());

      nounsMatches = potentialWords(codeDash, codeword);
      console.log(`Number of dictionary matches: ${nounsMatches}` + "\n");

      let checkLetter = true;

      while (checkLetter) {
        let userGuess = ps("Please enter your guess: ");

        if (
          codeword.toLowerCase().includes(userGuess.toLowerCase()) === true &&
          userGuess !== ""
        ) {
          checkLetter = false;
          console.log(ufoArr[ufoLevel]);
          correctGuesses.push(userGuess.toLowerCase());

          if (checkWin(codeword, codeDash) === false) {
            console.log(
              "Correct! Your're closer to cracking the codeword." + "\n"
            );
          }

          for (let i = 0; i < codeDash.length; i++) {
            if (userGuess.toLowerCase() === codeword.split("")[i]) {
              codeDash[i] = userGuess;
            }
          }
        } else if (
          codeword.toLowerCase().includes(userGuess.toLowerCase()) === false &&
          userGuess !== "" &&
          userGuess.split("").length <= 1
        ) {
          checkLetter = false;
          console.log(ufoArr[ufoLevel]);
          incorrectGuesses.push(userGuess);
          console.log(
            "Incorrect! The tractor beam pulls the person in further" + "\n"
          );
          ufoLevel++;
        } else if (userGuess.split("").length > 1) {
          console.log(
            "I cannot understand your input please guess a single letter" + "\n"
          );
        }
      }
    }
  }
};

const checkWin = (codeword, codeDash) => {
  let codewordArr = codeword.split("");
  let result = true;

  for (let i = 0; i < codeDash.length; i++) {
    if (codewordArr[i] !== codeDash[i]) {
      result = false;
    }
  }

  return result;
};

const endGame = (isPlaying) => {
  let run = true;

  while (run) {
    let playAgain = ps("Would you like to play again (Y/N)? ");

    if (playAgain.toLowerCase() === "y") {
      isPlaying = true;
      run = false;
    } else if (playAgain.toLowerCase() === "n") {
      console.log("Goodbye!" + "\n");
      isPlaying = false;
      run = false;
    }
  }

  return isPlaying;
};


const potentialWords = (codeDash, codeword, similarity = 0, dashPercent = 0) => {
  let codewordArr = codeword.split(" ");
  let nounsIndex = 0;
  let possibleWords = 0;
  
  while(nounsIndex < nounsArr.length) {
    let codewordNum = 0;
    let codeDashNum = 0;
    let letterCount = 0;

    for(let i=0; i < codeDash.length; i++) {
      if(codeDash[i] !== "_") letterCount++;
      codeDashNum += codeDash[i].charCodeAt(0);
    }

    for(let i=0; i < codewordArr.length; i++) {
      codewordNum += codewordArr[i].charCodeAt(0);
    }

    dashPercent = letterCount/codeDash.length;
    similarity = codeDashNum/codewordNum;

    if(similarity.toFixed(2) >= dashPercent.toFixed(2)) possibleWords++;
    
    nounsIndex++;
  }

  console.log(`Dash Percent ${dashPercet.toFixed(2)}`);
  console.log(`similarity Percent ${similarity.toFixed(2)}`);
  return possibleWords;
};


const testUser = (testWord = codeword) => {
  console.log(testWord);
  let letter = ps("enter a letter a-z: ");
  let result;

  if (testWord.includes(letter)) {
    result = true;
  } else {
    result = false;
  }

  console.log(
    `you picked ${letter} that is ${result ? "correct" : "incorrect"}`
  );
  return result;
};

const main = () => {
  if (process.env.NODE_ENV === "development") {
    playGame();
  }
  return false;
};

main();

module.exports = {
  testUser,
};
