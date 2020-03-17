# Test developpeur Mobibam

Merci de vous prêter au jeu du test de développement Mobibam !


Durée : 1 heure
Technos du test : TypeScript, Vue, Axios et un tout petit peu de Buefy ...


1. Présentation
Le projet est une application qui permet de gérer des membres définis par un email et un mot de passe.
La gestion de ces membres est accessible sous forme d'une SPA (frontend), et d'une API (backend).


2. Structures des dossiers
* Le fichier './index.html' permet le chargement du frontend.
* Le dossier './src/back' contient les fichiers source du backend.
* Le dossier './src/front' contient les fichiers source du frontend.
* Le dossier './dist' contient les bundles des applications frontend et backend (respectivement 'back-app.bundle' et 'front-app.bundle').
* Le dossier './repositiories' contient le fichier utilisé pour la persistences des données.


3. Build et exécution 
* Pour lancer le build du backend il suffit d'effectuer un 'ALT' + 'Ctrl' + 'B', ou lancer la commande : `node ./build.js --back-only`
* Pour exécuter le backend sélectionner 'Debug' / 'Start debugging' ou 'Run Without Debugging'

* Pour lancer le build du frontend : `node ./build.js --front-only`   
  Une fois la première exécution du build effectuée, le build est relancé automatiquement à chaque sauvegarde d'un fichier du dossier './src/front'.
* Copiez dans le navigateur l'URL suivante : http://localhost:8086/


4. Le test peut commencer !

Tâche N°1 :   
Implémenter la fonctionnalité de suppression d'un membre.
Vous devez utiliser l'opération delete dans le service, exposer l'opération delete via le controller, et faire un appel à cette opération dans le frontend (App.vue).
La suppession est déclenchée en cliquant sur 'Delete' de la carte du membre.


Tâche N°2 :   
Sur le même modèle, implémenter la fonctionnalité de modification de l'email d'un membre sans modifier le mot de passe déjà enregistré.
Vous devez implémenter le service, le controller, et App.vue.
La modification est déclenchée en cliquant sur 'Save' de la carte du membre.


Tâche N°3 :   
Ajoutez une contrainte d'unicité sur les emails (pas de doublon). Cette contrainte s'applique lors de l'ajout et de la mise à jour d'un membre.
Le front doit afficher une notification si cette contrainte n'est pas respectée.


Tâche N°4 (option) :
Vous pouvez ajouter la feature que vous souhaitez, améliorer une partie de code, proposer une gestion des erreurs, bref tout ce que que vous voulez
du moment que c'est en rapport avec le test :-)

5. Rendu

Ajout d'une commande de build pour webpack ainsi qu'une commande nodemon pour l'environnement dev avec le hot reload. Ajout de `watch: true` dans la config webpack de la partie back.

Lancement du projet après re-configuration de l'environnement dev :

* `npm i`
* `npm run build`
* `npm run start`

Temps passé :

* 20 min de découverte et prise en main du projet
* 20 min de configuration
* 1h40 de dev

Difficultés :

* Prise en main du language Typescript

