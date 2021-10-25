// dependencies
const inquirer = require("inquirer");
const connection = require("./connection.js");

//function with list of options
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Quit",
      ],
    })
    // switch statement to handle response
    .then(function (answer) {
      switch (answer.action) {
        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          exit();
          break;
      }
    });
}

//function to view all departments
function viewDepartments() {
    var query = "SELECT department.id, department.name FROM department;";
    connection.query(query, function (err, res) {
      console.table(res);
      runSearch();
    });
  }
  // //function to view all employees
  function viewEmployees() {
    var query =
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
    connection.query(query, function (err, res) {
      console.table(res);
      runSearch();
    });
  }
  
  //function to view all roles
  function viewRoles() {
    var query =
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;";
    connection.query(query, function (err, res) {
      console.table(res);
      runSearch();
    });
  }
  
  // //function to create an employee
  function addEmployee() {
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "roleID",
          type: "input",
          message: "What is the employee's role ID?",
        },
        {
          name: "manID",
          type: "input",
          message: "What is your manager ID?",
        },
      ])
      .then(function (answer) {
        var query =
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        connection.query(
          query,
          [answer.firstName, answer.lastName, answer.roleID, answer.manID],
          function (err, res) {
            if (err) throw err;
            console.log(
              `Successfully Added Employee: ${answer.firstName} ${answer.lastName}`
            );
            runSearch();
          }
        );
      });
  }
  // fuhntion de add a role 
  function addRole() {
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary?",
        },
        {
          name: "departmentID",
          type: "input",
          message:
            "What is the Department ID for this new role? Please select 1 for Sales, 2 for Engineering, 3 for Finance, 4 for Legal.",
          choices: [1, 2, 3, 4],
        },
      ])
      .then(function (answer) {
        var query =
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(
          query,
          [answer.title, answer.salary, answer.departmentID],
          function (err, res) {
            if (err) throw err;
            console.log(`Successfully Added Role: ${answer.title}`);
            runSearch();
          }
        );
      });
  }
  
  //function to create a department
  function addDepartment() {
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "input",
          message: "What is the name of the department you want to add?",
        },
      ])
      .then(function (answer) {
        var query = "INSERT INTO department (name) VALUE (?)";
        connection.query(query, answer.departmentName, function (err, res) {
          if (err) throw err;
          console.log(`Successfully Added Department!`);
          runSearch();
        });
      });
  }
  
  //function to update and employee role
  function updateEmployeeRole() {
    inquirer
      .prompt([
        {
          name: "currentEmployeeID",
          type: "input",
          message: "What is the ID of the employee you want to update?",
        },
        {
          name: "newRoleTitle",
          type: "input",
          message: "What is the title of their new role?",
        },
        {
          name: "newRoleSalary",
          type: "input",
          message: "What is their new salary?",
        },
        {
          name: "newRoleDeptID",
          type: "list",
          message:
            "What is their department? Select 1 for Sales, 2 for Engineering, 3 for Finance, 4 for Legal.",
          choices: [1, 2, 3, 4],
        },
      ])
      .then(function (answer) {
        var query =
          "UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?";
        connection.query(
          query,
          [
            answer.newRoleTitle,
            answer.newRoleSalary,
            answer.newRoleDeptID,
            parseInt(answer.currentEmployeeID),
          ],
          function (err, res) {
            if (err) throw err;
            console.log("Successful Update!");
            runSearch();
          }
        );
      });
  }
  
  function exit() {
    process.exit();
  }
  
  module.exports = runSearch;
