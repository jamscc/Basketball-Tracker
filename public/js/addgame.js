const addFeedback = document.querySelector('#add-feedback');
const gamegameId = document.querySelectorAll('.game-game-id');
const gameSelection = document.querySelector('.game-selection');
const gameDateData = document.querySelectorAll('.game-date-data');
const gameDates = [];
// Gets list of gameDates to prevent entering statistics twice for the same game
for (let i = 0; i < gameDateData.length; i++) {
    gameDates.push(gameDateData[i].innerHTML);
}

function addGame(event) {
    event.preventDefault();

    const gameDateFormat = document.querySelector('#game-date').value.split('-');
    const notes = document.querySelector('#notes').value;
    const win = document.querySelector('#win').checked;
    const score = document.querySelector('#score').value;
    const assists = document.querySelector('#assists').value;
    const points = document.querySelector('#points').value;
    const rebounds = document.querySelector('#rebounds').value;
    //Prevents double entries
    const gameYearDigits = gameDateFormat[0].split('');
    const gameDate = gameDateFormat[1] + "/" + gameDateFormat[2] + "/" + gameYearDigits[2] + gameYearDigits[2];
    if (!gameDates.includes(gameDate)) {
        console.log(gameDate)
        fetch('/api/users/newgame', {
            method: 'POST',
            body: JSON.stringify({
                gameDate,
                notes,
                win,
                score,
                assists,
                points,
                rebounds
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => {
                if (r.ok) {
                    return document.location.replace('/dashboard');
                } else {
                    return r.json().then((error) => addFeedback.textContent = error);
                }
            })
            .catch((error) => { return addFeedback.textContent = error })
    } else {
        document.querySelector('#notes').value = "Statistics already entered for that date!"
    }
}

document.querySelector('#new-game').addEventListener('submit', addGame);

// Sets both date and score of the entry to the game in the dropdown
// Or sets them to ""
gameSelection.addEventListener('change', function () {
    if (gameSelection.value === "New Game Entry") {
        document.querySelector('#game-date').value = "";
        document.querySelector('#score').value = "";
        document.querySelector('#game-date').disabled = false;
        document.querySelector('#score').disabled = false;
    } else {
        const pastDate = gameSelection.value.split(" ");
        const gameDateFormat = pastDate[0].split('/')
        document.querySelector('#game-date').value = "20" + gameDateFormat[2] + "-" + gameDateFormat[0] + "-" + gameDateFormat[1];
        document.querySelector('#score').value = pastDate[1];
        document.querySelector('#game-date').disabled = true;
        document.querySelector('#score').disabled = true;
    }

});