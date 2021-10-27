use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 110000, 1),
    ('Salesperson', 65000, 1),
    ('Lead Engineer', 1350000, 2),
    ('Software Engineer', 127000, 2),
    ('Account Manager', 100000, 3),
    ('Accountant', 120000, 3),
    ('Legal Team Lead', 180000, 4),
    ('Lawyer', 300000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Mehreen', 'Cobb', 1, null),
    ('Janet', 'Stewart', 3, null),
    ('Kairon', 'Clegg', 5, null),
    ('Eddison', 'Burgess', 7, 1),
    ('Raj', 'Deleon', 2, 1),
    ('Laith', 'Mcarthur', 4, 3),
    ('Blaine', 'Kavanagh', 6, 5);

