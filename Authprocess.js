const exp = require("express").Router();
const bcrypt = require('bcrypt');
const users = [];
const jwtToken = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

exp.post('/signup', [
    check("email", "please enter a valid mail")
        .isEmail(),
    check("password", "please enter a valid password greater than 8 character")
        .isLength({
            min: 8
        })
], async (req, res) => {
    const { email, password } = req.body
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        });
    }
    let user = users.find((user) => {
        return user.email == email;
    })
    if (user) {
        res.status(400).json({
            "err": [
                {
                    "massege": "user is already existed please try again"
                }
            ]
        })
    }
    else if (!user) {
        res.status(400).json({
            "err": [
                {
                    "massege": "Successfully Registered"
                }
            ]
        })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    users.push({
        email,
        password: hashPassword
    })
})

exp.post('/login', async (req, res) => {
    const { password, email } = req.body
    let user = users.find((user) => {
        return user.email === email;
    })

    if (!user) {
        return res.status(400).json({
            "err": [
                {
                    "massege": "invalid Credentill, Please Register first"
                }
            ]
        })
    }

    let match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(400).json({
            "err": [
                {
                    "massege": "invalid Credentill"
                }
            ]
        })
    }

    const token = await jwtToken.sign({
        email
    }, "lkjasdf", {
        expiresIn: 36000
    })
    res.json({
        token
    })
})

exp.get('/api', (req, res) => {
    res.json(users)

})

module.exports = exp;