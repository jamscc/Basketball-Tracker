
const passwordInput = document.querySelector('#password');
const usernameInput = document.querySelector('#username');
const feedback = document.querySelector('#feedback');

function login(event) {
    event.preventDefault();


    const password = passwordInput.value;
    const username = usernameInput.value;

    switch (!(password && username)) {
        case (true):
            return feedback.textContent = "Please enter the username and password.";
        default:
            fetch('/api/users/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((r) => {
                    if (r.ok) {
                        return document.location.replace('/dashboard');
                    } else {
                        return r.json().then((error) => feedback.textContent = error);
                    }
                })
                .catch((error) => { return feedback.textContent = error })
    }
}

document.querySelector('#login').addEventListener('submit', login);

document.querySelector('.sign-in').addEventListener('click', function () {
    return document.location.replace('/signup');
});
