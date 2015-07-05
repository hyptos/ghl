define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/index.html'
], function($, _, Backbone, IndexTemplate) {
    'use strict';

    var indexView = Backbone.View.extend({
        el: $('#app'),
        template: _.template(IndexTemplate),
        events: {},
        initialize: function() {
            // console.log("initialize view search");
            this.repositorys = new Backbone.Collection();
            this.listenTo(this.repositorys, 'all', this.render);
            this.getAllRepos();
            this.render();
        },
        render: function() {
            // console.log('render view search');
            var data = {
                repos: this.repositorys
            };
            this.$el.html(this.template(data));
        },
        getAllRepos: function() {
            var self = this;
            $.ajax({
                url: 'https://api.github.com/users/hyptos/repos',
                headers: {
                    Accept: 'application/vnd.github.v3+json'
                },
                type: 'GET',
                DataType: 'jsonp'
            }).success(function(res) {
                console.log('ok');
                self.repositorys = new Backbone.Collection(res);
            }).error(function(res) {
                console.log(res);
            }).complete(function() {
                self.render();
                self.getAllStatistics();
            });
        },
        getAllStatistics: function() {
            var self = this;
            this.repositorys.each(function(repo) {
                self.getStatisticRepo(repo.get('full_name'), repo.id);
            });
        },
        getStatisticRepo: function(owner, id) {
            console.log('getting stats about ' + owner);
            var self = this;
            $.ajax({
                url: 'https://api.github.com/repos/' + owner + '/languages',
                headers: {
                    Accept: 'application/vnd.github.v3+json'
                },
                type: 'GET',
                DataType: 'jsonp'
            }).success(function(res) {
                console.log('ok');
                var model = self.repositorys.get(id);
                model.set({
                    'stats': res
                });
            }).error(function(res) {
                console.log(res);
            }).complete(function() {
                self.render();
            });
        }
    });
    return indexView;
});
