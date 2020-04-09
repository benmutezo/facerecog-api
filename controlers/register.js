const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body
    if (!email || !name || !password) {
        return res.status(400).json('cannot register')
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        }).catch(err => res.status(400).json(err))
            .into('login')
            .catch(err => res.status(400).json(err))
            .returning('email')
            .catch(err => res.status(400).json(err))
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .catch(err => res.status(400).json(err))
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .catch(err => res.status(400).json(err))
                    .then(user => {
                        res.json(user[0])
                    }).catch(err => res.status(400).json(err))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json(err))
}

module.exports = {
    handleRegister
}
