Create database Agenda;

use agenda;

Create table tarefa (
tarefa_id int Primary Key Auto_increment,
titulo varchar(60) not null,
descricao varchar(255),
data_criacao timestamp, 
data_finalizacao timestamp
);

insert into tarefa(titulo,descricao,data_criacao) Values ('Enviar Trabalho do Sr.Ronnison', 'Enviar Tarefa 01 Av2',Current_Timestamp);

select * from Tarefa;
