var mysql = require("mysql"),
model = module.exports;

var oauth2db = mysql.createConnection({
    host:"localhost",
    user:"1",
    password:"1",
    database:"oauth2db"
});

model.getAccessToken = function (bearerToken, callback) {
    oauth2db.connect(function (err) {
	if (err) return callback(err);
	oauth2db.query('SELECT access_token, client_id, expires, user_id FROM oauth_access_tokens ' +
		       'WHERE access_token = ?', [bearerToken], function (err, rows, fields) {
			 if (err || !rows.rowCount) return callback(err);
			 var token = rows.rows[0];
			 callback(null, {
			     accessToken: token.access_token,
			     clientId: token.client_id,
			     expires: token.expires,
			     userId: token.userId
			 });
		     });
    });
};

model.getClient = function (clientId, clientSecret, callback) {

	oauth2db.query('SELECT client_id, client_secret, redirect_uri FROM oauth_clients WHERE ' +
		       'client_id = ?', [clientId], function (err, rows, fields) {
			 if (err || !rows.rowCount) return callback(err);

			 var client = rows[0];

			 if (clientSecret !== null && client.client_secret !== clientSecret) return callback();

			 callback(null, {
			     clientId: client.client_id,
			     clientSecret: client.client_secret
			 });
		     });
};

model.getRefreshToken = function (bearerToken, callback) {

	oauth2db.query('SELECT refresh_token, client_id, expires, user_id FROM oauth_refresh_tokens ' +
		       'WHERE refresh_token = ?', [bearerToken], function (err, rows,fields) {
			 callback(err, rows.rowCount ? rows[0] : false);
		     });
};

var authorizedClientIds = ['abc1', 'def2'];
model.grantTypeAllowed = function (clientId, grantType, callback) {
    if (grantType === 'password') {
	return callback(false, authorizedClientIds.indexOf(clientId.toLowerCase()) >= 0);
    }

    callback(false, true);
};

model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {

	oauth2db.query('INSERT INTO oauth_access_tokens(access_token, client_id, user_id, expires) ' +
		     'VALUES (?, ?, ?, ?)', [accessToken, clientId, userId, expires],
		       function (err, rows,fields) {
			 callback(err);
		     });
};

model.saveRefreshToken = function (refreshToken, clientId, userId, expires, callback) {
	oauth2db.query('INSERT INTO oauth_refresh_tokens(refresh_token, client_id, user_id, ' +
		     'expires) VALUES (?, ?, ?, ?)', [refreshToken, clientId, userId, expires],
		       function (err,rows, fields) {
			 callback(err);
		     });
};


model.getUser = function (username, password, callback) {
    oauth2db.query('SELECT id FROM users WHERE username = ? AND password = ?', [username,password], function (err,rows, fields) {
	callback(err, rows.rowCount ? rows[0] : false);
	done();
    });
};