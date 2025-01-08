document.addEventListener('DOMContentLoaded', function() {
    //console.log(localStorage.getItem('selectedFolderId'));
    const addButton = document.getElementById('add-flashcard-btn');
    const folderModal = new bootstrap.Modal(document.getElementById('folderModal'));

    addButton.addEventListener('click', function() {
        folderModal.show();
    });


    const saveButton = document.getElementById('save-folder-btn');
    saveButton.addEventListener('click', function() {
        const question = document.getElementById('flashcardQuestion').value;
        const answer = document.getElementById('flashcardAnswer').value;
        const folderId = localStorage.getItem('selectedFolderId');

        if (!question || !answer || !folderId) {
            alert("Please fill in all fields.");
            return;
        }

        const data = {
            question: question,
            answer: answer,
            folder_id: folderId
        };

        fetch('http://localhost:8081/add-flashcard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    console.error("Error:", result.error);
                    alert(result.error);
                } else {

                    folderModal.hide();
                    printFlashcard();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error adding the flashcard.");
            });

        document.getElementById('flashcard-form').reset();


    });
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
    function loadParticlesConfig() {
        fetch('../Login/particle-cfg.json')
            .then(response => response.json())
            .then(config => {
                particlesJS('particles-js', config);
            })
            .catch(error => console.error('Error loading particles config:', error));
    }

    loadParticlesConfig();



    document.getElementById("edit-folder-btn").addEventListener("click", function () {
        editFlashcard();
    });

    function editFlashcard() {
        const folderId = localStorage.getItem('selectedFolderId');
        if (!folderId) {
            console.error("No folder ID found in localStorage.");
            alert("Please select a folder to edit.");
            return;
        }
        fetch(`http://localhost:8081/flashcards?folder_id=${folderId}`)
            .then(response => response.json())
            .then(data => {
                flashcards = data;
                const editFolderSelect = document.getElementById("editFlashcardSelect");
                editFolderSelect.innerHTML = '<option value="" disabled selected>Select a flashcard</option>';
                flashcards.forEach(flashcard => {
                    const option = document.createElement("option");
                    option.value = flashcard.flashcard_id;
                    option.textContent = flashcard.flashcard_question;
                    editFolderSelect.appendChild(option);
                });
                $('#editFlashcard').modal('show');
            })
            .catch(error => console.error('Error:', error));
    }

    document.getElementById("edit-save-folder-btn").addEventListener("click", function () {
        const flashcardId = document.getElementById("editFlashcardSelect").value;
        const updatedQuestion = document.getElementById("editFlashcardQuestion").value;
        const updatedAnswer = document.getElementById("editFlashcardAnswer").value;

        if (!flashcardId || !updatedQuestion || !updatedAnswer) {
            alert("Please select a flashcard and provide both a question and an answer.");
            return;
        }

        const data = {
            flashcardId: flashcardId,
            question: updatedQuestion,
            answer: updatedAnswer
        };

        fetch(`http://localhost:8081/edit-flashcard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    console.error('Error:', result.error);
                    alert(result.error);
                } else {
                    $('#editFlashcard').modal('hide');
                    alert("Flashcard updated successfully");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error updating the flashcard.");
            });
    });



    document.getElementById("delete-folder-btn").addEventListener("click", function () {
        deleteFlashcard();
    });
    function deleteFlashcard() {
        const folderId = localStorage.getItem('selectedFolderId');
        if (!folderId) {
            console.error("No folder ID found in localStorage.");
            alert("Please select a folder to delete flashcards from.");
            return;
        }

        fetch(`http://localhost:8081/flashcards?folder_id=${folderId}`)
            .then(response => response.json())
            .then(data => {
                const deleteFolderSelect = document.getElementById("deleteFlashcardSelect");
                deleteFolderSelect.innerHTML = '<option value="" disabled selected>Select a flashcard</option>';
                data.forEach(flashcard => {
                    const option = document.createElement("option");
                    option.value = flashcard.flashcard_id;
                    option.textContent = flashcard.flashcard_question;
                    deleteFolderSelect.appendChild(option);
                });
                $('#deleteFlashcard').modal('show');
            })
            .catch(error => console.error('Error fetching flashcards:', error));
    }

    document.getElementById("delete-flashcard").addEventListener("click", function () {
        const flashcardId = document.getElementById("deleteFlashcardSelect").value;

        if (!flashcardId) {
            alert("Please select a flashcard to delete.");
            return;
        }

        fetch(`http://localhost:8081/delete-flashcard/${flashcardId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete the flashcard.");
                }
                return response.json();
            })
            .then(result => {

                $('#deleteFlashcard').modal('hide');
                deleteFlashcard();
            })
            .catch(error => {
                console.error("Error deleting flashcard:", error);
                alert("Failed to delete the flashcard.");
            });
    });

    let flashcards = document.querySelectorAll('.flashcard');

    flashcards.forEach(flashcard => {
        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('flipped');
        });
    });


        let currentIndex = 0;

        function fetchFlashcards() {
            const folderId = localStorage.getItem('selectedFolderId');
            if (!folderId) {
                console.error("No folder ID found in localStorage.");
                alert("Please select a folder.");
                return;
            }

            fetch(`http://localhost:8081/flashcards?folder_id=${folderId}`)
                .then(response => response.json())
                .then(data => {
                    flashcards = data;
                    if (flashcards.length > 0) {
                        currentIndex = 0;
                        printFlashcard();
                    } else {
                        alert("No flashcards found in this folder.");
                    }
                })
                .catch(error => console.error('Error:', error));
        }

        function printFlashcard() {
            if (flashcards.length === 0) {
                console.error("No flashcards available to display.");

                return;
            }
            const flashcard = flashcards[currentIndex];
            document.getElementById('flashcard-question').textContent = flashcard.flashcard_question;
            document.getElementById('flashcard-answer').textContent = flashcard.flashcard_answer;
        }

        document.getElementById("next-btn").addEventListener("click", function() {
            if (flashcards.length === 0) return;
            currentIndex = (currentIndex + 1) % flashcards.length;
            printFlashcard();
        });

        document.getElementById("prev-btn").addEventListener("click", function() {
            if (flashcards.length === 0) return;
            currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
            printFlashcard();
        });

        fetchFlashcards();




});
