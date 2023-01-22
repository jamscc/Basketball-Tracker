
function logout() {
    fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    }).then((r) => {
        switch (true) {
            case (r.ok):
                return document.location.replace('/');
            default:
                return feedback.textContent = 'error'
        }
    }).catch((error) => {
        feedback.textContent = error
    })
}

//Nav-Burger dropdown toggle
if (document.querySelector('.navbar-burger')) {
    document.querySelector('.navbar-burger').addEventListener('click', function () {
        if (document.querySelector('#navbarBasicExample').className === "navbar-menu is-active") {
            document.querySelector('#navbarBasicExample').className = "navbar-menu";
        } else {
            document.querySelector('#navbarBasicExample').className = "navbar-menu is-active";
        }
    });
}

//Nav-bar Logo link redirect
document.querySelector('.home-image').addEventListener('click', function () {
    return document.location.replace('/dashboard');
});

//Nav-bar About link redirect
document.querySelector('.about-link').addEventListener('click', function () {
    return document.location.replace('/about');
});


if (document.querySelector('#logging-out')) {
    //Nav-bar menu redirect links if a User is loggedIn
    document.querySelector('#logging-out').addEventListener('click', logout);
    document.querySelector('.dashboard-link').addEventListener('click', function () {
        return document.location.replace('/dashboard');
    });
    document.querySelector('.games-link').addEventListener('click', function () {
        return document.location.replace('/allgames');
    });
} else {
    //Nav-bar menu redirect links if !loggedIn
    document.querySelector('.sign-link').addEventListener('click', function () {
        return document.location.replace('/signup');
    });
    document.querySelector('.log-link').addEventListener('click', function () {
        return document.location.replace('/login');
    });
};