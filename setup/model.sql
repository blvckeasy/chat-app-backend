CREATE DATABASE chatapp;
\c chatapp;

DROP TABLE users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    ID SERIAL PRIMARY KEY,
    PROFILE_IMG_URL VARCHAR(256),
    FULL_NAME VARCHAR(256),
    USERNAME VARCHAR(64) UNIQUE NOT NULL,
    PASSWORD VARCHAR(64) NOT NULL,
    BIO VARCHAR(256),
    SOCKET_ID VARCHAR(64),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DELETED_AT TIMESTAMP
);


DROP TABLE messages CASCADE;
CREATE TABLE IF NOT EXISTS messages (
    ID SERIAL PRIMARY KEY,
    FROM_USER_ID INTEGER REFERENCES users(ID),
    TO_USER_ID INTEGER REFERENCES users(ID),
    MESSAGE VARCHAR(2048) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DELETED_AT TIMESTAMP
);

DROP TABLE statuses CASCADE;
CREATE TYPE STATUS_ENUM AS ENUM ('ONLINE', 'OFFLINE');
CREATE TABLE IF NOT EXISTS statuses (
    ID SERIAL PRIMARY KEY,
    USER_ID INTEGER REFERENCES users(ID),
    STATUS STATUS_ENUM NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password) values ('blvckeasy', 'islom1234');
INSERT INTO users (username, password) values ('ivan', 'gryaz123');

INSERT INTO messages (FROM_USER_ID, TO_USER_ID, MESSAGE) VALUES (1, 2, 'HELLO');
INSERT INTO messages (FROM_USER_ID, TO_USER_ID, MESSAGE) VALUES (2, 1, 'HI');
INSERT INTO messages (FROM_USER_ID, TO_USER_ID, MESSAGE) VALUES (1, 2, 'WHAT IS YOUR NAME ?');
INSERT INTO messages (FROM_USER_ID, TO_USER_ID, MESSAGE) VALUES (2, 1, 'WHAT ?');
INSERT INTO messages (FROM_USER_ID, TO_USER_ID, MESSAGE) VALUES (1, 2, 'WHAT IS YOUR NAME');
INSERT INTO messages (FROM_USER_ID, TO_USER_ID, MESSAGE) VALUES (2, 1, 'MY NAME IS TONY');
INSERT INTO messages (FROM_USER_ID, TO_USER_ID, MESSAGE) VALUES (1, 2, 'NICE TOO MEET YOU');

insert into messages (from_user_id, to_user_id, message) values (2, 1, 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.');
insert into messages (from_user_id, to_user_id, message) values (1, 4, 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.');
insert into messages (from_user_id, to_user_id, message) values (1, 5, 'Nullam varius.');
insert into messages (from_user_id, to_user_id, message) values (1, 2, 'Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.');
insert into messages (from_user_id, to_user_id, message) values (1, 2, 'Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.');
insert into messages (from_user_id, to_user_id, message) values (3, 2, 'Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.');
insert into messages (from_user_id, to_user_id, message) values (2, 1, 'Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.');
insert into messages (from_user_id, to_user_id, message) values (3, 2, 'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue.');
insert into messages (from_user_id, to_user_id, message) values (3, 1, 'Sed vel enim sit amet nunc viverra dapibus.');
insert into messages (from_user_id, to_user_id, message) values (4, 1, 'Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.');
insert into messages (from_user_id, to_user_id, message) values (1, 5, 'Integer ac neque.');
insert into messages (from_user_id, to_user_id, message) values (2, 4, 'Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis.');
insert into messages (from_user_id, to_user_id, message) values (2, 4, 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.');
insert into messages (from_user_id, to_user_id, message) values (4, 5, 'Sed ante. Vivamus tortor.');
insert into messages (from_user_id, to_user_id, message) values (5, 3, 'Duis ac nibh.');
insert into messages (from_user_id, to_user_id, message) values (5, 2, 'Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla.');
insert into messages (from_user_id, to_user_id, message) values (3, 2, 'Vestibulum ac est lacinia nisi venenatis tristique.');
insert into messages (from_user_id, to_user_id, message) values (4, 1, 'Vestibulum ac est lacinia nisi venenatis tristique.');
insert into messages (from_user_id, to_user_id, message) values (5, 2, 'In quis justo. Maecenas rhoncus aliquam lacus.');
insert into messages (from_user_id, to_user_id, message) values (1, 5, 'Morbi porttitor lorem id ligula.');
insert into messages (from_user_id, to_user_id, message) values (4, 1, 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.');
insert into messages (from_user_id, to_user_id, message) values (3, 2, 'Ut at dolor quis odio consequat varius.');
insert into messages (from_user_id, to_user_id, message) values (4, 2, 'Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.');
insert into messages (from_user_id, to_user_id, message) values (5, 1, 'Quisque ut erat. Curabitur gravida nisi at nibh.');
insert into messages (from_user_id, to_user_id, message) values (4, 3, 'In est risus, auctor sed, tristique in, tempus sit amet, sem.');
insert into messages (from_user_id, to_user_id, message) values (3, 1, 'In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl.');
insert into messages (from_user_id, to_user_id, message) values (5, 4, 'Integer ac leo.');
insert into messages (from_user_id, to_user_id, message) values (1, 3, 'Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.');
insert into messages (from_user_id, to_user_id, message) values (4, 1, 'Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.');
insert into messages (from_user_id, to_user_id, message) values (2, 3, 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue.');
insert into messages (from_user_id, to_user_id, message) values (4, 5, 'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.');
insert into messages (from_user_id, to_user_id, message) values (4, 5, 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.');
insert into messages (from_user_id, to_user_id, message) values (4, 1, 'Vestibulum rutrum rutrum neque.');
insert into messages (from_user_id, to_user_id, message) values (3, 4, 'Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.');
insert into messages (from_user_id, to_user_id, message) values (3, 2, 'Aliquam sit amet diam in magna bibendum imperdiet.');
insert into messages (from_user_id, to_user_id, message) values (1, 5, 'Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.');
insert into messages (from_user_id, to_user_id, message) values (1, 2, 'Morbi a ipsum. Integer a nibh.');
insert into messages (from_user_id, to_user_id, message) values (2, 1, 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.');
insert into messages (from_user_id, to_user_id, message) values (5, 1, 'Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.');
insert into messages (from_user_id, to_user_id, message) values (3, 2, 'Nulla justo.');
insert into messages (from_user_id, to_user_id, message) values (4, 2, 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.');