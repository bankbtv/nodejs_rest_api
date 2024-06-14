require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const app = express();
const util = require('util');
const { promises } = require('dns');
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
const query = util.promisify(connection.query).bind(connection);


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

function catch_error(res, err) {
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
                    return res_base_error(res, err);
                if (data && data[0])
                    return res_notfund(res);
                return res_sccess_data(res, data);
            })
    }
    catch (err) {
        return catch_error(res, err)
    }
})

//get user by emp_id
app.get('/api/get/user', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!id) {
            return res_invalid_input(res);
        }
        connection.query('select * from users where emp_id = ?;',
            [id],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);
            })
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//create user
app.post("/api/create/user", auth, (req, res) => {
    try {
        const { user_email, user_password, access, emp_id } = req.body
        if (!(user_email && user_password && access && emp_id))
            return res_invalid_input(res);

        connection.query(
            "select * from users where user_email = ?",
            [user_email],
            (err, results, _fields) => {
                if (err)
                    return res_base_error(res, err);
                if (results && results[0])
                    return res_exit(res, "user exit");

                connection.query(
                    "insert into users(user_email,user_password,access,emp_id) values(?,MD5(?),?,?)",
                    [user_email, user_password, access, emp_id],
                    (err, _results, _fields) => {
                        if (err)
                            return res_base_error(res, err);
                        return res_sccess(res);
                    }
                )
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//update user
app.put("/api/update/user", auth, (req, res) => {
    try {
        const { user_id, user_email, user_password, access, emp_id } = req.body
        if (!(user_id && user_email && user_password && access && emp_id))
            return res_invalid_input(res);

        connection.query(
            "select * from users where user_email = ?",
            [user_email],
            (err, results, _fields) => {
                if (!results[0])
                    return res_exit(res, "user exit");
                if (err)
                    return res_base_error(res, err);

                connection.query(
                    "update users set user_email = ?,user_password = MD5(?), access = ?, emp_id = ? where user_id = ?",
                    [user_email, user_password, access, emp_id, user_id],
                    (err, _results, _fields) => {
                        if (err)
                            return res_base_error(res, err);
                        return res_sccess(res);
                    }
                )

            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//reset user password
app.put("/api/reset/user", auth, (req, res) => {
    try {
        const { user_id } = req.body
        if (!user_id)
            return res_invalid_input(res);

        connection.query(
            "update users set user_password = MD5(?) where user_id = ?",
            [1234, user_id],
            (err, _results, _fields) => {
                if (err)
                    return res_base_error(res, err);
                return res_sccess(res);
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})


//employees

//get all employees
app.get('/api/get/emps', auth, (_rep, res) => {
    try {
        connection.query('select * from employees;', [],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);
            })
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//get employee by emp_id
app.get('/api/get/emp', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!id)
            return res_invalid_input(res);

        connection.query('select * from employees where emp_id = ?;',
            [id],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);
            })
    }
    catch (err) {
        return catch_error(res, err);
    }

})


//indicators

//get all indicators
app.get('/api/get/indicators', auth, (_req, res) => {
    try {
        connection.query('select * from indicators', [],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);

                data.forEach(element => {
                    element.type_access = element.type_access.split(",");
                });
                return res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//get all indicators by ids
app.post('/api/get/indicators/ids', auth, (req, res) => {
    try {
        const { ids } = req.body
        if(!ids)
            return res_invalid_input(res);
        connection.query('select * from indicators where idt_id in (?) order by field (idt_id, ?)', [ids.map(Number),ids.map(Number)],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);

                data.forEach(element => {
                    element.type_access = element.type_access.split(",");
                });
                return res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//create indicator
app.post('/api/create/indicator', auth, (req, res) => {
    try {
        const { title, type_access, group_id } = req.body;
        if (!(title && type_access && group_id))
            return res_invalid_input(res);

        connection.query(
            "insert into indicators(title,type_access,group_id) values(?,?,?)",
            [title, type_access, group_id],
            (err, _results, _fields) => {
                if (err)
                    return res_base_error(res, err);

                connection.query('select * from indicators', [],
                    (err, data, _fil) => {
                        if (err)
                            return res_base_error(res, err);

                        connection.query('select * from indicators where idt_id = ?', [data.length],
                            (err, data, _fil) => {
                                if (err)
                                    return res_base_error(res, err);
                                return res_sccess_data(res, data);
                            }
                        )
                    }
                )
            }
        )

    } catch (err) {
        return catch_error(res, err);
    }
})


//groups

//get all groups
app.get('/api/get/groups', auth, (_req, res) => {
    try {
        connection.query('select * from groups', [],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//create group
app.post('/api/create/group', auth, (req, res) => {
    try {
        const { title } = req.body;
        if (!(title))
            return res_invalid_input(res),

                connection.query(
                    "insert into groups(title) values(?)",
                    [title],
                    (err, _results, _fields) => {
                        if (err)
                            return res_base_error(res, err);

                        connection.query('select * from groups', [],
                            (err, data, _fil) => {
                                if (err)
                                    return res_base_error(res, err);

                                connection.query('select * from groups where group_id = ?', [data.length],
                                    (err, data, _fil) => {
                                        if (err)
                                            return res_base_error(res, err);

                                        return res_sccess_data(res, data);
                                    }
                                )
                            }
                        )
                    }
                )

    } catch (err) {
        return catch_error(res, err);
    }
})


//score levels

//get all score levels
app.get('/api/get/score/levels', auth, (_req, res) => {
    try {
        connection.query('select * from score_levels', [],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//create score level
app.post('/api/score/level', auth, (req, res) => {
    try {
        const { emp_type, scr_g1, scr_g2, scr_g3 } = req.body;
        if (!(emp_type && scr_g1 && scr_g2 && scr_g3))
            return res_invalid_input(res);

        connection.query(
            "insert into score_levels(emp_type,scr_g1,scr_g2,scr_g3) values(?,?,?,?)",
            [emp_type, scr_g1, scr_g2, scr_g3],
            (err, _results, _fields) => {
                if (err)
                    return res_base_error(res, err);

                connection.query('select * from score_levels', [],
                    (err, data, _fil) => {
                        if (err)
                            return res_base_error(res, err);

                        connection.query('select * from score_levels where sl_id = ?', [data.length],
                            (err, data, _fil) => {
                                if (err)
                                    return res_base_error(res, err);
                                return res_sccess_data(res, data);
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
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);
            }
        )
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//create score type
app.post('/api/score/type', auth, (req, res) => {
    try {
        const { s_range, s_type } = req.body;
        if (!(s_range && s_type))
            return res_notfund(res);

        connection.query(
            "insert into score_types(s_range,s_type) values(?,?)",
            [s_range, s_type],
            (err, _results, _fields) => {
                if (err)
                    return res_base_error(res, err);

                connection.query('select * from score_types', [],
                    (err, data, _fil) => {
                        if (err)
                            return res_base_error(res, err);

                        connection.query('select * from score_types where st_id = ?', [data.length],
                            (err, data, _fil) => {
                                if (err)
                                    return res_base_error(res, err);
                                return res_sccess_data(res, data);
                            }
                        )
                    }
                )
            }
        )

    } catch (err) {
        return catch_error(res, err);
    }
})


//turn

//get all turns
app.get('/api/get/turns', auth, (_req, res) => {
    try {
        connection.query('select * from turns order by status desc', [],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                data.forEach(element => {
                    element.idt_ids = element.idt_ids.split(",");
                    element.st_id = element.st_id.split(",");
                    element.sl_id = element.sl_id.split(",");
                })
                return res_sccess_data(res, data);
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//get all turns by emp_id
app.get('/api/get/turns/user', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            return res_invalid_input(res);

        connection.query('select * from details where emp_id = ?', [id],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                const ids = [];
                if (!(data && data[0]))
                    return res_sccess_data(res, ids);
                let completedQueries = 0;
                data.forEach((detail) => {
                    connection.query('select * from turns where turn_id = ?', [detail.turn_id],
                        (err, turnData, _fil) => {
                            if (err)
                                return res_base_error(res, err);
                            if (turnData && turnData[0] && turnData[0].status == 1)
                                ids.push(turnData[0])
                            completedQueries++;
                            if (completedQueries === data.length) {
                                return res_sccess_data(res, ids);
                            }
                        }
                    )
                })
            }
        )
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//create turn
app.post('/api/create/turn', auth, (req, res) => {
    try {
        const { title, idt_ids, st_id, sl_id } = req.body;
        if (!(title && idt_ids && st_id && sl_id))
            return res_invalid_input(res);

        var s_idt_ids = idt_ids.toString();
        var s_st_id = st_id.toString();
        var s_sl_id = sl_id.toString();

        connection.query(
            "insert into turns(title, idt_ids, st_id, sl_id) values(?,?,?,?)",
            [title, s_idt_ids, s_st_id, s_sl_id],
            (err, _results, _fields) => {
                if (err)
                    return res_base_error(res, err);

                connection.query('select * from turns',
                    (err, data, _fil) => {
                        if (err)
                            return res_base_error(res, err);
                        return res.status(200).json({
                            RespCode: 200,
                            RespMessage: { log: 'success', id: data[data.length - 1].turn_id }
                        })
                    }
                )

            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//update turn
app.put('/api/update/turn', auth, (req, res) => {
    try {
        const { turn_id, title, idt_ids, st_id, sl_id } = req.body;
        if (!(turn_id && title && idt_ids && st_id && sl_id))
            return res_invalid_input(res);
        var s_idt_ids = idt_ids.toString();
        var s_st_id = st_id.toString();
        var s_sl_id = sl_id.toString();

        connection.query(
            "select * from turns where turn_id = ?",
            [turn_id],
            (err, results, _fields) => {
                if (err)
                    return res_base_error(res, err);

                if (!(results && results[0]))
                    return res_notfund(res);
                connection.query(
                    "update turns set title = ?,idt_ids = ?, st_id = ?, sl_id = ? where turn_id = ?",
                    [title, s_idt_ids, s_st_id, s_sl_id, turn_id],
                    (err, _data, _fields) => {
                        if (err)
                            return res_base_error(res, err);
                        return res_sccess(res);
                    }
                )

            }
        )

    } catch (err) {
        return catch_error(res, err);
    }
})

//update turn status
app.put('/api/update/turn/status', auth, (req, res) => {
    try {
        const { turn_id, status } = req.body;
        if (!(turn_id && status)) {
            return res_invalid_input(res);
        }

        connection.query(
            "select * from turns where turn_id = ?",
            [turn_id],
            (err, results, _fields) => {
                if (err)
                    return res_base_error(res, err);

                if (!(results && results[0]))
                    return res_notfund(res);
                connection.query(
                    "update turns set status = ? where turn_id = ?",
                    [status, turn_id],
                    (err, _data, _fields) => {
                        if (err)
                            return res_base_error(res, err);
                        return res_sccess(res);
                    }
                )

            }
        )

    } catch (err) {
        return catch_error(res, err);
    }
})

//delete turn
app.delete('/api/delete/turn', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            return res_invalid_input(res);
        connection.query(
            "select * from turns where turn_id = ?",
            [id],
            (err, results, _fields) => {
                if (err)
                    return res_base_error(res, err);

                if (!(results && results[0]))
                    return res_notfund(res);
                connection.query(
                    "delete from details where turn_id = ?",
                    [id],
                    (err, _results, _fields) => {
                        if (err)
                            return res_base_error(res, err);
                        query("delete from scores where turn_id = ?",[id])
                        connection.query(
                            "delete from turns where turn_id = ?",
                            [id],
                            (err, _results, _fields) => {
                                if (err)
                                    return res_base_error(res, err);
                                return res_sccess(res);
                            }
                        )
                    }
                )
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})


//detail

//get all details
app.get('/api/get/details', auth, (_req, res) => {
    try {
        connection.query('select * from details', [],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);

            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//get all details by emp_id
app.get('/api/get/details/emp', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            return res_invalid_input(res);
        connection.query('select * from details where emp_id = ?', [id],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                return res_sccess_data(res, data);
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//get all details by turn_id
app.get('/api/get/details/turn', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            return res_invalid_input(res);
        connection.query('select * from details where turn_id = ?', [id],
            (err, data, _fil) => {
                if (err)
                    return res_base_error(res, err);
                if (!(data && data[0]))
                    return res_notfund(res);
                let completedQueries = 0;
                data.forEach((detail) => {
                    connection.query('select * from employees where emp_id = ?;',
                        [detail.emp_id],
                        (err, empData, _fil) => {
                            if (err)
                                return res_base_error(res, err);
                            if (empData && empData[0])
                                detail.emp_id = empData[0];
                            completedQueries++;
                            if (completedQueries === data.length) {
                                return res_sccess_data(res, data);
                            }
                        }
                    )
                })
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//creatr datail
app.post('/api/create/detail', auth, (req, res) => {
    try {
        const { emp_id, turn_id } = req.body;
        if (!(emp_id && turn_id))
            return res_invalid_input(res);

        connection.query(
            "selete * from details where emp_id = ? and turn_id = ?",
            [emp_id, turn_id],
            (err, results, _fields) => {
                if (err)
                    return res_base_error(res, err);
                if (results && results[0])
                    return res_exit(res, "detail exit");
                connection.query(
                    "insert into details(emp_id,turn_id) values(?,?)",
                    [emp_id, turn_id],
                    (err, _results, _fields) => {
                        if (err)
                            return res_base_error(res, err);
                        return res_sccess(res);
                    }
                )
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})

//creatr datails
app.post('/api/create/details', auth, (req, res) => {
    try {
        const { emp_id, turn_id } = req.body;

        if (!(emp_id && turn_id)) {
            return res_invalid_input(res);
        }

        if (!Array.isArray(emp_id)) {
            return res_invalid_input(res);
        }

        let checkQuery = 'SELECT emp_id, turn_id FROM details WHERE (emp_id, turn_id) IN (';
        let checkValues = [];
        let insertQuery = 'INSERT INTO details(emp_id, turn_id) VALUES ';
        let insertValues = [];

        emp_id.forEach((id, index) => {
            checkQuery += '(?, ?)';
            checkValues.push(id, turn_id);
            if (index < emp_id.length - 1) {
                checkQuery += ', ';
            }
        });
        checkQuery += ')';

        connection.query(checkQuery, checkValues, (err, results) => {
            if (err) {
                return res_base_error(res, err);
            }

            const existingPairs = results.map(row => `${row.emp_id}-${row.turn_id}`);
            let firstInsert = true;

            emp_id.forEach(id => {
                if (!existingPairs.includes(`${id}-${turn_id}`)) {
                    if (!firstInsert) {
                        insertQuery += ', ';
                    }
                    insertQuery += '(?, ?)';
                    insertValues.push(id, turn_id);
                    firstInsert = false;
                }
            });

            if (insertValues.length > 0) {
                connection.query(insertQuery, insertValues, (err, _results, _fields) => {
                    if (err) {
                        return res_base_error(res, err);
                    }
                    return res_sccess(res);
                });
            } else {
                return res_sccess(res);
            }
        });

    } catch (err) {
        return catch_error(res, res, err);
    }
});


//delete datail
app.delete('/api/delete/detail', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id))
            return res_invalid_input(res);

        connection.query(
            "delete from details where detail_id = ?",
            [id],
            (err, _results, _fields) => {
                if (err)
                    return res_base_error(res, err);
                return res_sccess(res);
            }
        )
    } catch (err) {
        return catch_error(res, err);
    }
})


//score

//get score by emp and turn
app.get("/api/get/score", auth, (req, res) => {
    try {
        const emp_id = req.query.emp_id;
        const turn_id = req.query.turn_id;
        if (!(emp_id && turn_id))
            return res_invalid_input(res);

        connection.query("select * from scores where emp_id = ? and turn_id = ?", [emp_id, turn_id],
            (err, data) => {
                if (err)
                    return res_base_error(res, err);
                if (data[0])
                    data.forEach(async (element) => {
                        element.score = element.score.split(",").map(Number);
                        element.target_id = await query("select * from employees where emp_id = ?",[element.target_id]);
                    })
                return res_sccess_data(res, data);
            }

        )
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//create score
app.post('/api/create/score', auth, (req, res) => {
    try {
        const { score, emp_id, target_id, turn_id } = req.body;
        if (!(score && emp_id && target_id && turn_id))
            return res_invalid_input(res);
        var score_t = score.toString();
        connection.query("INSERT INTO scores(score,emp_id,target_id,turn_id) VALUES (?,?,?,?)",
            [score_t, emp_id, target_id, turn_id], (err) => {
                if (err)
                    return res_base_error(res, err);
                return res_sccess(res);
            })
    }
    catch (err) {
        return catch_error(res, err);
    }
})

//responst score
app.get('/api/res/score', auth, async (req, res) => {
    try {
        const turn_id = req.query.turn_id;
        if (!turn_id)
            return res_invalid_input(res);

        const details = await query('select * from details where turn_id = ?', [turn_id]);
        if (!details[0]) {
            return res_notfund(res);
        }

        const emp_ids = details.map(element => element.emp_id);

        const [emps, turn] = await Promise.all([
            query('select * from employees where emp_id in (?) order by field (emp_id, ?)', [emp_ids, emp_ids]),
            query('select * from turns where turn_id = ?', [turn_id])
        ]);
        if (!turn[0]) {
            return res_notfund(res);
        }

        const [idts, sls, sts] = await Promise.all([
            query('select * from indicators where idt_id in (?) order by field (idt_id, ?)', [turn[0].idt_ids.split(",").map(Number), turn[0].idt_ids.split(",").map(Number)]),
            query('select * from score_levels where sl_id in (?) order by field (sl_id, ?)', [turn[0].sl_id.split(",").map(Number), turn[0].sl_id.split(",").map(Number)]),
            query('select * from score_types where st_id in (?) order by field (st_id, ?)', [turn[0].st_id.split(",").map(Number), turn[0].st_id.split(",").map(Number)])
        ]);

        // return res_sccess_data(res, { emps, idts, sls, sts});
        // return res_sccess_data(res,Number(emps.find(e=>e.emp_id == 6).emp_level))
        var emp_scores = [];
        var have_vote = [];

        for (const id of emp_ids) {
            var data = {};
            data.emp_id = id;
            data.emp_type = "";
            data.score_all = [];
            data.score_summary = [{ "summary": 0 }];
            data.score_me = [{ "summary": 0 }];

            var emp = emps.find(e => e.emp_id == id);
            var level = Number(emp.emp_level);
            if (level)
                if (level > 3)
                    if (level > 5)
                        emp.emp_type = "ບໍລິຫານລະດັບຕົ້ນ"
                    else
                        emp.emp_type = "ບໍລິຫານລະດັບກາງ"
                else
                    emp.emp_type = "ບໍລິຫານລະດັບສູງ"
            else if (emp.emp_level == 'ວ')
                emp.emp_type = "ລັດຖະກອນວິຊາການ"
            else
                emp.emp_type = "ລັດຖະກອນຊ່ວຍວຽກບໍລິຫານ"
            data.emp_type = emp.emp_type;

            // return res_sccess_data(res,Number(sls.find(sl=>sl.emp_type == data.emp_type)[`scr_g${1}`].substring(0, 2)))

            var scores = await query('select * from scores where target_id = ? and turn_id = ?', [id, turn_id]);

            if (scores[0]) {
                have_vote.push({ vote: scores.length })
                idts.forEach(indicator => {
                    let group_all = data.score_all.find(g => g.group_id === indicator.group_id);
                    let group_me = data.score_me.find(g => g.group_id === indicator.group_id);
                    let group_summary = data.score_summary.find(g => g.group_id === indicator.group_id);

                    if (!group_all) {
                        group_all = {
                            group_id: indicator.group_id,
                            indicators: []
                        };
                        data.score_all.push(group_all);
                    }
                    if (!group_me) {
                        group_me = {
                            group_id: indicator.group_id,
                            indicators: [{ summary: 0 }]
                        };
                        data.score_me.push(group_me);
                    }
                    if (!group_summary) {
                        group_summary = {
                            group_id: indicator.group_id,
                            indicators: [{ summary: 0 }]
                        };
                        data.score_summary.push(group_summary);
                    }

                    group_all.indicators.push({
                        idt_id: indicator.idt_id,
                        score: 0
                    });
                    group_me.indicators.push({
                        idt_id: indicator.idt_id,
                        score: 0
                    });
                    group_summary.indicators.push({
                        idt_id: indicator.idt_id,
                        score: 0
                    });
                });

                scores.forEach((score_data) => {
                    var scoreArray = score_data.score.split(",").map(Number);
                    scoreArray.forEach((element, index) => {
                        const indicator = idts[index];
                        if (indicator) {
                            let group = data.score_all.find(g => g.group_id === indicator.group_id);
                            let ind = group.indicators.find(i => i.idt_id === indicator.idt_id);
                            ind.score += element;

                            if (score_data.emp_id == id) {
                                let group = data.score_me.find(g => g.group_id === indicator.group_id);
                                let ind = group.indicators.find(i => i.idt_id === indicator.idt_id);
                                ind.score += element;
                            }
                        }
                    });
                });

                emp_scores.push(data);
            }
        }

        function round(num) {
            const integerPart = Math.floor(num);
            const decimalPart = num - integerPart;

            if (decimalPart < 0.25) {
                return integerPart;
            } else if (decimalPart < 0.75) {
                return integerPart + 0.5;
            } else {
                return integerPart + 1;
            }
        }
        function get_type(num) {
            var result = "";
            sts.forEach((st, index) => {
                var range = st.s_range.split(",").map(Number);
                if (num >= range[0] && num <= range[1])
                    result = sts[index].s_type;
            })

            return result;
        }

        for (const [Index, emp_score] of emp_scores.entries()) {
            var g_sum_summary = 0;
            var g_sum_me = 0;
            emp_score.score_all.forEach((groups) => {
                var sum_summary = 0;
                var turn_summary = 0;
                var sum_me = 0;
                var turn_me = 0;
                groups.indicators.forEach((inds, index) => {
                    let group = emp_score.score_summary.find(g => g.group_id === groups.group_id);
                    let ind = group.indicators.find(i => i.idt_id === inds.idt_id);
                    ind.score = round(inds.score / have_vote[Index].vote);

                    var persent = Number(sls.find(sl => sl.emp_type == emp_score.emp_type)[`scr_g${groups.group_id}`].substring(0, 2))

                    if (ind.score >= 0) {
                        sum_summary += ind.score;
                        turn_summary++
                    }
                    if (groups.indicators.length == index + 1) {
                        group.indicators[0].summary = round(sum_summary / turn_summary * persent / 100);
                        g_sum_summary += group.indicators[0].summary;
                        sum_summary = 0;
                        turn_summary = 0;
                    }

                    let group_me = emp_score.score_me.find(g => g.group_id === groups.group_id);
                    let ind_me = group_me.indicators.find(i => i.idt_id === inds.idt_id);
                    if (ind_me.score >= 0) {
                        sum_me += ind_me.score;
                        turn_me++
                    }
                    if (groups.indicators.length == index + 1) {
                        group_me.indicators[0].summary = round(sum_me / turn_me * persent / 100);
                        g_sum_me += group_me.indicators[0].summary;
                        sum_me = 0;
                        turn_me = 0;
                    }
                })
            })
            emp_score.score_summary[0].summary = g_sum_summary;
            emp_score.score_summary[0].type = get_type(g_sum_summary);
            emp_score.score_me[0].summary = g_sum_me;
            emp_score.score_me[0].type = get_type(g_sum_me);
        }

        return res_sccess_data(res, emp_scores);

    }
    catch (err) {
        return catch_error(res, err);
    }
})


//login

//login
app.post('/api/login', (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        if (!(user_email && user_password))
            return res_invalid_input(res);

        connection.query(
            "SELECT * FROM users WHERE user_email = ?;",
            [user_email],
            (err, results, _fields) => {
                if (err)
                    return res_base_error(res, err);

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
                            return res_base_error(res, err);

                        if (!(results && results[0]))
                            return res_notfund(res);
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
        return catch_error(res, err);
    }
})

app.listen(4000, () => console.log("server is running on port 4000"));