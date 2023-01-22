const gamess = document.querySelectorAll('.game-link');

gamess.forEach(game => {
    //Adds navigation link to each game on the Player page
    game.addEventListener('click', function () {
        const gameId = this.querySelector('p:first-child').innerHTML;
        return document.location.replace('/games/' + gameId);
    });
});

//Adds navigation link to the compare button
document.querySelector('.compare-link').addEventListener('click', function () {
    const playerId = this.querySelector('p:first-child').innerHTML;
        return document.location.replace('/compare/' + playerId);
});


