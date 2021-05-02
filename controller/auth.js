const Users = require("../models/User");
const bcrypt = require("bcrypt");

export const tryLogin = async(email, password, models, SECRET, SECRET2) => {
    const user = await Users.findOne({ where: { email }, raw: true });
    if(!user)
    {
        throw new Error('invalid login');
    }
    if(!user.confirmed)
    {
        throw new Error("Please confirm your email login");
    }

    const valid = await bcrypt.compare(password, user.password);

    if(!valid)
    {
        throw new Error("invalid login")
    }

    const [token, refresToken] = await createTokens(user, SECRET, SECRET2 + user.password);
};