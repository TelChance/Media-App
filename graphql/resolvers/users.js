const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'});
}

module.exports ={
    Mutation: {
        async login(_, {username, password}){
            const {errors, valid} = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });

            if(!user){
                errors.general = 'No user found';
                throw new UserInputError('No user found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Wrong username and password';
                throw new UserInputError('Wrong username and password', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(_, 
        { 
            registerInput: { username, email, password, confirmpassword }
        } 
        ){
            // Validate user data
            const { valid, errors } = validateRegisterInput( username, email, password, confirmpassword);
            if(!valid){
                throw new UserInputError('Errors', { errors });
            }
            // Make sure user doesnt already exist
            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username already exist',
                    }
                })
            }
            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
};