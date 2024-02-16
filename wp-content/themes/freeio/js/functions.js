(function($) {
    "use strict";

    if (!$.apusThemeExtensions)
        $.apusThemeExtensions = {};

    function ApusThemeCore() {
        var self = this;
        // self.init();
    };

    ApusThemeCore.prototype = {
        /**
         *  Initialize
         */
        init: function() {
            var self = this;

            self.preloadSite();

            self.activeAccordion();

            // slick init
            self.initSlick($("[data-carousel=slick]"));

            // isoto
            self.initIsotope();

            // Unveil init
            setTimeout(function() {
                self.layzyLoadImage();
            }, 200);

            self.initHeaderSticky('main-sticky-header');

            // back to top
            self.backToTop();

            // popup image
            self.popupImage();

            $('[data-bs-toggle="tooltip"]').tooltip();

            self.initMobileMenu();

            self.initVerticalMenu();

            self.mainMenuInit();



            $(document.body).on('click', '.nav [data-toggle="dropdown"]', function(e) {
                e.preventDefault();
                if (this.href && this.href != '#') {
                    if (this.target && this.target == '_blank') {
                        window.open(this.href, '_blank');
                    } else {
                        window.location.href = this.href;
                    }
                }
            });

            $('.navbar-wrapper .show-navbar-sidebar').on('click', function() {
                $(this).closest('.navbar-wrapper').find('.navbar-sidebar-wrapper').addClass('active');
                $(this).closest('.navbar-wrapper').find('.navbar-sidebar-overlay').addClass('active');
            });

            $('.close-navbar-sidebar, .navbar-sidebar-overlay').on('click', function() {
                $(this).closest('.navbar-wrapper').find('.navbar-sidebar-wrapper').removeClass('active');
                $(this).closest('.navbar-wrapper').find('.navbar-sidebar-overlay').removeClass('active');
            });

            if ($('#tabs-product').length) {
                var scrollSpy = new bootstrap.ScrollSpy(document.body, {
                    target: '#tabs-product'
                });
            }


            if ($('.header-notice-wrapper').length) {
                var noticeID = $('.header-notice-wrapper').data('noticeId') || '',
                    cookieName = 'store_notice' + noticeID;

                // Check the value of that cookie and show/hide the notice accordingly
                if ('hidden' === Cookies.get(cookieName)) {
                    $('.header-notice-wrapper').hide();
                } else {
                    $('.header-notice-wrapper').show();
                }

                // Set a cookie and hide the store notice when the dismiss button is clicked
                $('.header-notice-dismiss-btn').on('click', function(event) {
                    Cookies.set(cookieName, 'hidden', {
                        path: '/'
                    });
                    $('.header-notice-wrapper').hide();
                    event.preventDefault();
                });
            }


            self.loadExtension();
        },
        /**
         *  Extensions: Load scripts
         */
        loadExtension: function() {
            var self = this;

            if ($.apusThemeExtensions.quantity_increment) {
                $.apusThemeExtensions.quantity_increment.call(self);
            }

            if ($.apusThemeExtensions.shop) {
                $.apusThemeExtensions.shop.call(self);
            }

            if ($.apusThemeExtensions.job_map) {
                $.apusThemeExtensions.job_map.call(self);
            }

            if ($.apusThemeExtensions.job) {
                $.apusThemeExtensions.job.call(self);
            }
        },
        initSlick: function(element) {
            var self = this;
            element.each(function() {
                var config = {
                    infinite: false,
                    arrows: $(this).data('nav'),
                    dots: $(this).data('pagination'),
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    prevArrow: "<button type='button' class='slick-arrow slick-prev'><i class='flaticon-left-arrow'></i></span><span class='textnav'>" + freeio_opts.previous + "</span></button>",
                    nextArrow: "<button type='button' class='slick-arrow slick-next'><span class='textnav'>" + freeio_opts.next + "</span><i class='flaticon-next'></i></button>",
                };

                var slick = $(this);
                if ($(this).data('items')) {
                    config.slidesToShow = $(this).data('items');
                    var slidestoscroll = $(this).data('items');
                }
                if ($(this).data('infinite')) {
                    config.infinite = true;
                }
                if ($(this).data('autoplay')) {
                    config.autoplay = true;
                    config.autoplaySpeed = 2500;
                }
                if ($(this).data('disable_draggable')) {
                    config.touchMove = false;
                    config.draggable = false;
                    config.swipe = false;
                    config.swipeToSlide = false;
                }
                if ($(this).data('centermode')) {
                    config.centerMode = true;
                }
                if ($(this).data('centerpadding')) {
                    config.centerPadding = $(this).data('centerpadding');
                }
                if ($(this).data('vertical')) {
                    config.vertical = true;
                }
                if ($(this).data('rows')) {
                    config.rows = $(this).data('rows');
                }
                if ($(this).data('asnavfor')) {
                    config.asNavFor = $(this).data('asnavfor');
                }
                if ($(this).data('slidestoscroll')) {
                    var slidestoscroll = $(this).data('slidestoscroll');
                }
                if ($(this).data('focusonselect')) {
                    config.focusOnSelect = $(this).data('focusonselect');
                }
                config.slidesToScroll = slidestoscroll;


                if ($(this).data('smalldesktop')) {
                    var smalldesktop = $(this).data('smalldesktop');
                } else {
                    var smalldesktop = config.items;
                }
                if ($(this).data('large')) {
                    var large = $(this).data('large');
                } else {
                    var large = 4;
                }
                if ($(this).data('medium')) {
                    var medium = $(this).data('medium');
                } else {
                    var medium = 3;
                }
                if ($(this).data('small')) {
                    var small = $(this).data('small');
                } else {
                    var small = 2;
                }
                if ($(this).data('smallest')) {
                    var smallest = $(this).data('smallest');
                } else {
                    if ($(this).data('small')) {
                        var smallest = $(this).data('small');
                    } else {
                        var smallest = 2;
                    }
                }


                if ($(this).data('slidestoscroll_smalldesktop')) {
                    var slidestoscroll_smalldesktop = $(this).data('slidestoscroll_smalldesktop');
                } else {
                    var slidestoscroll_smalldesktop = config.items;
                }
                if ($(this).data('slidestoscroll_large')) {
                    var slidestoscroll_large = $(this).data('slidestoscroll_large');
                } else {
                    var slidestoscroll_large = large;
                }
                if ($(this).data('slidestoscroll_medium')) {
                    var slidestoscroll_medium = $(this).data('slidestoscroll_medium');
                } else {
                    var slidestoscroll_medium = medium;
                }
                if ($(this).data('slidestoscroll_small')) {
                    var slidestoscroll_small = $(this).data('slidestoscroll_small');
                } else {
                    var slidestoscroll_small = small;
                }
                if ($(this).data('slidestoscroll_smallest')) {
                    var slidestoscroll_smallest = $(this).data('slidestoscroll_smallest');
                } else {
                    var slidestoscroll_smallest = smallest;
                }

                config.responsive = [

                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: smallest,
                            slidesToScroll: slidestoscroll_smallest,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: small,
                            slidesToScroll: slidestoscroll_small
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: medium,
                            slidesToScroll: slidestoscroll_medium
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: large,
                            slidesToScroll: slidestoscroll_large
                        }
                    },
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: smalldesktop,
                            slidesToScroll: slidestoscroll_smalldesktop
                        }
                    }
                ];

                if ($('html').attr('dir') == 'rtl') {
                    config.rtl = true;
                }

                $(this).slick(config);

            });

            // Fix owl in bootstrap tabs
            $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                var target = $(e.target).attr("href");
                var $slick = $(".slick-carousel", target);

                if ($slick.length > 0 && $slick.hasClass('slick-initialized')) {
                    $slick.slick('refresh');
                }
                self.layzyLoadImage();
            });

            // Fix owl in bootstrap 5 tabs
            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
                var target = $(e.target).attr("href");
                var $slick = $(".slick-carousel", target);

                if ($slick.length > 0 && $slick.hasClass('slick-initialized')) {
                    $slick.slick('refresh');
                }
                self.layzyLoadImage();
            });
        },
        layzyLoadImage: function() {
            $(window).off('scroll.unveil resize.unveil lookup.unveil');
            var $images = $('.image-wrapper:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                $images.unveil(1, function() {
                    $(this).load(function() {
                        $(this).parents('.image-wrapper').first().addClass('image-loaded');
                        $(this).removeAttr('data-src');
                        $(this).removeAttr('data-srcset');
                        $(this).removeAttr('data-sizes');
                    });
                });
            }

            var $images = $('.product-image:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                $images.unveil(1, function() {
                    $(this).load(function() {
                        $(this).parents('.product-image').first().addClass('image-loaded');
                    });
                });
            }
        },
        initIsotope: function() {
            $('.isotope-items').each(function() {
                var $container = $(this);

                $container.imagesLoaded(function() {
                    $container.isotope({
                        itemSelector: '.isotope-item',
                        transformsEnabled: true, // Important for videos
                        masonry: {
                            columnWidth: $container.data('columnwidth')
                        }
                    });
                });
            });

            /*---------------------------------------------- 
             *    Apply Filter        
             *----------------------------------------------*/
            $('.isotope-filter li a').on('click', function() {

                var parentul = $(this).parents('ul.isotope-filter').data('related-grid');
                $(this).parents('ul.isotope-filter').find('li a').removeClass('active');
                $(this).addClass('active');
                var selector = $(this).attr('data-filter');
                $('#' + parentul).isotope({
                    filter: selector
                }, function() {});

                return (false);
            });
        },
        initHeaderSticky: function(main_sticky_class) {
            if ($('.' + main_sticky_class).length) {
                if (typeof Waypoint !== 'undefined') {
                    if ($('.' + main_sticky_class) && typeof Waypoint.Sticky !== 'undefined') {
                        var sticky = new Waypoint.Sticky({
                            element: $('.' + main_sticky_class)[0],
                            wrapper: '<div class="main-sticky-header-wrapper">',
                            offset: '-10px',
                            stuckClass: 'sticky-header'
                        });
                    }
                }
            }
        },

        initVerticalMenu: function() {
            // mobile menu
            $('.show-hover').on('click', function(e) {
                e.stopPropagation();
                $('.show-hover .content-vertical').toggle(350);
            });
            $('body').on('click', function() {
                $('.show-hover .content-vertical').slideUp(350);
            });
            $('.content-vertical').on('click', function(e) {
                e.stopPropagation();
            });
        },

        backToTop: function() {
            $(window).scroll(function() {
                if ($(this).scrollTop() > 400) {
                    $('#back-to-top').addClass('active');
                } else {
                    $('#back-to-top').removeClass('active');
                }
            });
            $('#back-to-top').on('click', function() {
                $('html, body').animate({
                    scrollTop: '0px'
                }, 800);
                return false;
            });
        },

        popupImage: function() {
            var self = this;
            // popup
            $(".popup-image").magnificPopup({
                type: 'image'
            });
            $('.popup-video').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });

            $('.widget-gallery').each(function() {
                var tagID = $(this).attr('id');
                $('#' + tagID).magnificPopup({
                    delegate: '.popup-image-gallery',
                    type: 'image',
                    tLoading: 'Loading image #%curr%...',
                    mainClass: 'mfp-img-mobile',
                    gallery: {
                        enabled: true,
                        navigateByImgClick: true,
                        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
                    }
                });
            });

            $('.btn-show-popup').magnificPopup({
                mainClass: 'apus-mfp-zoom-in',
                type: 'inline',
                midClick: true,
                modal: true,
                callbacks: {
                    open: function() {
                        self.layzyLoadImage();
                    }
                }
            });

            $('body').on('click', '.close-magnific-popup', function() {
                $.magnificPopup.close();
            });
        },
        preloadSite: function() {
            // preload page
            setTimeout(function() {
                if ($('body').hasClass('apus-body-loading')) {
                    $('body').removeClass('apus-body-loading');
                    $('.apus-page-loading').fadeOut(100);
                }
            }, 100);
        },

        activeAccordion: function() {
            $('.panel-collapse').on('show.bs.collapse', function() {
                $(this).siblings('.panel-heading').addClass('active');
            });

            $('.panel-collapse').on('hide.bs.collapse', function() {
                $(this).siblings('.panel-heading').removeClass('active');
            });
        },

        initMobileMenu: function() {

            // stick mobile
            var self = this;

            // mobile menu
            $('.close-offcanvas ,.btn-showmenu').on('click', function(e) {
                e.stopPropagation();
                $('.apus-offcanvas').toggleClass('active');
                $('.over-dark').toggleClass('active');

                $("#mobile-menu-container").slidingMenu({
                    backLabel: freeio_opts.menu_back_text
                });
            });
            $('body').on('click', function() {
                if ($('.apus-offcanvas').hasClass('active')) {
                    $('.apus-offcanvas').toggleClass('active');
                    $('.over-dark').toggleClass('active');
                }
            });
            $('.apus-offcanvas').on('click', function(e) {
                e.stopPropagation();
            });

            // sidebar mobile       
            $('body').on('click', '.mobile-sidebar-btn.btn-left', function() {
                $('.sidebar-left').toggleClass('active');
            });
            $('body').on('click', '.mobile-sidebar-btn.btn-right', function() {
                $('.sidebar-right').toggleClass('active');
            });

            $('body').on('click', '.mobile-sidebar-btn', function() {
                $('.mobile-sidebar-panel-overlay').toggleClass('active');
                $('.mobile-sidebar-btn i').toggleClass('ti-menu-alt ti-close');
            });
            $('body').on('click', '.mobile-sidebar-panel-overlay, .close-sidebar-btn', function() {
                $('.sidebar').removeClass('active');
                $('.mobile-sidebar-panel-overlay').removeClass('active');
                $('.mobile-sidebar-btn i').toggleClass('ti-menu-alt ti-close');
            });

            $(window).scroll(function() {
                if ($(window).width() <= 600) {
                    if ($('#wpadminbar').length) {
                        var admin_bar_h = $('#wpadminbar').outerHeight();
                        var mobile = $('.header-mobile').outerHeight();
                        var scroll_h = $(this).scrollTop();
                        if (scroll_h > admin_bar_h) {
                            $('.admin-bar .header-mobile').css({
                                'top': 0
                            });
                            $('.admin-bar .wrapper-menu-dashboard').css({
                                'top': mobile
                            });
                        } else {
                            var top = admin_bar_h - scroll_h;
                            $('.admin-bar .header-mobile').css({
                                'top': top
                            });
                            $('.admin-bar .wrapper-menu-dashboard').css({
                                'top': top + mobile
                            });
                        }
                    }
                }
            });
        },
        mainMenuInit: function() {
            $('.apus-megamenu .megamenu .has-mega-menu.aligned-fullwidth').each(function(e) {
                var $this = $(this),
                    i = $this.closest(".elementor-container"),
                    a = $this.closest('.apus-megamenu');
                $this.on('hover', function() {
                    var m = $(this).find('> .dropdown-menu .dropdown-menu-inner'),
                        w = i.width();

                    m.css({
                        width: w,
                        marginLeft: i.offset().left - a.offset().left
                    });
                });

                $this.find('.elementor-element').addClass('no-transparent');
            });
        },
        setCookie: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }
    }

    $.apusThemeCore = ApusThemeCore.prototype;

    $(document).ready(function() {
        // Initialize script
        var apusthemecore_init = new ApusThemeCore();
        apusthemecore_init.init();
    });

    jQuery(window).on("elementor/frontend/init", function() {

        var apusthemecore_init = new ApusThemeCore();

        // General element
        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_brands.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_features_box.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_posts.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_testimonials.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_banners.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        // freeio elements

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_freeio_employers.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
                apusthemecore_init.layzyLoadImage();
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_freeio_freelancers.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_freeio_jobs.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_freeio_jobs_tabs.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_projects.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_project_categories.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_projects_tabs.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_services.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_service_categories.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_locations.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_services_tabs.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction("frontend/element_ready/apus_element_packages.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );
    });

})(jQuery);