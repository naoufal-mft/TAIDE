// Sélection du conteneur de contenu
const contentContainer = document.getElementById('contentContainer');

// Sélection des boutons
const AAPLBtn = document.getElementById('AAPLBtn');
const TSLABtn = document.getElementById('TSLABtn');
const NIOBtn = document.getElementById('NIOBtn');
const NVDABtn = document.getElementById('NVDABtn');

// Ajoutez des gestionnaires d'événements clic aux boutons correspondants
AAPLBtn.addEventListener('click', function() {
    contentContainer.classList.remove('hidden-content'); // Afficher le contenu lors du clic
});

TSLABtn.addEventListener('click', function() {
    contentContainer.classList.remove('hidden-content'); // Afficher le contenu lors du clic
});

NIOBtn.addEventListener('click', function() {
    contentContainer.classList.remove('hidden-content'); // Afficher le contenu lors du clic
});

NVDABtn.addEventListener('click', function() {
    contentContainer.classList.remove('hidden-content'); // Afficher le contenu lors du clic
});
