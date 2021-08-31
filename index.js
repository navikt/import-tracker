/* const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileStream = fs.createReadStream("out.txt");

  const changes = [];
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let isChange = false;
  for await (const line of rl) {
    if (line.includes("Changes:")) {
      isChange = true;
    }
    if (isChange && line.startsWith(" - ")) {
      changes.push(line);
    } else {
      isChange = false;
    }
  }
  console.log(changes);
}

processLineByLine();
 */

const { execSync } = require("child_process");

let output;

try {
  output = execSync(`yarn lerna version patch --all --no-push`);
} catch (error) {
  console.info(
    `No local packages have changed since the last tagged releases.`
  );
  process.exit(0);
}

const changedPackages = JSON.parse(output.toString());
console.log(changedPackages);
/* const packageNames = changedPackages.map(project => project.name); */
