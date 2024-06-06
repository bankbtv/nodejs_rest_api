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

//users

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
                "select * from users where user_email = ?",
                [user_email],
                (_err, results, _fields) => {
                    if (results && results[0]) {
                        console.log("user exit")
                        return res.status(300).json({ message: "user exit" })
                    }
                    connection.query(
                        "insert into users(user_email,user_password,access,emp_id) values(?,MD5(?),?,?)",
                        [user_email, user_password, access, emp_id],
                        (err, _results, _fields) => {
                            if (err) {
                                console.log("error while inserting a user into the database", err)
                                return res.status(200).json({ message: "error while inserting a user into the database", err })
                            }
                            return res.status(200).json({ message: "new user successfully created!" })
                        }
                    )
                }
            )
        } catch (error) {
            console.log(err);
            return res.status(200).send();
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
                "select * from users where user_email = ?",
                [user_email],
                (_err, results, _fields) => {
                    if (results && results[0]) {
                        console.log("user exit")
                        return res.status(300).send();
                    }
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

                }
            )
        } catch (error) {
            console.log(err);
            return res.status(500).send();
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

//reset user password
app.put("/api/reset/user", auth, (req, res) => {
    const { user_id } = req.body
    if (user_id) {
        try {
            connection.query(
                "update users set user_password = MD5(?) where user_id = ?",
                [1234, user_id],
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
        return res.status(200).json({
            RespCode: 400,
            RespMessage: `Invalid input data`,
            log: 0
        })
    }
})


//employees

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
            RespMessage: 'no id',
            log: 0
        })
    }
})


//indicators

