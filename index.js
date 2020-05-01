'use strict'

var meta = module.parent.require('./meta')
var _ = module.parent.require('underscore')
var winston = module.parent.require('winston')

var controllers = require('./lib/controllers')

function exp(plugin) {
    plugin.settings = {
        wordlist: '',
        converts: [{from:'',to:''}]
    }
    plugin.init = function (params, callback) {
        var router = params.router
        var hostMiddleware = params.middleware
        router.get(
            '/admin/plugins/word-filter',
            hostMiddleware.admin.buildHeader,
            controllers.renderAdminPage
        )
        router.get('/api/admin/plugins/word-filter', controllers.renderAdminPage)
        plugin.reloadSettings(callback)
    }

    plugin.parse = function (data, callback) {        
        try {
            for (var i = 0; i < plugin.settings.converts.length; i++)                
                data.postData.content = data.postData.content.replace(plugin.settings.converts[i].from, plugin.settings.converts[i].to);
            callback(null, data);
        } catch (ex) {
            callback(ex, data);
        }
    };

    plugin.reloadSettings = function (callback) {
        meta.settings.get('word-filter', function (err, settings) {
            if (err) {
                return callback(err)
            }

            winston.info('[word-filter] Settings OK')
            plugin.settings = _.defaults(_.pick(settings, Boolean), plugin.settings)
            plugin.settings.converts = plugin.settings.wordlist.split(',').map(v => ({ from: new RegExp(`${v}`, 'g'), to: v.replace(/./g, '*') }));
            plugin.ready = true
            callback()
        })
    }

    plugin.addAdminNavigation = function (header, callback) {
        winston.warn('[word-filter] adding acp navigation...')
        header.plugins.push({
            route: '/plugins/word-filter',
            icon: 'fa-user-secret',
            name: 'Word Filter'
        })

        callback(null, header)
    }
};
exp(module.exports)
