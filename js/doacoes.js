(function(app, Marionette, $, _) {
    function register(template) {
        var Donnations = Marionette.ItemView.extend({
            template: _.template(template),
            
            ui: {
                back: '#back'
            },
            
            events: {
                'click @ui.back': 'back'
            },
            
            back: function() {
                this.triggerMethod('open', 'home')
            }
        });
        
        app.layout.registeredViews.donnations = Donnations;
    }
    
    app.on('before:start', function() {
        $.get('templates/doacoes.html').then(register);
    });
})(Conreje.Contribua, Marionette, jQuery, _);