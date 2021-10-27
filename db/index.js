// dependencies
const inquirer = require("inquirer");
const connection = require("./connection.js");
const cTable = require("console.table");

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

//get departments as an array
var getDeptArr = () => {
  return new Promise((resolve, reject) => {
    var depts = [];
    connection.query("SELECT name FROM department", function (err, res) {
      if (err) {
        reject(err);
      } else {
        res.forEach((element) => {
          depts.push(element.name);
        });
        resolve(depts);
      }
    });
  });
};

//function to get department id
var getDeptId = (dept) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM department WHERE name=?",
      dept,
      function (err, resp) {
        if (err) {
          reject(err);
        } else {
          resolve(resp[0].id);
        }
      }
    );
  });
};

//function to get an array of the current roles
var getRolesArr = () => {
  return new Promise((resolve, reject) => {
    var roles = [];
    connection.query("SELECT title FROM role", function (err, res) {
      if (err) {
        reject(err);
      } else {
        res.forEach((element) => {
          roles.push(element.title);
        });
        resolve(roles);
      }
    });
  });
};

//function to get an array of the current employees
var getEmployeesArr = () => {
  return new Promise((resolve, reject) => {
    var employees = [];
    connection.query(
      "SELECT first_name, last_name FROM employee",
      function (err, res) {
        if (err) {
          reject(err);
        } else {
          res.forEach((element) => {
            employees.push(element.first_name + " " + element.last_name);
          });
          resolve(employees);
        }
      }
    );
  });
};

//function to get the id of an employee
var getEmployeeId = (name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM employee WHERE first_name=? AND last_name=?",
      name.split(" "),
      function (err, resp) {
        if (err) {
          reject(err);
        } else {
          resolve(resp[0].id);
        }
      }
    );
  });
};

//function to get the id of a role
var getRoleId = (role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM role WHERE title=?",
      role,
      function (err, resp) {
        if (err) {
          reject(err);
        } else {
          resolve(resp[0].id);
        }
      }
    );
  });
};

//function to view all departments
viewDepartments = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    const table = cTable.getTable(res);
    console.log(table);
    main();
  });
};
// //function to view all employees
viewEmployees = () => {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
  connection.query(query, function (err, res) {
    console.table(res);
    main();
  });
};

//function to view all roles
viewRoles = () => {
  connection.query("SELECT * FROM role", function (err, res) {
    const table = cTable.getTable(res);
    console.log(table);
    main();
  });
};

// //function to create an employee
addEmployee = async () => {
  try {
    const rolesArr = await getRolesArr();
    const employeeArr = await getEmployeesArr();
    employeeArr.push("No Manager");

    const inqRes = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the first name of the employee? ",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the last name of the employee?  ",
      },
      {
        type: "list",
        name: "role",
        message: "What is the new employees role? ",
        choices: rolesArr,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employees manager? ",
        choices: employeeArr,
      },
    ]);
    if (inqRes.manager === "No Manager") {
      var managerId = null;
    } else {
      var managerId = await getEmployeeId(inqRes.manager);
    }
    const roleId = await getRoleId(inqRes.role);

    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: inqRes.firstName,
        last_name: inqRes.lastName,
        role_id: roleId,
        manager_id: managerId,
      },
      function (err, res) {
        if (err) throw err;
        console.log(
          "Succesfully created employee " +
            inqRes.firstName +
            " " +
            inqRes.lastName +
            "\n"
        );

        runSearch();
      }
    );
  } catch (err) {
    if (err) throw err;
  }
};
// fuhntion de add a role
addRole = async () => {
  try {
    const deptArr = await getDeptArr();

    const inqRes = await inquirer.prompt([
      {
        type: "input",
        name: "role",
        message: "What is the title of the role? ",
      },
      {
        type: "number",
        name: "salary",
        message: "What is the salary for this role? ",
      },
      {
        type: "list",
        name: "dept",
        message: "Which department is this role paced in? ",
        choices: deptArr,
      },
    ]);
    const deptId = await getDeptId(inqRes.dept);
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: inqRes.role,
        salary: inqRes.salary,
        department_id: deptId,
      },
      function (err, res) {
        if (err) throw err;
        console.log("Succesfully created " + inqRes.role + " role.\n");

        runSearch();
      }
    );
  } catch (err) {
    if (err) throw err;
  }
};

//function to create a department
addDepartment = async () => {
  try {
    const inqRes = await inquirer.prompt([
      {
        type: "input",
        name: "deptName",
        message: "What is the name of the department? ",
      },
    ]);

    connection.query(
      "INSERT INTO department (name) VALUES (?)",
      inqRes.deptName,
      function (err, res) {
        if (err) throw err;
        console.log(
          "Succesfully created " + inqRes.deptName + " department.\n"
        );

        runSearch();
      }
    );
  } catch {
    if (err) throw err;
  }
};

//function to update and employee role
updateEmployeeRole = async () => {
  try {
    const rolesArr = await getRolesArr();
    const employeeArr = await getEmployeesArr();

    const inqRes = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to update? ",
        choices: employeeArr,
      },
      {
        type: "list",
        name: "role",
        message: "What would you like their new role to be? ",
        choices: rolesArr,
      },
    ]);

    const roleId = await getRoleId(inqRes.role);
    const employeeId = await getEmployeeId(inqRes.employee);

    connection.query(
      "UPDATE employee SET role_id=? WHERE id=?",
      [roleId, employeeId],
      function (err, res) {
        if (err) throw err;
        console.log("Succesfully updated employee role \n");

        runSearch();
      }
    );
  } catch (err) {
    if (err) throw err;
  }
};

function exit() {
  process.exit();
}

module.exports = runSearch;
