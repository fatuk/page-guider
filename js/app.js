$(function() {
    window.App = {};
    window.App.Views = {};
    window.App.Models = {};
    window.App.Collections = {};

    App.Collections.Steps = Backbone.Collection.extend({
        url: 'data/guide.json',
        initialize: function() {
            this.fetch({
                reset: true
            });
        }
    });

    var stepsCollection = new App.Collections.Steps();

    App.Views.App = Backbone.View.extend({
        el: '#app',
        initialize: function() {

        },
        events: {
            'click #guiderBtn': 'render',
            'click .overlay': 'removeOverlay'
        },
        render: function() {
            this.$el.append('<div class="overlay"></div>');
            this.collection.each(function(step) {
                App.stepView = new App.Views.Step({
                    model: step
                });
            });
        },
        removeOverlay: function() {
            this.$('.overlay').remove();
            this.trigger('removeOverlay');
        }
    });

    stepsCollection.on('reset', function() {
        App.appView = new App.Views.App({
            collection: stepsCollection
        });
    });



    App.Views.Step = Backbone.View.extend({
        initialize: function() {
            this.render();
            App.appView.on('removeOverlay', function() {
                this.resetArea();
            }, this);
        },
        render: function() {
            this.highlightArea();
        },
        highlightArea: function() {
            _.each(this.model.get('areas'), function(area) {
                $('#' + area.id).addClass('highlight-area');
            });
        },
        resetArea: function() {
            _.each(this.model.get('areas'), function(area) {
                $('#' + area.id).removeClass('highlight-area');
            });
        }
    });

    App.Views.Steps = Backbone.View.extend({

    });

});