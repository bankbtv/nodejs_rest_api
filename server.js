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
    console.log('MySQL successfully connected!');
})

app.use(express.json());


function res_sccess_data(res, data) {
    return res.status(200).json({
        RespCode: 200,
        RespMessage: 'success',
        log: data
    })
}

function res_sccess(res) {
    return res.status(200).json({
        RespCode: 200,
        RespMessage: 'success',
        log: 0
    })
}

function res_notfund(res) {
    return res.status(200).json({
        RespCode: 400,
        RespMessage: 'bad: not found data.',
        log: 1
    })
}

function res_invalid_input(res) {
    return res.status(200).json({
        RespCode: 400,
        RespMessage: 'Invalid input data',
        log: 0
    });
}

function res_base_error(res, err) {
    return res.status(500).json({
        RespCode: 500,
        RespMessage: 'Database query error',
        log: err
    });
}

function res_exit(res, message) {
    return res.status(200).json({ message: message })
}

function catch_error(err) {
    console.log("Err :", err)
    return res.status(200).json({
        RespCode: 400,
        RespMessage: 'bad',
        log: 0
    })
}


//users

//get all users
app.get("/api/get/users", auth, (_rep, res) => {
    try {
        connection.query('select * from users;', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (data && data[0])
                    res_notfund(res);
                res_sccess_data(res, data);
            })
    }
    catch (err) {
        catch_error(err)
    }
})

//get user by emp_id
app.get('/api/get/user', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!id) {
            res_invalid_input(res);
        }
        connection.query('select * from users where emp_id = ?;',
            [id],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            })
    }
    catch (err) {
        catch_error(err);
    }
})

