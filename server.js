'use strict';
const path = require('path');
const connect = require('connect');
const serveStatic = require('serve-static');

const port = process.env.PORT || 8080;
connect()
	.use(serveStatic(path.resolve(__dirname, 'dist')))
	.listen(port, () =>
	{
		console.log(`Server running on port ${port}.`)
	});
