define([
    'backbone',
    '../models/language'
], function(Backbone, languageModel) {
    'use strict';

    var languageCollection = Backbone.Collection.extend({
        model: languageModel
    });

    return languageCollection;
});
