const quoteApi = "https://api.quotable.io/random?minLength=100&maxLength=140";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = null; 
let mistakes = 0;

const renderNewQuote = async () => {
    const response = await fetch(quoteApi);
    const data = await response.json();
    quote = data.content;

    const arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>"; 
    });
    quoteSection.innerHTML = arr.join("");
};

userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    let userInputChars = userInput.value.split("");
    quoteChars.forEach((char, index) => {
        if (char.innerText === userInputChars[index]) {
            char.classList.add("success");
        } else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        } else {
            if (!char.classList.contains("fail")) {
                mistakes += 1;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
    });
    let check = quoteChars.every((element) => {
        return element.classList.contains("success");
    });
    if (check) {
        displayResult();
    }
});


function updateTimer() {
    if (time === 0) {
        displayResult();
        clearInterval(timer);
    } else {
        document.getElementById("timer").innerText = time-- + "s";
    }
}

const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1600);
};

const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer); 
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("start-test").style.display = "none";
    document.getElementById("next-test").style.display = "block"; 
    userInput.disabled = true;
    let timeTaken = 1;
    if (time !== 0) {
        timeTaken = (60 - time) / 60;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    document.getElementById("accuracy").innerText = ((1 - mistakes / userInput.value.length) * 100).toFixed(2) + "%";
};

const nextTest = () => {
    document.getElementById("next-test").style.display = "none";
    document.querySelector(".result").style.display = "none";
    document.getElementById("mistakes").innerText = "0";
    startTest();
    renderNewQuote();
};

document.getElementById("next-test").addEventListener("click", nextTest);

const startTest = () => {
    mistakes = 0;
    timer = null; 
    time = 60;
    userInput.value = "";
    userInput.disabled = false;
    document.getElementById("timer").innerText = "60s";
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};

const stopTest = () => {
    timer = null;
    time = 0;
    document.getElementById("timer").innerText = "0s";
    displayResult();
};

document.getElementById("start-test").addEventListener("click", startTest);
document.getElementById("stop-test").addEventListener("click", stopTest);

window.onload = () => {
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    document.getElementById("next-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
};
