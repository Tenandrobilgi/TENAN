// Import Modules

const { checkForMaintenance } = require('../Side_Modules/checkForMaintenance')
const config = require('../../config.json')

const db = require("quick.db");
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

// Adds the user to the timeout.

async function addUser(user) {
    if (!user) return false
    if (checkForMaintenance(undefined, undefined, undefined, user)) return false

    if (await checkForUser(user)) {
        return false
    } else {
        await db.set(user.id, true);
    }

    return true
}

// Removes the user from the timeout.

async function removeUser(user) {
    if (!user) return false
    if (checkForMaintenance(undefined, undefined, undefined, user)) return false

    if (await checkForUser(user)) {
        db.delete(user.id)
    } else {
        return false
    }

    return true
}

// Checks if the user is in timeout.

async function checkForUser(user) {
    if (!user) return false
    if (checkForMaintenance(undefined, undefined, undefined, user)) return false

    if (await db.get(user.id)) return true

    return false
}

// Automatically adds and removes the user from the timeout.

async function autoHandleTimeout(user) {
    if (!user) return false
    if (checkForMaintenance(undefined, undefined, undefined, user)) return false

    await addUser(user)

    var timeoutAmnt = config.TIMEOUTWAITAMOUNT
    if (!timeoutAmnt || !typeof(timeoutAmnt) === "number") timeoutAmnt = 3

    await wait(timeoutAmnt * 1000)

    await removeUser(user)
    return true
}

module.exports = {
    addUser,
    removeUser,
    checkForUser,
    autoHandleTimeout
}