const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');


const {DATABASE_URL, PORT} = require('./config.js');

app.use(morgan('common'));

app.use(bodyParser.json());


app.use(express.static('./shoppingList-frontend'))

app.get('/', (req, res) => {
	res.sendFile(_dirname + './shoppingList-frontend/index.html')
});



const shoppingItemRoute = require('./routes/shoppingitem');

app.all('/');
app.use('/item', shoppingItemRoute);






let server

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, { useMongoClient: true });
        let db = mongoose.connection;
        db.on('error', err => {
            mongoose.disconnect();
            reject(err);
            console.log(`Connection error:${err}`);
        });
        db.once('open', () => {
            console.log(`Connected to a database ${databaseUrl}`)
        });
        server = app.listen(port, () => {
            console.log(`your server is running on port: ${PORT}`);
            resolve();
        });
    });
}

function closeServer(){
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('closing server');
			server.close(err => {
				if(err) {
					return reject(err);
				}
				resolve();
			})
		});
	});
}

if(require.main === module) {
	runServer().catch(err => console.log(`internal server error: ${err}`).status(500));
};

module.exports = { app, runServer, closeServer };
