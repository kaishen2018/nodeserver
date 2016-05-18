/**
 * Created by kiven.zhang on 5/18/2016.
 */
var mysql = require('mysql');

var TEST_DATABASE = 'Nodejstest';
var TEST_TABLE = 'user';
var setting = {
    host: '172.16.98.162',
    user: 'root',
    password: 'root',
    database: 'Nodejstest',
    port: 3306
};

//创建连接
var client = mysql.createConnection(setting);

client.connect();
client.query("use " + TEST_DATABASE);

client.query(
    'SELECT * FROM ' + TEST_TABLE, function (err, results, fields) {
        if(err ){throw err;}
        if(results)
        {
            for(var i = 0; i < results.length; i++){
                console.log("%d\t%s\t%s",results[i].id, results[i].name, results[i].age);
            }
        }
        client.end();
    }
);