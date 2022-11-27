// Starts the event modules when called. 

function start(client) {
    if (!client) return console.error("client does not exist.");
    
    var requireDir = require('require-dir');
    var dir = requireDir('./Events')

    Object.keys(dir).forEach(function (key) {
        var module = dir[key];

        if (!module.hasOwnProperty('start')) return

        module.start(client)
    });
}

module.exports = {
    start
}