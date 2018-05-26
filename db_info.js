module.exports = (function () {

    return {
        local: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'spdlqj123',
            database: 'NodeChatLocal',
        },
        real: {
            host: '52.78.135.92',
            port: '3306',
            user: 'root',
            password: '123123',
            database: 'NodeChatAWS',
        },
        dev: {
            host: '52.78.135.92',
            port: '3306',
            user: 'root',
            password: '123123',
            database: 'NodeChatAWS',
        }
    }

})();
