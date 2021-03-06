const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const papa = require('papaparse');
const fs = require('fs');

const userSchema = new Schema({
    userID: { type: String, required: true, unique: true, lowercase: true },
    userName: { type: String, required: true},
    password: { type: String, required: true},
    departmentID: { type: String, required: true },
    departmentName: { type: String, required: true },
    like_1: [String],
    like_2: [String],
    like_3: [String]
});

userSchema.pre('save', function(next) {
    const user = this;
    bcrypt.genSalt(12, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.authenticate = function(password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

async function createUser(userID, userName, password, departmentID, departmentName) {
    try {
        var newUser = new User({
            userID: userID,
            userName: userName,
            password: password,
            departmentID: departmentID,
            departmentName: departmentName,
            like_1: [],
            like_2: [],
            like_3: []
        });
        await newUser.save();
        return await getAllUsers();
    } catch(err) {
        throw err;
    }
}

async function removeUser(user_id) {
    try {
        await User.findByIdAndRemove(user_id);
        return await getAllUsers();
    } catch(err) {
        throw err;
    }
}

async function modifyUser(user_id, userID, userName, password, departmentID, departmentName) {
    try {
        var update = {};
        if (!!userID)
            update.userID = userID;
        if (!!userName)
            update.userName = userName;
        if (!!password)
            update.password = password;
        if (!!departmentID)
            update.departmentID = departmentID;
        if (!!departmentName)
            update.departmentName = departmentName;
        await User.findByIdAndUpdate(user_id, update);
        return await getAllUsers();
    } catch(err) {
        throw err;
    }
}

async function createUserCsv(csvPath, operation='add') {
    try {
        if (operation != 'reset' && operation != 'add') {
            throw new Error('Undefined operation');
        }
        if (operation == 'reset') {
            await User.remove({});
        }
        const file = fs.createReadStream(csvPath);
        return await new Promise((resolve, reject) => {
            papa.parse(file, {
                complete: async (result, file) => {
                    try {
                        for (const user of result.data) {
                            await createUser(user[0], user[1], user[2], user[3], user[4]);
                        }
                        resolve(await getAllUsers());
                    } catch(err) {
                        reject(err);
                    }
                },
                error: err => reject(err)
            });
        });
    } catch(err) {
        throw err;
    }
}

async function getAllUsers() {
    try {
        return await User.find({}, null, {sort: {departmentName: 1, _id: 1}});
    } catch(err) {
        throw err;
    }
}

module.exports = {User, getAllUsers, createUser, removeUser, modifyUser, createUserCsv};