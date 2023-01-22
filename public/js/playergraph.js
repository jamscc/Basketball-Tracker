// Copy of graph.js used to compare two users
const ctx2 = document.getElementById('theirChart');
var htmlPoints = document.querySelectorAll('.playergamePoints');
var htmlAssists = document.querySelectorAll('.playergameAssists');
var htmlRebounds = document.querySelectorAll('.playergameRebounds');
var gameNumber = [];

var gamePoints = [];
var gameAssists = [];
var gameRebounds = [];

function createGraph() {
    for (let i = 0; i < htmlPoints.length; i++) {
        var currentPoints = parseInt(htmlPoints[i].innerHTML);
        var currentAssists = parseInt(htmlAssists[i].innerHTML);
        var currentRebounds = parseInt(htmlRebounds[i].innerHTML);
        gamePoints.push(currentPoints);
        gameAssists.push(currentAssists);
        gameRebounds.push(currentRebounds);
        gameNumber.push(i + 1)
    };
    new Chart(
        ctx2,
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
                radius: 7,
                maintainAspectRatio: false,
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


createGraph();