//create user
app.post("/api/create/user", auth, (req, res) => {
    try {
        const { user_email, user_password, access, emp_id } = req.body
        if (!(user_email && user_password && access && emp_id))
            res_invalid_input(res);

        connection.query(
            "select * from users where user_email = ?",
            [user_email],
            (err, results, _fields) => {
                if (err)
                    res_base_error(res, err);
                if (results && results[0])
                    res_exit(res, "user exit");

                connection.query(
                    "insert into users(user_email,user_password,access,emp_id) values(?,MD5(?),?,?)",
                    [user_email, user_password, access, emp_id],
                    (err, _results, _fields) => {
                        if (err)
                            res_base_error(res, err);
                        res_sccess(res);
                    }
                )
            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//update user
app.put("/api/update/user", auth, (req, res) => {
    try {
        const { user_id, user_email, user_password, access, emp_id } = req.body
        if (!(user_id && user_email && user_password && access && emp_id))
            res_invalid_input(res);

        connection.query(
            "select * from users where user_email = ?",
            [user_email],
            (err, results, _fields) => {
                if (!results[0])
                    res_exit(res, "user exit");
                if (err)
                    res_base_error(res, err);

                connection.query(
                    "update users set user_email = ?,user_password = MD5(?), access = ?, emp_id = ? where user_id = ?",
                    [user_email, user_password, access, emp_id, user_id],
                    (err, _results, _fields) => {
                        if (err)
                            res_base_error(res, err);
                        res_sccess(res);
                    }
                )

            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//reset user password
app.put("/api/reset/user", auth, (req, res) => {
    try {
        const { user_id } = req.body
        if (!user_id)
            res_invalid_input(res);

        connection.query(
            "update users set user_password = MD5(?) where user_id = ?",
            [1234, user_id],
            (err, _results, _fields) => {
                if (err)
                    res_base_error(res, err);
                res_sccess(res);
            }
        )
    } catch (err) {
        catch_error(err);
    }
})


//employees

//get all employees
app.get('/api/get/emps', auth, (_rep, res) => {
    try {
        connection.query('select * from employees;', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            })
    }
    catch (err) {
        catch_error(err);
    }
})

//get employee by emp_id
app.get('/api/get/emp', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!id)
            res_invalid_input(res);

        connection.query('select * from employees where emp_id = ?;',
            [id],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            })
    }
    catch (err) {
        catch_error(err);
    }

})


//indicators

//get all indicators
app.get('/api/get/indicators', auth, (_req, res) => {
    try {
        connection.query('select * from indicators', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);

                data.forEach(element => {
                    element.type_access = element.type_access.split(",");
                });
                res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        catch_error(err);
    }
})

//create indicator
app.post('/api/create/indicator', auth, (req, res) => {
    try {
        const { title, type_access, group_id } = req.body;
        if (!(title && type_access && group_id))
            res_invalid_input(res);

        connection.query(
            "insert into indicators(title,type_access,group_id) values(?,?,?)",
            [title, type_access, group_id],
            (err, _results, _fields) => {
                if (err)
                    res_base_error(res, err);

                connection.query('select * from indicators', [],
                    (err, data, _fil) => {
                        if (err)
                            res_base_error(res, err);

                        connection.query('select * from indicators where idt_id = ?', [data.length],
                            (err, data, _fil) => {
                                if (err)
                                    res_base_error(res, err);
                                res_sccess_data(res, data);
                            }
                        )
                    }
                )
            }
        )

    } catch (err) {
        catch_error(err);
    }
})


//groups

//get all groups
app.get('/api/get/groups', auth, (_req, res) => {
    try {
        connection.query('select * from groups', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        catch_error(err);
    }
})

//create group
app.post('/api/create/group', auth, (req, res) => {
    try {
        const { title } = req.body;
        if (!(title))
            res_invalid_input(res),

                connection.query(
                    "insert into groups(title) values(?)",
                    [title],
                    (err, _results, _fields) => {
                        if (err)
                            res_base_error(res, err);

                        connection.query('select * from groups', [],
                            (err, data, _fil) => {
                                if (err)
                                    res_base_error(res, err);

                                connection.query('select * from groups where group_id = ?', [data.length],
                                    (err, data, _fil) => {
                                        if (err)
                                            res_base_error(res, err);

                                        res_sccess_data(res, data);
                                    }
                                )
                            }
                        )
                    }
                )

    } catch (err) {
        catch_error(err);
    }
})


//score levels

//get all score levels
app.get('/api/get/score/levels', auth, (_req, res) => {
    try {
        connection.query('select * from score_levels', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        catch_error(err);
    }
})

//create score level
app.post('/api/score/level', auth, (req, res) => {
    try {
        const { emp_type, scr_g1, scr_g2, scr_g3 } = req.body;
        if (!(emp_type && scr_g1 && scr_g2 && scr_g3))
            res_invalid_input(res);

        connection.query(
            "insert into score_levels(emp_type,scr_g1,scr_g2,scr_g3) values(?,?,?,?)",
            [emp_type, scr_g1, scr_g2, scr_g3],
            (err, _results, _fields) => {
                if (err)
                    res_base_error(res, err);

                connection.query('select * from score_levels', [],
                    (err, data, _fil) => {
                        if (err)
                            res_base_error(res, err);

                        connection.query('select * from score_levels where sl_id = ?', [data.length],
                            (err, data, _fil) => {
                                if (err)
                                    res_base_error(res, err);
                                res_sccess_data(res, data);
                            }
                        )
                    }
                )
            }
        )

    } catch (err) {
        console.log('Err:', err);
        return res.status(500).json({
            RespCode: 500,
            RespMessage: 'Internal server error',
            log: 0
        });
    }
})


//score types

//get all score types
app.get('/api/get/score/types', auth, (_req, res) => {
    try {
        connection.query('select * from score_types', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        catch_error(err);
    }
})

//create score type
app.post('/api/score/type', auth, (req, res) => {
    try {
        const { s_range, s_type } = req.body;
        if (!(s_range && s_type))
            res_notfund(res);

        connection.query(
            "insert into score_types(s_range,s_type) values(?,?)",
            [s_range, s_type],
            (err, _results, _fields) => {
                if (err)
                    res_base_error(res, err);

                connection.query('select * from score_types', [],
                    (err, data, _fil) => {
                        if (err)
                            res_base_error(res, err);

                        connection.query('select * from score_types where st_id = ?', [data.length],
                            (err, data, _fil) => {
                                if (err)
                                    res_base_error(res, err);
                                res_sccess_data(res, data);
                            }
                        )
                    }
                )
            }
        )

    } catch (err) {
        catch_error(err);
    }
})


//turn

//get all turns
app.get('/api/get/turns', auth, (_req, res) => {
    try {
        connection.query('select * from turns order by status desc', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                data.forEach(element => {
                    element.idt_ids = element.idt_ids.split(",");
                    element.st_id = element.st_id.split(",");
                    element.sl_id = element.sl_id.split(",");
                })
                res_sccess_data(res, data);
            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//get all turns by emp_id
app.get('/api/get/turns/user', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            res_invalid_input(res);

        connection.query('select * from details where emp_id = ?', [id],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                const ids = [];
                if (!(data && data[0]))
                    res_sccess_data(res, ids);
                let completedQueries = 0;
                data.forEach((detail) => {
                    connection.query('select * from turns where turn_id = ?', [detail.turn_id],
                        (err, data, _fil) => {
                            if (err)
                                res_base_error(res, err);
                            if (data&&data[0]&&data[0].status == 1)
                                ids.push(data[0])
                            completedQueries++;
                            if (completedQueries === data.length) {
                                 res_sccess_data(res, ids);
                            }
                        }
                    )
                })
            }
        )
    }
    catch (err) {
        catch_error(err);
    }
})

//create turn
app.post('/api/create/turn', auth, (req, res) => {
    try {
        const { title, idt_ids, st_id, sl_id } = req.body;
        if (!(title && idt_ids && st_id && sl_id))
            res_invalid_input(res);

        var s_idt_ids = idt_ids.toString();
        var s_st_id = st_id.toString();
        var s_sl_id = sl_id.toString();

        connection.query(
            "insert into turns(title, idt_ids, st_id, sl_id) values(?,?,?,?)",
            [title, s_idt_ids, s_st_id, s_sl_id],
            (err, _results, _fields) => {
                if (err)
                    res_base_error(res, err);

                connection.query('select * from turns',
                    (err, data, _fil) => {
                        if (err)
                            res_base_error(res, err);
                        return res.status(200).json({
                            RespCode: 200,
                            RespMessage: { log: 'success', id: data.length }
                        })
                    }
                )

            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//update turn
app.put('/api/update/turn', auth, (req, res) => {
    try {
        const { turn_id, title, idt_ids, st_id, sl_id } = req.body;
        if (!(turn_id && title && idt_ids && st_id && sl_id))
            res_invalid_input(res);
        var s_idt_ids = idt_ids.toString();
        var s_st_id = st_id.toString();
        var s_sl_id = sl_id.toString();

        connection.query(
            "select * from turns where turn_id = ?",
            [turn_id],
            (err, results, _fields) => {
                if (err)
                    res_base_error(res, err);

                if (!(results && results[0]))
                    res_notfund(res);
                connection.query(
                    "update turns set title = ?,idt_ids = ?, st_id = ?, sl_id = ? where turn_id = ?",
                    [title, s_idt_ids, s_st_id, s_sl_id, turn_id],
                    (err, data, _fields) => {
                        if (err)
                            res_base_error(res, err);
                        if(data)
                            res_sccess(res);
                    }
                )

            }
        )

    } catch (err) {
        catch_error(err);
    }
})

//update turn status
app.put('/api/update/turn/status', auth, (req, res) => {
    try {
        const { turn_id, status } = req.body;
        if (!(turn_id && status)) {
            res_invalid_input(res);
        }

        connection.query(
            "select * from turns where turn_id = ?",
            [turn_id],
            (err, results, _fields) => {
                if (err)
                    res_base_error(res, err);

                if (!(results && results[0]))
                    res_notfund(res);
                connection.query(
                    "update turns set status = ? where turn_id = ?",
                    [status, turn_id],
                    (err, _data, _fields) => {
                        if (err)
                            res_base_error(res, err);
                        res_sccess(res);
                    }
                )

            }
        )

    } catch (err) {
        catch_error(err);
    }
})

//delete turn
app.delete('/api/delete/turn', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            res_invalid_input(res);
        connection.query(
            "select * from turns where turn_id = ?",
            [id],
            (err, results, _fields) => {
                if (err)
                    res_base_error(res, err);

                if (!(results && results[0]))
                    res_notfund(res);
                connection.query(
                    "delete from details where turn_id = ?",
                    [id],
                    (err, _results, _fields) => {
                        if (err)
                            res_base_error(res, err);
                        connection.query(
                            "delete from turns where turn_id = ?",
                            [id],
                            (err, _results, _fields) => {
                                if (err)
                                    res_base_error(res, err);
                                res_sccess(res);
                            }
                        )
                    }
                )
            }
        )
    } catch (err) {
        catch_error(err);
    }
})


//detail

//get all details
app.get('/api/get/details', auth, (_req, res) => {
    try {
        connection.query('select * from details', [],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);

            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//get all details by emp_id
app.get('/api/get/details/emp', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            res_invalid_input(res);
        connection.query('select * from details where emp_id = ?', [id],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//get all details by turn_id
app.get('/api/get/details/turn', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            res_invalid_input(res);
        connection.query('select * from details where turn_id = ?', [id],
            (err, data, _fil) => {
                if (err)
                    res_base_error(res, err);
                if (!(data && data[0]))
                    res_notfund(res);
                res_sccess_data(res, data);
            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//creatr datail
app.post('/api/create/detail', auth, (req, res) => {
    try {
        const { emp_id, turn_id } = req.body;
        if (!(emp_id && turn_id))
            res_invalid_input(res);

        connection.query(
            "selete * from details where emp_id = ? and turn_id = ?",
            [emp_id, turn_id],
            (err, results, _fields) => {
                if (err)
                    res_base_error(res, err);
                if (results && results[0])
                    res_exit(res, "detail exit");
                connection.query(
                    "insert into details(emp_id,turn_id) values(?,?)",
                    [emp_id, turn_id],
                    (err, _results, _fields) => {
                        if (err)
                            res_base_error(res, err);
                        res_sccess(res);
                    }
                )
            }
        )
    } catch (err) {
        catch_error(err);
    }
})

//creatr datails
app.post('/api/create/details', auth, (req, res) => {
    try {
        const { emp_id, turn_id } = req.body;
        if (!(emp_id && turn_id))
            res_invalid_input(res);

        let query = 'INSERT INTO details(emp_id, turn_id) VALUES ';
        emp_id.forEach((id, index) => {
            query += `(${id}, ${turn_id})`;
            if (index < emp_id.length - 1) {
                query += ', ';
            }
        });

        connection.query(
            query,
            (err, _results, _fields) => {
                if (err)
                    res_base_error(res, err);
                res_sccess(res);
            }
        )

    } catch (err) {
        catch_error(err);
    }
})

//delete datail
app.delete('/api/delete/detail', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            res_invalid_input(res);

        connection.query(
            "delete from details where detail_id = ?",
            [id],
            (err, _results, _fields) => {
                if (err)
                    res_base_error(res, err);
                res_sccess(res);
            }
        )
    } catch (err) {
        catch_error(err);
    }
})


//login

//login
app.post('/api/login', (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        if (!(user_email && user_password))
            res_invalid_input(res);

        connection.query(
            "SELECT * FROM users WHERE user_email = ?;",
            [user_email],
            (err, results, _fields) => {
                if (err)
                    res_base_error(res, err);

                if (!results.length > 0) {
                    return res.status(404).json({
                        RespCode: 404,
                        RespMessage: 'User not found',
                        log: 0
                    });
                }
                const user = results[0];
                const md5 = crypto.createHash('md5');
                const password = md5.update(user_password).digest('hex');

                if (!user.user_password === password) {
                    return res.status(404).json({
                        RespCode: 404,
                        RespMessage: 'Password not match',
                        log: 0
                    });
                }

                connection.query(
                    "SELECT * FROM employees WHERE emp_id = ?;",
                    [user.emp_id],
                    (err, results, _fields) => {
                        if (err)
                            res_base_error(res, err);

                        if (!(results && results[0]))
                            res_notfund(res);
                        const employee = results[0];
                        const token = jwt.sign(
                            { user_id: user.user_id, user_email },
                            process.env.TOKEN_KEY,
                            {
                                expiresIn: "2h"
                            }
                        )
                        return res.status(200).json({
                            RespCode: 200,
                            RespMessage: 'success',
                            log: {
                                token: token,
                                access: user.access,
                                employee: employee
                            }
                        });
                    }
                );
            }
        );
    } catch (err) {
        catch_error(err);
    }
})

app.listen(4000, () => console.log("server is running on port 4000"));