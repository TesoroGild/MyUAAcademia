/*Classes Table*/
use myUADatabase;

create table classes (
	id int,
	room varchar(255),
	timing varchar(255),
	idcourse int
);

alter table classes
drop column cname;

alter table classes
add room varchar(255),
	timing varchar(255),
	idcourse int;

select * from classes;

drop table classes;