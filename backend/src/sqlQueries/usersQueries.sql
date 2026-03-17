/*RULES
Un étudiant a plusieurs cours
Un cours acceuil plusieurs étudiants

Un cours se déroule dans une classe
Une classe acceuille plusieurs cours

Un étudiant a plusieurs bulettins
Un bulettin appartient à un seul étudiant

Un étudiant a plusieurs factures
Une facture appartient à un seul étudiant
*/

/*Table utilisateurs*/
use myUADatabase;

create table users (
	id int,
    lastname varchar(255),
    firstname varchar(255),
    email varchar(255),
    userrole varchar(255),
    isActivated varchar(255),
    department varchar(255),
    tel varchar(255),
    dateOfBirth date
);
/*add picture property*/

select * from users;

insert into users (id, lastname, firstname, email, userrole, isActivated, department, tel, dateOfBirth)
values (1, 'SAEBA', 'Ryo', 'ryo@saeba.com', 'student', 'true', 'science', '', '2000-03-26');

drop table users;