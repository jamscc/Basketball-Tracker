const ctx = document.getElementById('myChart');
var gamePoints = [];
var gameAssists = [];
var gameRebounds = [];
var gameNumber = [];

function getData() {
    fetch('/getGames', {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
            if(response.ok) {
                response.json().then((data) => {
                    createGraph(data);
                });
            };
        });
};

function createGraph(data){
    for (let i = 0; i < data.length; i++) {
        var currentPoints = data[i].points;
        var currentAssists = data[i].assists;
        var currentRebounds = data[i].rebounds;
        var currentGame = i + 1;
        gamePoints.push(currentPoints);
        gameAssists.push(currentAssists);
        gameRebounds.push(currentRebounds);
        gameNumber.push(currentGame); 
    };

    new Chart(
        ctx,
        {
            type: 'scatter',
            data: {
                labels: gameNumber,
                datasets: [
                    {
                        label: 'points',
                        data: gamePoints,
                    },
                    {
                        label: 'rebounds',
                        data: gameRebounds,
                    },
                    {
                        label: 'assests',
                        data: gameAssists,
                        
                    }
                ]
            },
            options: {
                radius: 10,
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
};


getData();