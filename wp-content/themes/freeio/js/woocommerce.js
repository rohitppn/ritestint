(function($) {
    "use strict";

    $.extend($.apusThemeCore, {
        /**
         *  Initialize scripts
         */
        woo_init: function() {
            var self = this;

            self.productDetail();

            self.initSidebar();

            $('body').on('found_variation', function(event, variation) {
                self.variationsImageUpdate(variation);
            });

            $('body').on('reset_image', function(event, variation) {
                self.variationsImageUpdate(variation);
            });
            if ($.isFunction($.fn.select2)) {
                $('.apus-search-form .select-category select').select2();
            }

            $('body').on('hover', '.apus-topcart .cart_list', function() {
                if ($('.offcanvas-filter-sidebar').length) {
                    var ps = new PerfectScrollbar('.apus-topcart .cart_list', {
                        wheelPropagation: true
                    });
                }
            });

        },
        productDetail: function() {
            // review click link
            $('.woocommerce-review-link').on('click', function() {
                $('.woocommerce-tabs a[href="#tabs-list-reviews"]').trigger('click');
                $('html, body').animate({
                    scrollTop: $("#reviews").offset().top
                }, 1000);
                return false;
            });
        },
        initSidebar: function() {
            // view more categories
            $('.widget_product_categories ul.product-categories').each(function(e) {
                var height = $(this).outerHeight();
                if (height > 260) {
                    var view_more = '<a href="javascript:void(0);" class="view-more-list-cat view-more"><span>' + freeio_woo_options.view_more_text + '</span> <i class="fa fa-angle-double-right"></i></a>';
                    $(this).parent().append(view_more);
                    $(this).addClass('hideContent');
                }
            });

            $('body').on('click', '.view-more-list-cat', function() {

                var $this = $(this);
                var $content = $this.parent().find(".product-categories");

                if ($this.hasClass('view-more')) {
                    var linkText = freeio_woo_options.view_less_text;
                    $content.removeClass("hideContent").addClass("showContent");
                    $this.removeClass("view-more").addClass("view-less");
                } else {
                    var linkText = freeio_woo_options.view_more_text;
                    $content.removeClass("showContent").addClass("hideContent");
                    $this.removeClass("view-less").addClass("view-more");
                };

                $this.find('span').text(linkText);
            });

            // view more for filter
            $('.woocommerce-widget-layered-nav-list').each(function(e) {
                var height = $(this).outerHeight();
                if (height > 260) {
                    var view_more = '<a href="javascript:void(0);" class="view-more-list view-more"><span>' + freeio_woo_options.view_more_text + '</span> <i class="fa fa-angle-double-right"></i></a>';
                    $(this).parent().append(view_more);
                    $(this).addClass('hideContent');
                }
            });

            $('body').on('click', '.view-more-list', function() {

                var $this = $(this);
                var $content = $this.parent().find(".woocommerce-widget-layered-nav-list");

                if ($this.hasClass('view-more')) {
                    var linkText = freeio_woo_options.view_less_text;
                    $content.removeClass("hideContent").addClass("showContent");
                    $this.removeClass("view-more").addClass("view-less");
                } else {
                    var linkText = freeio_woo_options.view_more_text;
                    $content.removeClass("showContent").addClass("hideContent");
                    $this.removeClass("view-less").addClass("view-more");
                };

                $this.find('span').text(linkText);
            });
        },
        variationsImageUpdate: function(variation) {
            var $form = $('.variations_form'),
                $product = $form.closest('.product'),
                $product_gallery = $product.find('.apus-woocommerce-product-gallery-wrapper'),
                $gallery_img = $product.find('.apus-woocommerce-product-gallery-thumbs img:eq(0)'),
                $product_img_wrap = $product_gallery.find('.woocommerce-product-gallery__image, .woocommerce-product-gallery__image--placeholder').eq(0),
                $product_img = $product_img_wrap.find('.wp-post-image'),
                $product_link = $product_img_wrap.find('a').eq(0);


            if (variation && variation.image && variation.image.src && variation.image.src.length > 1) {

                if ($('.apus-woocommerce-product-gallery-thumbs img[src="' + variation.image.thumb_src + '"]').length > 0) {
                    $('.apus-woocommerce-product-gallery-thumbs img[src="' + variation.image.thumb_src + '"]').trigger('click');
                    $form.attr('current-image', variation.image_id);
                    return;
                } else {
                    $product_img.wc_set_variation_attr('src', variation.image.src);
                    $product_img.wc_set_variation_attr('height', variation.image.src_h);
                    $product_img.wc_set_variation_attr('width', variation.image.src_w);
                    $product_img.wc_set_variation_attr('srcset', variation.image.srcset);
                    $product_img.wc_set_variation_attr('sizes', variation.image.sizes);
                    $product_img.wc_set_variation_attr('title', variation.image.title);
                    $product_img.wc_set_variation_attr('alt', variation.image.alt);
                    $product_img.wc_set_variation_attr('data-src', variation.image.full_src);
                    $product_img.wc_set_variation_attr('data-large_image', variation.image.full_src);
                    $product_img.wc_set_variation_attr('data-large_image_width', variation.image.full_src_w);
                    $product_img.wc_set_variation_attr('data-large_image_height', variation.image.full_src_h);
                    $product_img_wrap.wc_set_variation_attr('data-thumb', variation.image.src);
                    $gallery_img.wc_set_variation_attr('src', variation.image.thumb_src);
                    $gallery_img.wc_set_variation_attr('srcset', variation.image.thumb_srcset);

                    $product_link.wc_set_variation_attr('href', variation.image.full_src);
                    $gallery_img.removeAttr('srcset');
                    $('.apus-woocommerce-product-gallery').slick('slickGoTo', 0);

                }
            } else {
                $product_img.wc_reset_variation_attr('src');
                $product_img.wc_reset_variation_attr('width');
                $product_img.wc_reset_variation_attr('height');
                $product_img.wc_reset_variation_attr('srcset');
                $product_img.wc_reset_variation_attr('sizes');
                $product_img.wc_reset_variation_attr('title');
                $product_img.wc_reset_variation_attr('alt');
                $product_img.wc_reset_variation_attr('data-src');
                $product_img.wc_reset_variation_attr('data-large_image');
                $product_img.wc_reset_variation_attr('data-large_image_width');
                $product_img.wc_reset_variation_attr('data-large_image_height');
                $product_img_wrap.wc_reset_variation_attr('data-thumb');
                $gallery_img.wc_reset_variation_attr('src');
                $product_link.wc_reset_variation_attr('href');
            }

            window.setTimeout(function() {
                $(window).trigger('resize');
                $form.wc_maybe_trigger_slide_position_reset(variation);
                $product_gallery.trigger('woocommerce_gallery_init_zoom');
            }, 20);
        }
    });

    $.apusThemeExtensions.shop = $.apusThemeCore.woo_init;


    // gallery

    var ApusProductGallery = function($target, args) {
        var self = this;
        this.$target = $target;
        this.$images = $('.woocommerce-product-gallery__image', $target);

        // No images? Abort.
        if (0 === this.$images.length) {
            this.$target.css('opacity', 1);
            return;
        }

        // Make this object available.
        $target.data('product_gallery', this);

        // Pick functionality to initialize...
        this.zoom_enabled = $.isFunction($.fn.zoom) && wc_single_product_params.zoom_enabled;
        this.photoswipe_enabled = typeof PhotoSwipe !== 'undefined' && wc_single_product_params.photoswipe_enabled;

        // ...also taking args into account.
        if (args) {
            this.zoom_enabled = false === args.zoom_enabled ? false : this.zoom_enabled;
            this.photoswipe_enabled = false === args.photoswipe_enabled ? false : this.photoswipe_enabled;
        }



        // Bind functions to this.
        this.initZoom = this.initZoom.bind(this);
        this.initZoomForTarget = this.initZoomForTarget.bind(this);
        this.initPhotoswipe = this.initPhotoswipe.bind(this);
        this.getGalleryItems = this.getGalleryItems.bind(this);
        this.openPhotoswipe = this.openPhotoswipe.bind(this);

        this.$target.css('opacity', 1);

        if (this.zoom_enabled) {
            this.initZoom();
            $target.on('woocommerce_gallery_init_zoom', this.initZoom);
        }

        if (this.photoswipe_enabled) {
            this.initPhotoswipe();
        }

        $('.apus-woocommerce-product-gallery').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            self.initZoomForTarget(self.$images.eq(nextSlide));
        });
    };


    /**
     * Init zoom.
     */
    ApusProductGallery.prototype.initZoom = function() {
        this.initZoomForTarget(this.$images.first());
    };

    /**
     * Init zoom.
     */
    ApusProductGallery.prototype.initZoomForTarget = function(zoomTarget) {
        if (!this.zoom_enabled) {
            return false;
        }

        var galleryWidth = this.$target.width(),
            zoomEnabled = false;

        $(zoomTarget).each(function(index, target) {
            var image = $(target).find('img');

            if (image.data('large_image_width') > galleryWidth) {
                zoomEnabled = true;
                return false;
            }
        });

        // But only zoom if the img is larger than its container.
        if (zoomEnabled) {
            var zoom_options = {
                touch: false
            };

            if ('ontouchstart' in window) {
                zoom_options.on = 'click';
            }

            zoomTarget.trigger('zoom.destroy');
            zoomTarget.zoom(zoom_options);
        }
    };

    /**
     * Init PhotoSwipe.
     */
    ApusProductGallery.prototype.initPhotoswipe = function() {
        if (this.zoom_enabled && this.$images.length > 0) {
            this.$target.prepend('<a href="#" class="woocommerce-product-gallery__trigger"><i class="flaticon-zoom-in"></i></a>');
            this.$target.on('click', '.woocommerce-product-gallery__trigger', this.openPhotoswipe);
        }
        this.$target.on('click', '.woocommerce-product-gallery__image a', this.openPhotoswipe);
    };

    /**
     * Get product gallery image items.
     */
    ApusProductGallery.prototype.getGalleryItems = function() {
        var $slides = this.$images,
            items = [];

        if ($slides.length > 0) {
            $slides.each(function(i, el) {
                var img = $(el).find('img'),
                    large_image_src = img.attr('data-large_image'),
                    large_image_w = img.attr('data-large_image_width'),
                    large_image_h = img.attr('data-large_image_height'),
                    item = {
                        src: large_image_src,
                        w: large_image_w,
                        h: large_image_h,
                        title: img.attr('data-caption') ? img.attr('data-caption') : img.attr('title')
                    };
                items.push(item);
            });
        }

        return items;
    };

    /**
     * Open photoswipe modal.
     */
    ApusProductGallery.prototype.openPhotoswipe = function(e) {
        e.preventDefault();

        var pswpElement = $('.pswp')[0],
            items = this.getGalleryItems(),
            eventTarget = $(e.target),
            clicked;

        if (this.$target.find('.woocommerce-product-gallery__image.slick-current').length > 0) {
            clicked = this.$target.find('.woocommerce-product-gallery__image.slick-current');
        } else {
            clicked = eventTarget.closest('.woocommerce-product-gallery__image');
        }
        var options = $.extend({
            index: $(clicked).index()
        }, wc_single_product_params.photoswipe_options);

        // Initializes and opens PhotoSwipe.
        var photoswipe = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        photoswipe.init();
    };

    /**
     * Function to call wc_product_gallery on jquery selector.
     */
    $.fn.apus_wc_product_gallery = function(args) {
        new ApusProductGallery(this, args);
        return this;
    };

    /*
     * Initialize all galleries on page.
     */
    $('.apus-woocommerce-product-gallery-wrapper').each(function() {
        $(this).apus_wc_product_gallery();
    });


})(jQuery);