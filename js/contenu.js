document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from your server using Fetch API
    fetch('/buttons') // Update the URL to match your server endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Parse the data as HTML and append it to the buttonContainer
            document.getElementById('buttonContainer').innerHTML = data;
            
            // Sélectionnez tous les boutons avec une classe commune
            const buttons = document.querySelectorAll('.btn-primary');
            
            // Ajoutez des gestionnaires d'événements clic à tous les boutons
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    contentContainer.classList.remove('hidden-content'); // Afficher le contenu lors du clic
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
