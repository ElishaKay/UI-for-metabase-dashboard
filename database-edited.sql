
create table users(
	id int Auto_increment primary key,
	username varchar(100),
	password varchar(100)
);

CREATE INDEX client_id ON client(client_id);

CREATE INDEX post_id ON post(post_id);


create table post (
    post_id int(11) UNSIGNED NOT NULL Auto_increment primary key,
    text varchar(1000),
    client_id int(11) UNSIGNED NOT NULL,
    likes int,
    foreign key(client_id) references client(client_id)
);


create table comment (
    comment_id int Auto_increment primary key,
    text varchar(1000),
    client_id int(11) UNSIGNED NOT NULL,
    post_id int(11) UNSIGNED NOT NULL,
    foreign key(client_id) references client(client_id),
    foreign key(post_id) references post(post_id)
);
