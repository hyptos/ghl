define([
    'jquery',
    'underscore',
    'backbone',
    '../models/language',
    '../collections/language',
    'text!templates/index.html'
], function($, _, Backbone, LanguageModel, LanguageColl, IndexTemplate) {
    'use strict';

    var indexView = Backbone.View.extend({
        el: $('#app'),
        template: _.template(IndexTemplate),
        events: {
            'keypress #user': 'userInput',
        },
        initialize: function() {
            this.repositorys = new Backbone.Collection();
            this.owner = new Backbone.Model();
            this.user = 'Username';
            this.stats = new LanguageColl();
            this.totalLoc = 0;
            this.listenTo(this.repositorys, 'all', this.render);
            this.render();
        },
        render: function() {
            var data = {
                repos: this.repositorys,
                owner: this.owner,
                stats: this.stats,
                user: this.user,
                totalLoc: this.totalLoc
            };
            this.$el.html(this.template(data));
        },
        userInput: function(e) {
            var self = this;
            if (e.keyCode === 13) {
                self.user = $('#user').val();
                this.getAllRepos(self.user).complete(function() {
                    self.getAllStatistics();
                });
            }
        },
        getAllRepos: function(user) {
            var self = this;
            return $.ajax({
                url: 'https://api.github.com/users/' + user + '/repos',
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
            });
        },
        getAllStatistics: function() {
            var self = this;
            this.repositorys.each(function(repo) {
                self.getStatisticRepo(repo.get('full_name'), repo.id);
                self.owner = repo.get('owner');
            });
        },
        getStatisticRepo: function(owner, id) {
            console.log('getting stats about ' + owner);
            var self = this;
            return $.ajax({
                url: 'https://api.github.com/repos/' + owner + '/languages',
                headers: {
                    Accept: 'application/vnd.github.v3+json'
                },
                type: 'GET',
                DataType: 'jsonp'
            }).success(function(res) {
                var model = self.repositorys.get(id);
                for (var it in res) {
                    if (self.stats.length === 0) {
                        self.stats.add({
                            id: it,
                            cpt: res[it]
                        });
                    } else {
                        self.stats.each(function(lang) {
                            console.log(lang);
                            if (it === lang.get('id')) {
                                lang.set({
                                    id: lang.get('id'),
                                    cpt: lang.get('cpt') + res[it]
                                });
                            } else {
                                self.stats.add({
                                    id: it,
                                    cpt: res[it]
                                });
                            }
                        });
                    }
                    self.totalLoc += res[it];
                }
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
