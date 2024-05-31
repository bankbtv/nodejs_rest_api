require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const app = express();
// Mysql connect
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'employeetest'
})

connection.connect((err) => {
    if (err) {
        console.log('error to connect to MySQL database: ', err)
        return;
    }
    console.log('MySQL successsfully connected!');
})

app.use(express.json());

//get all users
app.get("/api/get/users", auth, (_rep, res) => {
    try {
        connection.query('select * from users;', [],
            (_err, data, _fil) => {
                if (data && data[0]) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                        log: data
                    })
                }
                else {
                    console.log('result : not data.')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: not found data.',
                        log: 1
                    })
                }
            })
    }
    catch (err) {
        console.log("Err :", err)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            log: 0
        })
    }
})

//get user by emp_id
app.get('/api/get/user', auth, (req, res) => {
    var id = req.query.id
    if (id) {
        try {
            connection.query('select * from users where emp_id = ?;',
                [id],
                (_err, data, _fil) => {
                    if (data && data[0]) {
                        return res.status(200).json({
                            RespCode: 200,
                            RespMessage: 'success',
                            log: data
                        })
                    }
                    else {
                        console.log('Err : not found data.')
                        return res.status(200).json({
                            RespCode: 400,
                            RespMessage: 'bad: not found data.',
                            log: 1
                        })
                    }
                })
        }
        catch (err) {
            console.log("Err :", err)
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad',
                log: 0
            })
        }
    }
    else {
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'No id',
            log: 0
        })
    }
})

//create user
app.post("/api/create/user", auth, (req, res) => {
    const { user_email, user_password, access, emp_id } = req.body
    if (user_email && user_password && access && emp_id) {
        try {
            connection.query(
                "insert into users(user_email,user_password,access,emp_id) values(?,MD5(?),?,?)",
                [user_email, user_password, access, emp_id],
                (err, _results, _fields) => {
                    if (err) {
                        console.log("error while inserting a user into the database", err)
                        return res.status(400).send();
                    }
                    return res.status(201).json({ message: "new user successfully created!" })
                }
            )
        } catch (error) {
            console.log(err);
            return res.status(400).send();
        }
    }
    else {
        return res.status(200).json({
            RespCode: 400,
            RespMessage: `Invalid input data`,
            log: 0
        })
    }
})

//update user
app.put("/api/update/user", auth, (req, res) => {
    const { user_id, user_email, user_password, access, emp_id } = req.body
    if (user_id && user_email && user_password && access && emp_id) {
        try {
            connection.query(
                "update users set user_email = ?,user_password = MD5(?), access = ?, emp_id = ? where user_id = ?",
                [user_email, user_password, access, emp_id, user_id],
                (err, results, _fields) => {
                    if (results) {
                        return res.status(201).json({ message: "success." });
                    }
                    else {
                        console.log(err);
                        return res.status(500).send();
                    }
                }
            )
        } catch (error) {
            console.log(err);
            return res.status(500).send();
        }
    }
    else {
        return res.status(400).json({
            RespCode: 400,
            RespMessage: `Invalid input data`,
            log: 0
        })
    }
})

//get all employees
app.get('/api/get/emps', auth, (_rep, res) => {
    try {
        connection.query('select * from employees;', [],
            (_err, data, _fil) => {
                if (data && data[0]) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                        log: data
                    })
                }
                else {
                    console.log('Err : not found data.')
                    return res.status(400).json({
                        RespCode: 400,
                        RespMessage: 'bad: not found data.',
                        log: 1
                    })
                }
            })
    }
    catch (err) {
        console.log("Err :", err)
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'bad',
            log: 0
        })
    }
})

//get employee by emp_id
app.get('/api/get/emp', auth, (req, res) => {
    var id = req.query.id
    if (id) {
        try {
            connection.query('select * from employees where emp_id = ?;',
                [id],
                (_err, data, _fil) => {
                    if (data && data[0]) {
                        return res.status(200).json({
                            RespCode: 200,
                            RespMessage: 'success',
                            log: data
                        })
                    }
                    else {
                        console.log('Err : not found data.')
                        return res.status(400).json({
                            RespCode: 400,
                            RespMessage: 'bad: not found data.',
                            log: 1
                        })
                    }
                })
        }
        catch (err) {
            console.log("Err :", err)
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'bad',
                log: 0
            })
        }
    }
    else {
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'no id',
            log: 0
        })
    }
})

//login
app.post('/api/login', (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        if (!(user_email && user_password)) {
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }

        connection.query(
            "SELECT * FROM users WHERE user_email = ?;",
            [user_email],
            (err, results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                if (results.length > 0) {
                    const user = results[0];
                    const md5 = crypto.createHash('md5');
                    const password = md5.update(user_password).digest('hex');

                    if (user.user_password === password) {
                        connection.query(
                            "SELECT * FROM employees WHERE emp_id = ?;",
                            [user.emp_id],
                            (err, results, _fields) => {
                                if (err) {
                                    return res.status(500).json({
                                        RespCode: 500,
                                        RespMessage: 'Database query error',
                                        log: err
                                    });
                                }

                                if (results.length > 0) {
                                    const employee = results[0];
                                    const token = jwt.sign(
                                        { user_id: user.user_id, user_email},
                                        process.env.TOKEN_KEY,
                                        {
                                            expiresIn: "2h"
                                        }
                                    )
                                    return res.status(200).json({
                                        RespCode: 200,
                                        RespMessage: 'Success',
                                        log: {
                                            token: token,
                                            access: user.access,
                                            employee: employee
                                        }
                                    });
                                } else {
                                    return res.status(404).json({
                                        RespCode: 404,
                                        RespMessage: 'Employee not found',
                                        log: 0
                                    });
                                }
                            }
                        );
                    } else {
                        return res.status(404).json({
                            RespCode: 404,
                            RespMessage: 'Password not match',
                            log: 0
                        });
                    }
                } else {
                    return res.status(404).json({
                        RespCode: 404,
                        RespMessage: 'User not found',
                        log: 0
                    });
                }
            }
        );
    } catch (err) {
        console.log('Err:', err);
        return res.status(500).json({
            RespCode: 500,
            RespMessage: 'Internal server error',
            log: 0
        });
    }
})

app.listen(4000, () => console.log("server is running on port 4000"));