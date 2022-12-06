const checkMail = require("email-validator");

// session hash
const cookieSession = require("cookie-session");

// pw hash
const bcrypt = require("bcryptjs");

// -------------------------------------------------------------------------------- registration

const userRegistration = (formData) => {
    console.log("form data:", formData);
    let formErrors = {};
    let pwStrengh = passwordStrength(formData.password).value;
    console.log(pwStrengh);
    if (
        !formData.firstname ||
        !formData.lastname ||
        !formData.email ||
        !checkMail.validate(formData.email) ||
        !formData.password ||
        !formData.passwordrep ||
        formData.password !== formData.passwordrep
        // pwStrengh !== "Strong"
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

const newPassphrase = (password) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    return hash;
};

// -------------------------------------------------------------------------------- Log in

const userLogin = (formData) => {};

// -------------------------------------------------------------------------------- Password strength

const defaultOptions = [
    {
        id: 0,
        value: "Too weak",
        minDiversity: 0,
        minLength: 0,
    },
    {
        id: 1,
        value: "Weak",
        minDiversity: 2,
        minLength: 4,
    },
    {
        id: 2,
        value: "Medium",
        minDiversity: 4,
        minLength: 6,
    },
    {
        id: 3,
        value: "Strong",
        minDiversity: 4,
        minLength: 8,
    },
];

const passwordStrength = (
    password,
    options = defaultOptions,
    allowedSymbols = "!\"#$%&'()*+,-./:;<=>?@[\\\\\\]^_`{|}~"
) => {
    let passwordCopy = password || "";

    (options[0].minDiversity = 0), (options[0].minLength = 0);

    const rules = [
        {
            regex: "[a-z]",
            message: "lowercase",
        },
        {
            regex: "[A-Z]",
            message: "uppercase",
        },
        {
            regex: "[0-9]",
            message: "number",
        },
    ];

    if (allowedSymbols) {
        rules.push({
            regex: `[${allowedSymbols}]`,
            message: "symbol",
        });
    }

    let strength = {};

    strength.contains = rules
        .filter((rule) => new RegExp(`${rule.regex}`).test(passwordCopy))
        .map((rule) => rule.message);

    strength.length = passwordCopy.length;

    let fulfilledOptions = options
        .filter((option) => strength.contains.length >= option.minDiversity)
        .filter((option) => strength.length >= option.minLength)
        .sort((o1, o2) => o2.id - o1.id)
        .map((option) => ({ id: option.id, value: option.value }));

    Object.assign(strength, fulfilledOptions[0]);

    return strength;
};

module.exports = {
    userRegistration,
    passwordStrength,
    newPassphrase,
};
