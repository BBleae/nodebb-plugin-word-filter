'use strict';
/* globals $, app, socket */

define('admin/plugins/word-filter', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('word-filter', $('.word-filter-settings'));

		$('#save').on('click', function() {
			Settings.save('word-filter', $('.word-filter-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'word-filter-saved',
					title: 'Settings Saved',
					message: 'Please restart your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.restart');
					}
				});
			});
		});

  };
  
	return ACP;
});