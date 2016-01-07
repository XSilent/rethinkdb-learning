r = require('rethinkdb');

var connection = null;
var args = process.argv.slice(2);

checkParams();

r.connect( {host:'localhost', port:28015}, function(err, conn) {
	if (err) throw err;

	connection = conn;
   
    if (args[0] == 'createTable') {
        createTable(args[1]);    
    }
    
    if (args[0] == 'listData') {
        listData(args[1]);    
    }
	
    if (args[0] == 'queryBy') {
        var queryString = args[1];
        
        console.log(queryString);
        
        queryBy(queryBy);
        //queryData();    
    }
});

/**
 * Create new table with given name
 */
function createTable(tableName) {
	r.db('test').tableCreate(tableName).run(connection, function(err, result) {
        if (err) throw err;

        console.log(JSON.stringify(result, null, 2));
        
        process.exit();               
    })
}

/**
 * Insert hard coded demo data
 */
function insertData() {
	r.table('authors').insert([
        { name: "William Adama", tv_show: "Battlestar Galactica",
            posts: [
                {title: "Decommissioning speech", content: "The Cylon War is long over..."},
                {title: "We are at war", content: "Moments ago, this ship received word..."},
                {title: "The new Earth", content: "The discoveries of the past few days..."}
            ]
        },
        { name: "Laura Roslin", tv_show: "Battlestar Galactica",
            posts: [
                {title: "The oath of office", content: "I, Laura Roslin, ..."},
                {title: "They look like us", content: "The Cylons have the ability..."}
            ]
        },
        { name: "Jean-Luc Picard", tv_show: "Star Trek TNG",
            posts: [
                {title: "Civil rights", content: "There are some words I've known since..."}
            ]
        }
    ]).run(connection, function(err, result) {
    
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    })
}

/**
 * List all records from given table
 */
function listData(tableName) {
    r.table(tableName).run(connection, function(err, cursor) {
        if (err) throw err;
        
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            
            process.exit();
        });
    });
}

/**
 * Query db table by given string
 */
function queryBy(queryString) {
    
    r.table('authors').filter(r.row('name').eq(queryString)).
    run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
            
            process.exit();
        });
    });
}

/**
 * Check cli params
 */
function checkParams() {
    if (args[0] == null) {
        console.log("Missing params!\n");
        console.log("use:");
        console.log("queryBy\t\t\tProvide a string to query db table");
        console.log('createTable\t\tProvide a name for a new table to be created');
        console.log('listData\t\tPrint all data from for a given table');
        
        process.exit();
    }
}
