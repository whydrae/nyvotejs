var User = require('./models/user');

module.exports = function (app, passport) {
    app.get('/register', function (req, res) {
        User.register(new User({
            username: req.body.username
        }), req.body.password, function (err, account) {
            if (err) {
                return res.status(500).json({
                    err: err
                });
            }

            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({
                    status: 'Registration successful!'
                });
            });
        });
    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, unfo) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return res.statu(500).json({
                        err: 'Could not get user'
                    });
                }
                res.status(200).json({
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.status(200).json({
            status: 'Bye!'
        });
    });

    app.get('/status', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.tatus(200).json({
                status: false
            });
        }
        res.status(200).json({
            status: true
        });
    })
}