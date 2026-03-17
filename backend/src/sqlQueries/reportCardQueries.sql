/*Bulettin Table*/
create table report_card (
	id int,
	notes varchar(255),
	idCours int,
	idStudent int
);

insert into report_card (id, notes, idCours, idStudent)
values (1, 15, 1, 1),
	(2, 13, 2, 1),
	(3, 17, 3, 1),
	(4, 11, 4, 1),
	(5, 20, 5, 1),
	(6, 12, 1, 2),
	(7, 18, 2, 2),
	(8, 14, 3, 2),
	(9, 16, 4, 2),
	(10, 20, 5, 2),
	(11, 18, 6, 2);

select * from report_card;

drop table report_card;