//get all indicators
app.get('/api/get/indicators', auth, (_req, res) => {
    try {
        connection.query('select * from indicators', [],
            (_err, data, _fil) => {
                if (data && data[0]) {
                    data.forEach(element => {
                        element.type_access = element.type_access.split(",");
                    });
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
            }
        )
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

//create indicator
app.post('/api/create/indicator', auth, (req, res) => {
    try {
        const { title, type_access, group_id } = req.body;
        if (!(title && type_access && group_id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }

        connection.query(
            "insert into indicators(title,type_access,group_id) values(?,?,?)",
            [title, type_access, group_id],
            (err, _results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                connection.query('select * from indicators', [],
                    (_err, data, _fil) => {
                        if (err) {
                            return res.status(500).json({
                                RespCode: 500,
                                RespMessage: 'Database query error',
                                log: err
                            });
                        }

                        connection.query('select * from indicators where idt_id = ?', [data.const()],
                            (_err, data, _fil) => {
                                if (err) {
                                    return res.status(500).json({
                                        RespCode: 500,
                                        RespMessage: 'Database query error',
                                        log: err
                                    });
                                }

                                return res.status(200).json({
                                    RespCode: 200,
                                    RespMessage: 'success',
                                    log: data
                                })
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


//groups

//get all groups
app.get('/api/get/groups', auth, (_req, res) => {
    try {
        connection.query('select * from groups', [],
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
            }
        )
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

//create group
app.post('/api/create/group', auth, (req, res) => {
    try {
        const { title } = req.body;
        if (!(title)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }

        connection.query(
            "insert into groups(title) values(?)",
            [title],
            (err, _results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                connection.query('select * from groups', [],
                    (_err, data, _fil) => {
                        if (err) {
                            return res.status(500).json({
                                RespCode: 500,
                                RespMessage: 'Database query error',
                                log: err
                            });
                        }

                        connection.query('select * from groups where group_id = ?', [data.const()],
                            (_err, data, _fil) => {
                                if (err) {
                                    return res.status(500).json({
                                        RespCode: 500,
                                        RespMessage: 'Database query error',
                                        log: err
                                    });
                                }

                                return res.status(200).json({
                                    RespCode: 200,
                                    RespMessage: 'success',
                                    log: data
                                })
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


//score levels

//get all score levels
app.get('/api/get/score/levels', auth, (_req, res) => {
    try {
        connection.query('select * from score_levels', [],
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
            }
        )
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

//create score level
app.post('/api/score/level', auth, (req, res) => {
    try {
        const { emp_type, scr_g1, scr_g2, scr_g3 } = req.body;
        if (!(emp_type && scr_g1 && scr_g2 && scr_g3)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }

        connection.query(
            "insert into score_levels(emp_type,scr_g1,scr_g2,scr_g3) values(?,?,?,?)",
            [emp_type, scr_g1, scr_g2, scr_g3],
            (err, _results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                connection.query('select * from score_levels', [],
                    (_err, data, _fil) => {
                        if (err) {
                            return res.status(500).json({
                                RespCode: 500,
                                RespMessage: 'Database query error',
                                log: err
                            });
                        }

                        connection.query('select * from score_levels where sl_id = ?', [data.const()],
                            (_err, data, _fil) => {
                                if (err) {
                                    return res.status(500).json({
                                        RespCode: 500,
                                        RespMessage: 'Database query error',
                                        log: err
                                    });
                                }

                                return res.status(200).json({
                                    RespCode: 200,
                                    RespMessage: 'success',
                                    log: data
                                })
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
            }
        )
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

//create score type
app.post('/api/score/type', auth, (req, res) => {
    try {
        const { s_range, s_type } = req.body;
        if (!(s_range && s_type)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }

        connection.query(
            "insert into score_types(s_range,s_type) values(?,?)",
            [s_range, s_type],
            (err, _results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                connection.query('select * from score_types', [],
                    (_err, data, _fil) => {
                        if (err) {
                            return res.status(500).json({
                                RespCode: 500,
                                RespMessage: 'Database query error',
                                log: err
                            });
                        }

                        connection.query('select * from score_types where st_id = ?', [data.const()],
                            (_err, data, _fil) => {
                                if (err) {
                                    return res.status(500).json({
                                        RespCode: 500,
                                        RespMessage: 'Database query error',
                                        log: err
                                    });
                                }

                                return res.status(200).json({
                                    RespCode: 200,
                                    RespMessage: 'success',
                                    log: data
                                })
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


//turn

//get all turns
app.get('/api/get/turns', auth, (_req, res) => {
    try {
        connection.query('select * from turns', [],
            (_err, data, _fil) => {
                if (data && data[0]) {
                    data.forEach(element =>{
                        element.idt_ids = element.idt_ids.split(",");
                        element.st_id = element.st_id.split(",");
                        element.sl_id = element.sl_id.split(",");
                    })
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

//create turn
app.post('/api/create/turn', auth, (req, res) => {
    try {
        const { title, idt_ids, st_id, sl_id } = req.body;
        if (!(title && idt_ids && st_id && sl_id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }
        var s_idt_ids = idt_ids.toString();
        var s_st_id = st_id.toString();
        var s_sl_id = sl_id.toString();

        connection.query(
            "insert into turns(title, idt_ids, st_id, sl_id) values(?,?,?,?)",
            [title, s_idt_ids, s_st_id, s_sl_id],
            (err, _results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success'
                })
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

//update turn
app.put('/api/update/turn', auth, (req, res) => {
    try {
        const { turn_id, title, idt_ids, st_id, sl_id } = req.body;
        if (!(turn_id && title && idt_ids && st_id && sl_id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }
        var s_idt_ids = idt_ids.toString();
        var s_st_id = st_id.toString();
        var s_sl_id = sl_id.toString();

        connection.query(
            "selete * from turns where turn_id = ?",
            [turn_id],
            (err, results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                if (results && results[0]) {
                    connection.query(
                        "update turns set title = ?,idt_ids = ?, st_id = ?, sl_id = ? where turn_id = ?",
                        [title, s_idt_ids, s_st_id, s_sl_id, turn_id],
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
                }
                else {
                    console.log('Err : not found data.')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: not found data.',
                        log: 1
                    })
                }
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

//update turn status
app.put('/api/update/turn/status', auth, (req, res) => {
    try {
        const { status } = req.body;
        if (!(turn_id && status)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }

        connection.query(
            "selete * from turns where turn_id = ?",
            [turn_id],
            (err, results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }

                if (results && results[0]) {
                    connection.query(
                        "update turns set status = ? where turn_id = ?",
                        [status, turn_id],
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
                }
                else {
                    console.log('Err : not found data.')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: not found data.',
                        log: 1
                    })
                }
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

//delete turn
app.delete('/api/delete/turn',auth, (req,res) => {
    try{
        const id = req.query.id
        if (!(id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }
        connection.query(
            "delete from turns where turns_id = ?",
            [id],
            (err, results, _fields) => {
                if (results) {
                    return res.status(201).json({ message: "success." });
                }
                else {
                    console.log(err);
                    return res.status(500).send({message: "error: "+err});
                }
            }
        )
    }catch (err) {
        console.log('Err:', err);
        return res.status(500).json({
            RespCode: 500,
            RespMessage: 'Internal server error',
            log: 0
        });
    }
})


//detail

//get all details
app.get('/api/get/details', auth, (_req, res) => {
    try {
        connection.query('select * from details', [],
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

//get all details by emp_id
app.get('/api/get/details/emp', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }
        connection.query('select * from details where emp_id = ?', [id],
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

//get all details by turn_id
app.get('/api/get/details/turn', auth, (req, res) => {
    try {
        const id = req.query.id
        if (!(id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }
        connection.query('select * from details where turn_id = ?', [id],
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

//creatr datail
app.post('/api/create/detail', auth, (req, res) => {
    try {
        const { emp_id, turn_id } = req.body;
        if (!(emp_id && turn_id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }
        connection.query(
            "selete * from details where emp_id = ? and turn_id = ?",
            [emp_id, turn_id],
            (err, results, _fields) => {
                if (err) {
                    return res.status(500).json({
                        RespCode: 500,
                        RespMessage: 'Database query error',
                        log: err
                    });
                }
                if (results && results[0]) {
                    console.log("detail exit")
                    return res.status(300).json({ message: "detail exit" })
                }

                connection.query(
                    "insert into details(emp_id,turn_id) values(?,?)",
                    [emp_id, turn_id],
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

//creatr datails
app.post('/api/create/details', auth, (req, res) => {
    try {
        const { emp_id, turn_id } = req.body;
        if (!(emp_id && turn_id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }

        let query = 'INSERT INTO details(emp_id, turn_id) VALUES ';
        emp_id.forEach((id, index) => {
            query += `(${id}, ${turn_id})`;
            if (index < emp_id.length - 1) {
                query += ', ';
            }
        });

        connection.query(
            query,
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

    } catch (err) {
        console.log('Err:', err);
        return res.status(500).json({
            RespCode: 500,
            RespMessage: 'Internal server error',
            log: 0
        });
    }
})

//delete datail
app.delete('/api/delete/detail',auth, (req,res) => {
    try{
        const id = req.query.id
        if (!(id)) {
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'Invalid input data',
                log: 0
            });
        }
        connection.query(
            "delete from details where detail_id = ?",
            [id],
            (err, results, _fields) => {
                if (results) {
                    return res.status(201).json({ message: "success." });
                }
                else {
                    console.log(err);
                    return res.status(500).send({message: "error: "+err});
                }
            }
        )
    }catch (err) {
        console.log('Err:', err);
        return res.status(500).json({
            RespCode: 500,
            RespMessage: 'Internal server error',
            log: 0
        });
    }
})


//login

//login
app.post('/api/login', (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        if (!(user_email && user_password)) {
            return res.status(200).json({
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
                                        { user_id: user.user_id, user_email },
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