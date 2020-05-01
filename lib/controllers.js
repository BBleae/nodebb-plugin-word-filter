'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res) {
	res.render('admin/plugins/word-filter', {});
};

module.exports = Controllers;
