document.addEventListener('DOMContentLoaded', function() {
    function loadParticlesConfig() {
        fetch('../Login/particle-cfg.json')
            .then(response => response.json())
            .then(config => {
                particlesJS('particles-js', config);
            })
            .catch(error => console.error('Error loading particles config:', error));
    }

    loadParticlesConfig();

    document.getElementById('logout-button').addEventListener('click', function() {

        const confirmLogout = confirm("Czy na pewno chcesz się wylogować?");

        if (confirmLogout) {
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = '../Login/loginForm.html';
        } else {

            console.log("Wylogowanie anulowane.");
        }
    });

    document.getElementById("add-folder-btn").addEventListener("click", function() {
        $('#folderModal').modal('show');
    });


    document.getElementById("save-folder-btn").addEventListener("click", function() {
        var folderName = document.getElementById("folder-name").value;

        var folderColor = document.getElementById("folder-color").value;

        var userId = localStorage.getItem('userId');

        if (!userId) {
            alert("Nie uzyskano userId.");
            return;
        }

        fetch('http://localhost:8081/add-folder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: folderName,
                color: folderColor,
                userId: userId
            })
        })
            .then(response => response.json())
            .then(data => {
                $('#folderModal').modal('hide');
                const newFolder = document.createElement("div");
                newFolder.classList.add("new-folder");

                const folderText = document.createElement("div");
                folderText.classList.add("folder-text");
                folderText.textContent = folderName;

                const smallRectangle = document.createElement("div");
                smallRectangle.classList.add("small-rectangle");
                smallRectangle.style.backgroundColor = folderColor;

                newFolder.appendChild(folderText);
                newFolder.appendChild(smallRectangle);

                document.getElementById("content").appendChild(newFolder);
            })
            .catch(error => {
                console.error("Error adding folder:", error);
                alert("There was an error adding the folder.");
            });
    });

    const colorOptions = document.querySelectorAll('.color-option');

    colorOptions.forEach(option => {
        option.addEventListener('click', function() {

            colorOptions.forEach(opt => opt.classList.remove('selected'));

            this.classList.add('selected');

            const selectedColor = this.getAttribute('data-color');
            console.log("Selected Color: " + selectedColor);

            document.getElementById('folder-color').value = selectedColor;
        });
    });

    function loadUserFolders() {
        var userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("Nie uzyskano userId.");
            return;
        }
        fetch(`http://localhost:8081/folders?userId=${userId}`)
            .then(response => response.json())
            .then(folders => {
                folders.forEach(folder => {
                    const newFolder = document.createElement("div");
                    newFolder.classList.add("new-folder");

                    const smallRectangle = document.createElement("div");
                    smallRectangle.classList.add("small-rectangle");
                    smallRectangle.style.backgroundColor = folder.folder_color;

                    newFolder.appendChild(smallRectangle);
                    newFolder.appendChild(document.createTextNode(folder.folder_name));

                    document.getElementById("content").appendChild(newFolder);
                });
            })
            .catch(error => {
                console.error("Error loading folders:", error);
            });
    }

    loadUserFolders();
});
