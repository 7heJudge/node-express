const keys = require("../keys");
module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Restoring access.',
        html: `
            <h1>You forgot password?</h1>
            <p>If not, just ignore this letter</p>
            <p>Or click link below</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Restor access</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Course store</a>
        `
    }
}
