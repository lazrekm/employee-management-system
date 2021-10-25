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
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Mehreen', 'Cobb', 1, null),
    ('Janet', 'Stewart', 3, null),
    ('Kairon', 'Clegg', 5, null),
    ('Eddison', 'Burgess', 7, null),
    ('Raj', 'Deleon', 2, 1),
    ('Laith', 'Mcarthur', 4, 3),
    ('Blaine', 'Kavanagh', 6, 5),
    ('Connar', 'Mullen', 8, 7);
