const checkMail = require("email-validator");

// session hash
const cookieSession = require("cookie-session");

// pw hash
const bcrypt = require("bcryptjs");

const userRegistration = (formData) => {
    console.log("form data:", formData);
    let formErrors = {};
    if (
        !formData.firstname ||
        !formData.lastname ||
        !formData.email ||
        !checkMail.validate(formData.email) ||
        !formData.password ||
        !formData.passwordrep ||
        formData.password !== formData.passwordrep
    ) {
        formErrors.errorReadingForm = true;
        return formErrors;
    } else {
        // hash!!
        const password = formData.password;
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        let userData = {
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname,
            passphrase: hash,
        };
        return userData;
    }
};

module.exports = {
    userRegistration,
};
