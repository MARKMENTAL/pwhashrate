const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "output.txt");

function estimateTimeToCrack(password: string, length: number) {
  const possibleCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+_";
  const possiblePasswords = Math.pow(possibleCharacters.length, length);
  const rate = 1000000000; // based on assumption of password cracking software doing 1 billion password guesses per second
  const time = possiblePasswords / rate;

  console.log(`Estimated time to crack: ${time.toFixed(2)} seconds`);
  if (time >= 31536000){
    console.log("This password is very secure, it would take over a year to crack!");
  }
  else if (time <= 3600 ){
    console.log("You should not use this password, it is not complex and could easily be cracked in under an hour...");
  }
}

fs.readFile(filePath, "utf-8", (err: NodeJS.ErrnoException, data: string) => {
  if (err) {
    console.error(err);
    return;
  }

  const password = data.trim();
  const score = ratePassword(password);
  console.log(`Password: ${password}\nPassword Security Score: ${score}`);
  estimateTimeToCrack(password, password.length);
  
  if (score < 35){
    console.log("Weak Password: You should change it to something more secure to be safe...");
  }
});


function ratePassword(password: string): number {
  let score = 0;

  if (!password) {
    return score;
  }

  // Add points for password length
  score += password.length * 4;
  score += (checkForLetters(password) + checkForNumbers(password) + checkForSpecialChars(password)) * 4;

  // Deduct points for repeated characters or sequences
  score -= getCountOfRepeatedChars(password) * 1;
  score -= getCountOfSequences(password) * 3;

  // Deduct points for easily guessable patterns
  score -= getCountOfDictionaryWords(password) * 3;

  // Ensure score is within 0-100 range
  if (score < 0) {
    score = 0;
  }
  if (score > 100) {
    score = 100;
  }

  return score;
}

function checkForLetters(password: string): number {
  return /[a-zA-Z]/.test(password) ? 1 : 0;
}

function checkForNumbers(password: string): number {
  return /\d/.test(password) ? 1 : 0;
}

function checkForSpecialChars(password: string): number {
  return /[!@#$%^&*)(_+}{":?><;,.]/.test(password) ? 1 : 0;
}

function getCountOfRepeatedChars(password: string): number {
  let count = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charAt(i);
    if (password.indexOf(char, i + 1) !== -1) {
      count++;
    }
  }
  return count;
}

function getCountOfSequences(password: string): number {
  let count = 0;
  const sequence = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < password.length - 2; i++) {
    if (sequence.indexOf(password.substring(i, i + 3).toLowerCase()) !== -1) {
      count++;
    }
  }
  return count;
}

function getCountOfDictionaryWords(password: string): number {
  let count = 0;
  const dictionary = ["password", "1234", "qwerty", "admin", "test"];
  for (const word of dictionary) {
    if (password.toLowerCase().includes(word)) {
      count++;
    }
  }
  return count;
}
