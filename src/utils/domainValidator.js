const allowedDomains = [
    "@pvpsit.ac.in", "@siddhartha.edu.in", "@pvpsiddhartha.ac.in"
];

const isAllowedEmail = (email) => {

    return allowedDomains.some(
        domain =>
            email.toLowerCase().endsWith(domain)
    );

};

module.exports = isAllowedEmail;