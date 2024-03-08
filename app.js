// Fonction pour générer le hash SHA-256 d'une URL (fonction que l'on peut importer via un autre fichier)
function generateHash(url) {
  return new Promise((resolve, reject) => {
    const data = new TextEncoder().encode(url);
    crypto.subtle
      .digest('SHA-256', data)
      .then((hashBuffer) => {
        const hashHex = Array.from(new Uint8Array(hashBuffer))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        resolve(hashHex);
      })
      .catch(reject);
  });
}

// Fonction pour créer et partager l'URL (fonction que l'on peut importer via un autre fichier)
function createAndShareUrl() {
  const userInput = document.getElementById('message').value;
  document.getElementById('message').value = '';

  //On encode le message grâce à la méthode btoa()
  const encodedMessage = btoa(encodeURIComponent(userInput));
  const sharedUrl =
    window.location.href.split('?')[0] + '?message=' + encodedMessage;

  //On ajoute le Hash à l'URL
  generateHash(sharedUrl)
    .then((hash) => {
      const urlHashed = sharedUrl + '#' + hash;
      console.log(urlHashed, hash);
      document.getElementById('url').textContent = urlHashed;
    })
    .catch((error) => {
      console.error('Erreur lors de la génération du hash :', error);
    });

  document.getElementById('copyBtn').style.display = 'block';

  //On fait disparaître le formulaire d'entrée
  document.getElementById('myForm').style.display = 'none';
}

// Fonction qui permet de décoder le message caché dans l'URL

// EventListener pour le clic sur le bouton de création d'URL
document
  .getElementById('createBtn')
  .addEventListener('click', createAndShareUrl);

// EventListener pour le clic sur le bouton de copie d'URL
document.getElementById('copyBtn').addEventListener('click', function () {
  const urlToCopy = document.getElementById('url').textContent;

  //On crée la fonction qui permet de copier l'URL au click
  navigator.clipboard
    .writeText(urlToCopy)
    .then(() => alert("L'URL a été copiée dans le presse-papiers."))
    .catch((err) => console.error("Erreur lors de la copie de l'URL :", err));
});
