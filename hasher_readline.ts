import { createHash } from "crypto";
import { writeFileSync } from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let pw_length: number;

rl.question("Enter the string to be hashed: ", (originalString) => {
  const hash = createHash("sha512")
    .update(originalString)
    .digest("base64");
    rl.question("Enter the length you want your password to be: ", (length) => {
      pw_length = +length;

  console.log(`Original string: ${originalString}`);
  let hash_output: string = hash.slice(1, pw_length+1);
  console.log(`Hashed string: ${hash_output}`);

  writeFileSync("output.txt", hash_output);

  rl.close();
});
});
