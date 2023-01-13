const addFeedback = document.querySelector('#add-feedback');

function addGame(event) {
    event.preventDefault();

    const gameDate = document.querySelector('#game-date').value;
    const notes = document.querySelector('#notes').value;
    const win = document.querySelector('#win').checked;
    const score = document.querySelector('#score').value;
    const assists = document.querySelector('#assists').value;
    const points = document.querySelector('#points').value;
    const rebounds = document.querySelector('#rebounds').value;

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
}

document.querySelector('#new-game').addEventListener('submit', addGame);