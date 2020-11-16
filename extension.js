
var vscode = require('vscode');

var http = require('http');
let server;

function activate(context) {

	server = http.createServer(function (req, res) {

		let params = decodeURIComponent(req.url.replace('/', '')).split('&');
		switch(params[0]) {
			case 'classes-reloaded':
				let projectBreakpoints = vscode.debug.breakpoints.filter((b) => {
					return (!b.location) || (b.location.uri.path.indexOf(params[1]) >= 0);
				});
				if(projectBreakpoints.length > 0) {
					vscode.debug.removeBreakpoints(projectBreakpoints);
					setTimeout(() => {
						vscode.debug.addBreakpoints(projectBreakpoints);
						res.end();
					}, 200);
				} else {
					res.end();
				}
			break;
			default:
				res.end();
			break
		}
	});
	server.listen(32025);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	server.close();
	server = null;
}

module.exports = {
	activate,
	deactivate
};