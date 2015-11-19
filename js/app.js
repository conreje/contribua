window.Conreje = window.Conreje || {};

(function(Conreje, Marionette, $) {
    var MainLayout = Marionette.LayoutView.extend({
        el: 'body',
        
        regions: {
            contactForm: '#contato'
        }
    });
    
    Conreje.Contribua = new Marionette.Application();
    
    Conreje.Contribua.on('before:start', function() {
        Conreje.Contribua.layout = new MainLayout();
        
        $('.modal-trigger').leanModal();
    });
    
})(Conreje, Marionette, jQuery);