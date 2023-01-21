const gamess = document.querySelectorAll('.game-link');

gamess.forEach(game => {

    game.addEventListener('click', function () {
        const gameId = this.querySelector('p:first-child').innerHTML;
        return document.location.replace('/games/' + gameId);
    });
});

document.querySelector('.compare-link').addEventListener('click', function () {
    const playerId = this.querySelector('p:first-child').innerHTML;
        return document.location.replace('/compare/' + playerId);
});


