module.exports = (function () {

    return {
        local: {
            host: 'ubuntu@ec2-52-78-135-92.ap-northeast-2.compute.amazonaws.com',
            port: '3306',
            user: 'root',
            password: '123123',
            database: 'NodeChat',
        },
        real: {
            host: 'ubuntu@ec2-52-78-135-92.ap-northeast-2.compute.amazonaws.com',
            port: '3306',
            user: 'root',
            password: '123123',
            database: 'NodeChat',
        },
        dev: {
            host: 'ubuntu@ec2-52-78-135-92.ap-northeast-2.compute.amazonaws.com',
            port: '3306',
            user: 'root',
            password: '123123',
            database: 'NodeChat',
        }
    }

})();