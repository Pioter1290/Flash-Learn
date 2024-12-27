document.getElementById("RegisterForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const userData = {
        name: name,
        email: email,
        password: password
    };

    fetch('http://localhost:8081/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Signup successful") {
                alert('Rejestracja zakończona sukcesem!');
                window.location.href = '/Flash-Learn/Frontend/Login/LoginForm.html';
            } else {
                alert('Coś poszło nie tak! Spróbuj ponownie.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Błąd połączenia z serwerem. Spróbuj ponownie.');
        });
});
