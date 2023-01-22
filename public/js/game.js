const players = document.querySelectorAll('.player-link');
const currentuser = document.querySelector('.loggedId').innerHTML;
players.forEach(player => {
    // Adds navigation to each player returned on the specific game page
    player.addEventListener('click', function () {
        const playerId = this.querySelector('p:first-child').innerHTML;
        if (playerId === currentuser) {
            return document.location.replace('/dashboard');
        } else {
            return document.location.replace('/players/' + playerId);
        }
    });
});
