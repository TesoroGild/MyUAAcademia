/*Courses Table*/
use myUADatabase;

create table courses (
	id int,
	sigle varchar(255),
	fullname varchar(255),
	summer int,
	autumn int,
	winter int
);

alter table courses
add summer varchar(255),
	automn varchar(255),
	winter int;

select * from courses;

insert into courses (id, sigle, fullname, summer, automn, winter)
values (1, 'INF3105', 'Algorithm', 1, 0, 1),
	(2, 'INF5190', 'Web avancé', 1, 1, 0),
	(3, 'INF6150', 'Gestion de projets', 0, 0, 1),
	(4, 'INM6000', 'Ethique et société', 1, 0, 0),
	(5, 'INF4170', 'Architecture', 0, 1, 1);

drop table courses;

drop table courses;