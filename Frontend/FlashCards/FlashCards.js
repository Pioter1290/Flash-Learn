document.addEventListener('DOMContentLoaded', function() {
    console.log(localStorage.getItem('selectedFolderId'));
    const addButton = document.getElementById('add-folder-btn');
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
                    alert("Flashcard added successfully!");
                    folderModal.hide();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was an error adding the flashcard.");
            });

        // Reset the form and close the modal
        document.getElementById('flashcard-form').reset();
    });
});
