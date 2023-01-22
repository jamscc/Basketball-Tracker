const gamess = document.querySelectorAll('.game-link');


gamess.forEach(game => {
    // Adds navigation to each game on the dashboard
    game.addEventListener('click', function () {
        const gameId = this.querySelector('p:first-child').innerHTML;
        return document.location.replace('/games/' + gameId);
    });
});






