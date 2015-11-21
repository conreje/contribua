(function(app, Backbone, $, _) {
    var Donation = Backbone.Model.extend({
        defaults: {
            name: '',
            email: '',
            phone: '',
            products: []
        },

        add: function(product, category, quantity) {
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
            this.listenTo(this, 'change:nome', this.configureSlug);
            this.configureSlug();
        },
        
        configureSlug: function() {
            this.set('slug', $.slugify(this.get('nome')));
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
                'change @ui.select': 'toogleQuantity'
            },
            
            toogleQuantity: function() {
                if (this.ui.select.is(':checked')) {
                    this.ui.quantity.prop('disabled', false).focus();
                    
                    return;
                }
                
                this.ui.quantity.prop('disabled', true).val('');
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
                    this.showChildView('products', new ProductsView({collection: products}));
                }).bind(this));
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

        var Donnations = Backbone.Marionette.LayoutView.extend({
            template: _.template(template[0]),

            regions: {
                categories: '#categories'
            },
            
            ui: {
                back: '#back'
            },

            events: {
                'click @ui.back': 'back'
            },

            back: function(e) {
                e.preventDefault();

                this.triggerMethod('open', 'home')
            },

            onBeforeShow: function() {
                this.showChildView('categories', new CategoriesView({collection: categories}));
            }
        });
        
        app.layout.registeredViews.donnations = Donnations;
        categories.fetch();
    }

    app.on('before:start', function() {
        $.when(
            $.get('templates/doacoes.html'),
            $.get('templates/categoria.html'),
            $.get('templates/produto.html')
        ).done(register);
    });
})(Conreje.Contribua, Backbone, jQuery, _);