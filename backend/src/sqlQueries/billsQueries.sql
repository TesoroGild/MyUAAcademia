/*Bills Table*/
create table bills (
	id int,
	dateofissue date,
	sessionE varchar(255),
	idCours int,
	idStudent int
);

insert into bills (id, dateofissue, sessionE, idCours, idStudent)
values (1, '2024-06-09', 'Ete', 1, 1),
	(2, '2024-06-09', 'Ete', 2, 1),
	(3, '2024-06-09', 'Ete', 3, 1),
	(4, '2024-06-09', 'Ete', 4, 1),
	(5, '2024-06-09', 'Ete', 5, 1),
	(6, '2024-06-09', 'Ete', 1, 2),
	(7, '2024-06-09', 'Ete', 2, 2),
	(8, '2024-06-09', 'Ete', 3, 2),
	(9, '2024-06-09', 'Ete', 4, 2),
	(10, '2024-06-09', 'Ete', 5, 2);

alter table bills
add amount int;

select * from bills;

drop table bills;