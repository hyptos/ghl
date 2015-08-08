/*jshint -W031 */
require.config({
    paths: {
        'jquery': '../node_modules/jquery/dist/jquery',
        'underscore': '../node_modules/underscore/underscore',
        'backbone': '../node_modules/backbone/backbone',
        'text': '../scripts/lib/text'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        }
    },
    deps: ['jquery', 'underscore', 'backbone']
});

require([
    'backbone', 'routes/index'
], function(Backbone, Router) {
    new Router();
    Backbone.history.start();
});
