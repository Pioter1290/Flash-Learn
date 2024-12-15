document.addEventListener('DOMContentLoaded', (event) => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const rememberMe = localStorage.getItem('rememberMe') === 'true';

    if (rememberMe) {
        emailInput.value = localStorage.getItem('email') || '';
        passwordInput.value = localStorage.getItem('password') || '';
        rememberMeCheckbox.checked = true;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const values = {
            email: emailInput.value,
            password: passwordInput.value
        };
        

        const errors = validate(values);
        emailError.textContent = errors.email;
        passwordError.textContent = errors.password;

        if (!errors.email && !errors.password) {
            try {
                const res = await axios.post('http://localhost:8081/login', values);
                if (res.data.message === "Success") {
                    localStorage.setItem('userId', res.data.userId);
                    if (rememberMeCheckbox.checked) {
                        localStorage.setItem('rememberMe', true);
                        localStorage.setItem('email', values.email);
                        localStorage.setItem('password', values.password);
                    } else {
                        localStorage.removeItem('rememberMe');
                        localStorage.removeItem('email');
                        localStorage.removeItem('password');
                    }
                    const folders = await fetchFolders(res.data.userId);
                    window.location.href = '/page';
                } else {
                    alert(res.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        }
    });

    function validate(values) {
        const errors = {};
        if (!values.email) {
            errors.email = 'Email is required';
        }
        if (!values.password) {
            errors.password = 'Password is required';
        }
        return errors;
    }

    async function fetchFolders(userId) {
        try {
            const res = await axios.get('http://localhost:8081/folders', {
                headers: { 'userId': userId }
            });

            if (res.status === 200) {
                localStorage.setItem('folders', JSON.stringify(res.data));
                return res.data;
            }
        } catch (err) {
            console.log("Error fetching folders:", err);
            return [];
        }
    }
});
