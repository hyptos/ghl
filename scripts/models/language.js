define([
    'backbone'
], function(Backbone) {
    'use strict';

    var languageModel = Backbone.Model.extend({
        defaults: {
            id: '',
            cpt: 0,
            total: 0
        }
    });

    return languageModel;
});
