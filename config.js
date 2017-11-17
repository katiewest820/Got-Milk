exports.DATABASE_URL = process.env.DATABASE_URL ||
						global.DATABASE_URL ||
 						'mongodb://Admin:password@ds157475.mlab.com:57475/katies-shopping-list';

exports.PORT = process.env.PORT || 8081