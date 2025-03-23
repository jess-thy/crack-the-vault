const inputs = document.querySelectorAll(".input");
const text = document.getElementById("text");
const guessButton = document.getElementById("guess-button");
const resetButton = document.getElementById("reset-button");
const vaultOpen = document.getElementById("vault-open");
const vaultClosed = document.getElementById("vault-closed");

let num1 = 0;
let num2 = 0;
let num3 = 0;
let num4 = 0;

function randomNum() {
  return Math.floor(Math.random() * 10);
}

function generateCode() {
  const storedCode = JSON.parse(localStorage.getItem("code"));
  if (storedCode) {
    return storedCode;
  } else {
    console.log("No code found in localStorage");
    return null;
  }
}

function saveCode() {
  const code = {
    num1: randomNum(),
    num2: randomNum(),
    num3: randomNum(),
    num4: randomNum(),
  };
  localStorage.setItem("code", JSON.stringify(code));
  return code;
}

function guess() {
  let allCorrect = true;

  inputs.forEach((input) => {
    input.style.backgroundColor = "";
  });

  inputs.forEach((input, index) => {
    const inputValue = input.value;
    const storedValue = code[`num${index + 1}`];

    if (inputValue == storedValue) {
      input.style.backgroundColor = "#3fab6a";
    } else {
      let misplacedMatch = false;
      for (let i = 0; i < 4; i++) {
        if (inputValue == code[`num${i + 1}`] && i !== index) {
          misplacedMatch = true;
          break;
        }
      }

      if (misplacedMatch) {
        input.style.backgroundColor = "#cc8f25";
      } else {
        input.style.backgroundColor = "#cc2525";
        allCorrect = false;
      }
    }
  });

  if (!allCorrect) {
    inputs.forEach((input) => {
      input.addEventListener("click", () => {
        inputs.forEach((inp) => (inp.value = ""));
        inputs[0].focus();
      });
    });
  }

  if (allCorrect) {
    setTimeout(() => {
      vaultOpen.style.display = "block";
      vaultOpen.style.position = "relative";
      vaultClosed.style.display = "none";
      guessButton.style.display = "none";
      resetButton.style.display = "block";
      resetButton.style.position = "relative";
      text.innerHTML = "Congrats! You cracked the vault!";
    }, 500);
  }
}

inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    if (e.target.value.length === 1) {
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && e.target.value === "") {
      if (index > 0) {
        inputs[index - 1].focus();
      }
    }
  });
});

function reset() {
  localStorage.removeItem("code");
  inputs.forEach((input) => {
    input.style.backgroundColor = "#515151";
  });
  vaultClosed.style.display = "block";
  vaultOpen.style.display = "none";
  guessButton.style.display = "block";
  resetButton.style.display = "none";
  text.innerHTML = "Can you crack the vault?";

  code = saveCode();
  console.log("New code generated:", code);

  inputs.forEach((inp) => (inp.value = ""));
  inputs[0].focus();
}

code = generateCode();
if (!code) {
  code = saveCode();
}

console.log(code);

guessButton.addEventListener("mousedown", guess);

resetButton.addEventListener("mousedown", reset);
