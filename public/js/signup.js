const passwordInput = document.querySelector('#password');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const feedback = document.querySelector('#feedback');

function signUp(event) {
    event.preventDefault();

    const password = passwordInput.value;
    const username = usernameInput.value;
    const email = emailInput.value;

    switch (true) {
        case (!(password && username && email)):
            return feedback.textContent = "Please enter a username, an email, and a password.";
        case (password.length < 8):
            return feedback.textContent = "A min of 8 characters for the password";
        default:
            fetch('/api/users/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
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

document.querySelector('#sign-up').addEventListener('submit', signUp);
