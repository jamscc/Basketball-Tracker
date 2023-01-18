// const feedback = document.querySelector('#feedback');

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

document.querySelector('.home-image').addEventListener('click', function () {
    return document.location.replace('/');
});

if (document.querySelector('#logging-out')) {
    document.querySelector('#logging-out').addEventListener('click', logout);
    document.querySelector('.dashboard-link').addEventListener('click', function () {
        return document.location.replace('/dashboard');
    });
} else {
    document.querySelector('.sign-link').addEventListener('click', function () {
        return document.location.replace('/signup');
    });
    document.querySelector('.log-link').addEventListener('click', function () {
        return document.location.replace('/login');
    });
};