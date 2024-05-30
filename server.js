const express = require('express');
const mysql = require('mysql');

const app = express();
//Mysql connect
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'employeetest'
})

connection.connect((err)=>{
    if (err){
        console.log('error to connect to MySQL database: ',err)
        return;
    }
    console.log('MySQL successsfully connected!');
})

app.use(express.json());

//get all users
app.get("/api/get/users",(_rep,res) => {
    try{
        connection.query('select * from users;',[],
        (_err,data,_fil) => {
            if(data&&data[0]){
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success',
                    log: data
                })
            }
            else{
                console.log('result : not data.')
                return res.status(200).json({
                    RespCode: 400,
                    RespMessage: 'bad: not found data.',
                    log: 1
                })
            }
        })
    }
    catch(err){
        console.log("Err :",err)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            log: 0
        })
    }
})

//get user by emp_id
app.get('/api/get/user',async (req,res) => {
    var id = req.query.id
    if(id){
        try{
            connection.query('select * from users where emp_id = ?;',
            [id],
            (_err,data,_fil) => {
                if(data&&data[0]){
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                        log: data
                    })
                }
                else{
                    console.log('Err : not found data.')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: not found data.',
                        log: 1
                    })
                }
            })
        }
        catch(err){
            console.log("Err :",err)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            log: 0
        })
        }
    }
    else{
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'No id',
            log: 0
        })
    }
})

//create user
app.post("/api/create/user", async (req, res)=>{
    const {user_email,user_password,access,emp_id} = req.body
    if(user_email,user_password,access,emp_id){
    try {
        connection.query(
            "insert into users(user_email,user_password,access,emp_id) values(?,MD5(?),?,?)",
            [user_email,user_password,access,emp_id],
            (err, _results,_fields)=>{
                if(err){
                    console.log("error while inserting a user into the database",err)
                    return res.status(400).send();
                }
                return res.status(201).json({message:"new user successfully created!"})
            }
        )
    } catch (error) {
        console.log(err);
        return res.status(400).send();
    }
}
else{
    return res.status(200).json({
        RespCode: 400,
        RespMessage: 'insert data user_email: '+user_email+', user_password: '+user_password+', access: '+access+', emp_id: '+emp_id,
        log: 0
    })
}
})

//update user
app.put("/api/update/user", async (req, res)=>{
    const {user_id,user_email,user_password,access,emp_id} = req.body
    if(user_id&&user_email&&user_password&&access&&emp_id){
    try {
        connection.query(
            "update users set user_email = ?,user_password = MD5(?), access = ?, emp_id = ? where user_id = ?",
            [user_email,user_password,access,emp_id,user_id],
            (err, results,_fields)=>{
                if(results){
                    return res.status(201).json({message:"success."});
                }
                else{
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
else{
    return res.status(400).json({
        RespCode: 400,
        RespMessage: `Invalid input data`,
        log: 0
    })
}
})

//get all employees
app.get('/api/get/emps',async (_rep,res)=>{
    try{
        connection.query('select * from employees;',[],
        (_err,data,_fil) => {
            if(data&&data[0]){
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success',
                    log: data
                })
            }
            else{
                console.log('Err : not found data.')
                return res.status(400).json({
                    RespCode: 400,
                    RespMessage: 'bad: not found data.',
                    log: 1
                })
            }
        })
    }
    catch(err){
        console.log("Err :",err)
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'bad',
            log: 0
        })
    }
})

//get employee by emp_id
app.get('/api/get/emp',async (req,res) => {
    var id = req.query.id
    if(id){
        try{
            connection.query('select * from employees where emp_id = ?;',
            [id],
            (_err,data,_fil) => {
                if(data&&data[0]){
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                        log: data
                    })
                }
                else{
                    console.log('Err : not found data.')
                    return res.status(400).json({
                        RespCode: 400,
                        RespMessage: 'bad: not found data.',
                        log: 1
                    })
                }
            })
        }
        catch(err){
            console.log("Err :",err)
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'bad',
            log: 0
        })
        }
    }
    else{
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'no id',
            log: 0
        })
    }
})

app.listen(3000,()=>console.log("server is running on port 3000"));