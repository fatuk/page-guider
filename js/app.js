$(function() {
    window.App = {};
    window.App.Views = {};
    window.App.Models = {};
    window.App.Collections = {};
    window.App.Helpers = {};

    App.Helpers.Template = function(templateId) {
        return $('#' + templateId).html();
    };

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
        messageTemplate: App.Helpers.Template('guiderMessageTemplate'),
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
                var $currentArea = $('#' + area.id);
                $currentArea.addClass('highlight-area');

                var backgroundWidth = $currentArea.width(),
                    backgroundHeight = $currentArea.height(),
                    backgroundOffset = $currentArea.offset();

                App.appView.$el.append('<div class="background">');
                App.appView.$('.background').width(backgroundWidth).height(backgroundHeight).offset(backgroundOffset);

                console.log(App.appView.$('.background'));

                // Render messages
                if (area.messages) {
                    _.each(area.messages, function(message) {
                        var rendered = Mustache.render(this.messageTemplate, message);
                        $currentArea.append(rendered);
                    }, this);
                }

            }, this);
        },
        resetArea: function() {
            _.each(this.model.get('areas'), function(area) {
                $('#' + area.id).removeClass('highlight-area');
            });
        }
    });

    App.Views.Message = Backbone.View.extend({
        template: App.Helpers.Template('guiderMessageTemplate'),
        initialize: function() {

        },
        render: function(message) {
            var rendered = Mustache.render(this.template, message);
        }
    });

    var messageView = new App.Views.Message();

});