# client-serveur
Pour lancer le serv : 

Ne pas oublier de faire ça :
export DATABASE_NAME="nom_base_de_donnée"
export DATABASE_PASSWORD="votre_mot_de_passe"

mvn clean install
mvn clean compile ; mvn --projects backend spring-boot:run

Notre projet a était testé sur une machine Linux sous Ubuntu avec le moteur de recherche Firefox 136.0 (64-bit).