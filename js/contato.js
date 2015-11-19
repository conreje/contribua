(function(app, Backbone, $, _, Materialize) {
    function register(formTemplate) {
        var Message = Backbone.Model.extend({
            defaults: {
                name: '',
                email: '',
                phone: '',
                message: ''
            },
            
            url: 'contato.php'
        });
        
        var Form = Backbone.Marionette.ItemView.extend({
            template: _.template(formTemplate),
            
            ui: {
                form: 'form',
                cancelBt: 'a',
                fields: 'input,textarea',
                loader: '#loader',
                error: '#error'
            },
            
            events: {
                'click @ui.cancelBt': 'clear',
                'change @ui.fields': 'fill',
                'submit @ui.form': 'save'
            },
            
            modelEvents: {
                'change': 'render'
            },
            
            fill: function(e) {
                var elem = e.target;
                this.model.set(elem.id, elem.value, {silent: true});
            },
            
            clear: function(e) {
                e.preventDefault();
                
                this.model.unset('id', {silent: true});
                this.model.set(this.model.defaults);
            },
            
            save: function(e) {
                e.preventDefault();
                
                this.showLoading();
                
                this.model.save()
                    .done((function() {
                        this.clear(e);
                        this.$el.parent().closeModal();
                        
                        Materialize.toast('Sua mensagem foi enviada com sucesso!', 3000);
                    }).bind(this))
                    .fail((function(xhr) {
                        this.showError(xhr.responseJSON.error);
                    }).bind(this));
            },
            
            showLoading: function() {
                this.ui.loader.addClass('active');
                this.ui.error.html('').addClass('hide');
                
                this.$(this.ui.fields.selector).prop('disabled', true);
                this.ui.cancelBt.prop('disabled', true);
            },
            
            showError: function(message) {
                this.ui.loader.removeClass('active');
                this.ui.error.html(message).removeClass('hide');
                
                this.$(this.ui.fields.selector).prop('disabled', false);
                this.ui.cancelBt.prop('disabled', false);
            }
        });
        
        app.layout.showChildView('contactForm', new Form({ model: new Message() }));
    }
    
    app.on('before:start', function() {
        $.get('templates/form-contato.html').then(register);
    });
})(Conreje.Contribua, Backbone, jQuery, _, Materialize);