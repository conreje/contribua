(function(app, Backbone, $, _, Materialize) {
    var Donation = Backbone.Model.extend({
        hasProducts: function() {
            return this.get('products').length > 0
        },
        
        removeProduct: function(product, category) {
            this.set('products', _.reject(this.get('products'), function(item) {
                return item.name === product.get('nome') && item.category === category.get('nome');
            }));
        },

        updateProduct: function(product, category, quantity) {
            var item = _.findWhere(this.get('products'), {name: product.get('nome'), category: category.get('nome')});
            
            if (item) {
                item.quantity = quantity;
                return;
            }
            
            this.get('products').push({
                name: product.get('nome'),
                category: category.get('nome'),
                quantity: quantity,
                metric: product.get('medida')
            });
        },

        url: 'doacao.php'
    });

    var Product = Backbone.Model.extend({
        initialize: function() {
            this.set('slug', $.slugify(this.get('nome') + ' ' + this.get('quantidade')));
        }
    });

    var Category = Backbone.Model.extend({
        initialize: function() {
            this.products = new ProductCollection({category: this});
        },

        getProducts: function() {
            return this.products;
        }
    });

    var ProductCollection = Backbone.Collection.extend({
        model: Product,

        initialize: function(options) {
            this.category = options.category;
        },

        url: function() {
            return this.category.get('produtos');
        }
    });

    var CategoryCollection = Backbone.Collection.extend({
        model: Category,
        url: 'data/categorias.json'
    });

    function register(template, categoryTemplate, productTemplate) {
        var categories = new CategoryCollection();
        
        var ProductView = Backbone.Marionette.ItemView.extend({
            className: 'col s12 m6',
            template: _.template(productTemplate[0]),
            
            ui: {
                select: 'input[type="checkbox"]',
                quantity: 'input[type="number"]'
            },
            
            events: {
                'change @ui.select': 'toogleQuantity',
                'change @ui.quantity': 'update'
            },
            
            toogleQuantity: function() {
                if (this.ui.select.is(':checked')) {
                    this.ui.quantity.prop('disabled', false).focus();
                    
                    return;
                }
                
                this.ui.quantity.prop('disabled', true).val('');
                this.update();
            },
            
            update: function () {
                this.triggerMethod('update', this.model, this.ui.quantity.val());
            }
        });
        
        var ProductsView = Backbone.Marionette.CollectionView.extend({
            childView: ProductView,
            className: 'row'
        });

        var CategoryView = Backbone.Marionette.LayoutView.extend({
            tagName: 'li',
            template: _.template(categoryTemplate[0]),
            
            regions: {
                'products': '[data-rel="produtos"]'
            },

            onBeforeShow: function() {
                var products = this.model.getProducts();

                products.fetch().then((function() {
                    this.showChildView(
                        'products',
                        new ProductsView({collection: products})
                    );
                }).bind(this));
            },
            
            onChildviewUpdate: function(view, product, quantity) {
                if (quantity === 0 || quantity === '') {
                    this.triggerMethod('product:remove', product, this.model);
                    return;
                }
                
                this.triggerMethod('product:update', product, this.model, quantity);
            }
        });

        var CategoriesView = Backbone.Marionette.CollectionView.extend({
            childView: CategoryView,

            tagName: 'ul',
            className: 'collapsible popout produtos',
            attributes: {
                'data-collapsible': 'accordion'
            },

            onAttach: function() {
                this.$el.collapsible();
            }
        });

        var Donations = Backbone.Marionette.LayoutView.extend({
            template: _.template(template[0]),
            
            regions: {
                categories: '#categories'
            },
            
            ui: {
                back: '#back',
                form: 'form',
                fields: 'input.details',
                loader: '#loader',
                error: '#error'
            },

            events: {
                'click @ui.back': 'back',
                'submit @ui.form': 'send',
                'change @ui.fields': 'fill'
            },
            
            initialize: function() {
                this.model = new Donation({name: '', email: '', phone: '', products: []});
            },
            
            fill: function(e) {
                var elem = e.target;
                this.model.set(elem.id, elem.value, {silent: true});
            },

            back: function(e) {
                e.preventDefault();

                this.triggerMethod('open', 'home')
            },
            
            send: function(e) {
                e.preventDefault();
                
                $(document).scrollTop(0);
                this.showLoading();
                
                if (!this.model.hasProducts()) {
                    return this.showError('Você deve contribuir com ao menos um item');
                }
                
                this.model.save()
                    .done((function() {
                        this.triggerMethod('open', 'home');
                        Materialize.toast('Doação enviada, em breve entraremos em contato!', 3000);
                    }).bind(this))
                    .fail((function(xhr) {
                        this.showError(xhr.responseJSON.error);
                    }).bind(this));
            },

            onBeforeShow: function() {
                this.showChildView('categories', new CategoriesView({collection: categories}));
            },
            
            showLoading: function() {
                this.ui.loader.addClass('active');
                this.ui.error.html('').addClass('hide');
            },
            
            showError: function(message) {
                this.ui.loader.removeClass('active');
                this.ui.error.html(message).removeClass('hide');
            },
            
            onChildviewProductRemove: function(view, product, category) {
                this.model.removeProduct(product, category);
            },
            
            onChildviewProductUpdate: function(view, product, category, quantity) {
                this.model.updateProduct(product, category, quantity);
            }
        });
        
        app.layout.registeredViews.donnations = Donations;
        categories.fetch();
    }

    app.on('before:start', function() {
        $.when(
            $.get('templates/doacoes.html'),
            $.get('templates/categoria.html'),
            $.get('templates/produto.html')
        ).done(register);
    });
})(Conreje.Contribua, Backbone, jQuery, _, Materialize);