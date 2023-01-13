const feedback = document.querySelector('#feedback');

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

document.querySelector('#logging-out').addEventListener('click', logout);