document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginData = {
        email: email,
        password: password
    };

    fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Success") {
                localStorage.setItem('userId', data.userId);

                window.location.href = '/Flash-Learn/Frontend/MainPage/MainPage.html';
            } else {
                alert('Błędny e-mail lub hasło. Spróbuj ponownie.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Błąd połączenia z serwerem. Spróbuj ponownie.');
        });
});
