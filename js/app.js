window.Conreje = window.Conreje || {};

(function(Conreje, Marionette, $, _) {
    var MainLayout = Marionette.LayoutView.extend({
        el: 'body',
        registeredViews: {
        },
        
        regions: {
            contactForm: '#contato',
            main: '#main'
        },
        
        onChildviewOpen: function(elem, name) {
            var view = this.registeredViews[name];
            
            this.showChildView('main', new view());
        }
    });
    
    Conreje.Contribua = new Marionette.Application();
    Conreje.Contribua.layout = new MainLayout();
    
    Conreje.Contribua.on('before:start', function() {
        $('.modal-trigger').leanModal();
    });
})(Conreje, Marionette, jQuery, _);