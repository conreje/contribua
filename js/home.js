(function(app, Marionette, $, _) {
    function register(template) {
        var Home = Marionette.ItemView.extend({
            template: _.template(template),
            
            ui: {
                doacoes: '#doacoes'
            },
            
            events: {
                'click @ui.doacoes': 'change'
            },
            
            change: function() {
                this.triggerMethod('open', 'donnations')
            }
        });
        
        app.layout.registeredViews.home = Home;
        app.layout.onChildviewOpen(null, 'home');
    }
    
    app.on('before:start', function() {
        $.get('templates/home.html').then(register);
    });
    
})(Conreje.Contribua, Marionette, jQuery, _);