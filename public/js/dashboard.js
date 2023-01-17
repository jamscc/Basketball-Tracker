document.querySelector('.game-link').addEventListener('click', function () {
    const gameId = this.querySelector('p:first-child').innerHTML;
    console.log(gameId);
    return document.location.replace('/games/'+ gameId);
});