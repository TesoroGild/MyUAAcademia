# MyUAAcademiaB
Il s'agit du backend de l'application https://github.com/TesoroGild/MyUAAcademia.


# Prérequis
Visual Studio : https://visualstudio.microsoft.com/fr/downloads/
MyUAAcademia : https://github.com/TesoroGild/MyUAAcademia


# Lancement du projet
Cloner le projet :
```bash
git clone https://github.com/TesoroGild/MyUAAcademiaB
```
Ouvrir ce projet avec Visual studio préalablement téléchargé.
Pour lancer le projet/voir les routes api via swagger, cliquer sur 



# Développement

## Base de données
Mettre à jour une migration
```bash
Add-Migration InitialCreate
```
Appliquer la migration
```bash
Update-Database
```

# Troubbleshouting
1. Migration de .NET 8 vers .NET9. 

Afin d'utiliser automapper, je me suis apperçu que je tournait sur une ancienne version de .net. Je l'ai donc upgrade avec les problèmes de dépendances et de fichiers obsolètes. J'ai crée une nouvelle branche avant de commencer. Avec dotnet outdated --upgrade, un clean, un build, un run et une vidange du cache, mon application tournait de nouveau.

2. Mise en place de l’authentification

Au départ, j’ai hésiter sur quelle méthode choisir pour gérer correctement l’authentification entre mon backend en .NET et mon frontend en React. J'ai finalement opté pour l'approche coockies et jwt.

3. Login

Quand l’utilisateur se connecte, le backend génère un JWT signé et l’envoie dans un cookie HttpOnly (SESSION_ID). Au début je ne voyais pas ce cookie dans mon frontend. La solution a été de passer de http vers https pour mon backend car les propriétés HttpOnly et Secure renvoient le token seulement en https (ou du moins c'est beaucoup moins casse-tête).


4. Gestion de la reconnexion (fermeture de page / redémarrage PC)

Lorsque je fermais le navigateur, mon user était stateless donc je perdais ses informations pourtant le token était toujours là. J'ai donc eu de faire un getUser sur le code dans le token afin de réafficher les informations utilisateur.

# TODOS
* Enregistrer les fichiers des utilisateurs selon chaque programme inscrit.
* Logique de session pour s'inscrire aux cours
* Visuel pour indiquer les cours réussis en vérifiant le bulletin.