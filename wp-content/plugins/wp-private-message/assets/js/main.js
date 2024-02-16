(function($) {
    "use strict";

    if (!$.wjbExtensions)
        $.wjbExtensions = {};

    function WJBMainCore() {
        var self = this;
        self.init();
    };

    WJBMainCore.prototype = {
        /**
         *  Initialize
         */
        init: function() {
            var self = this;

            self.sendMessage();

            self.replyMessage();

            self.chooseMessage();

            self.searchMessage();

            self.messageLoadmore();

            self.repliedLoadmore();

            self.deleteMessage();

            $('.list-message-inner').perfectScrollbar();
            $('.list-replies-inner').perfectScrollbar();
            $(".list-replies-inner").scrollTop($(".list-replies-inner").prop("scrollHeight"));
            $(".list-replies-inner").perfectScrollbar('update');

            $(document).on('click', '.toggle-message-btn', function() {
                $('.list-message-wrapper').slideToggle();
            });

            self.loadExtension();
        },
        loadExtension: function() {
            var self = this;

            if ($.wjbExtensions.ajax_upload) {
                $.wjbExtensions.ajax_upload.call(self);
            }
        },
        sendMessage: function() {
            var self = this;
            $(document).on('submit', 'form.send-message-form', function(e) {
                e.preventDefault();
                var form_id = $(this).attr('id');
                var $this = $(this);
                $this.find('.alert').remove();
                $this.find('.send-message-btn').addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                $.ajax({
                    url: wp_private_message_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.find('.send-message-btn').removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        $this.find('textarea[name=subject]').val('');
                        $this.find('textarea[name=message]').val('');
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                });
                return false;
            });
        },
        replyMessage: function() {
            var self = this;
            $(document).on('submit', 'form.reply-message-form', function(e) {
                e.preventDefault();
                var form_id = $(this).attr('id');
                var $this = $(this);
                $this.find('.alert').remove();
                $this.find('.reply-message-btn').addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                $.ajax({
                    url: wp_private_message_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.find('.reply-message-btn').removeClass('loading');

                    if (data.status) {
                        $this.closest('.replies-content').find('.list-replies').append(data.msg);
                        $this.find('textarea[name=message]').val('');
                        $(".list-replies-inner").scrollTop($(".list-replies-inner").prop("scrollHeight"));
                        $(".list-replies-inner").perfectScrollbar('update');
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                });
                return false;
            });
        },
        chooseMessage: function() {
            var self = this;
            $(document).on('click', 'a.message-item', function(e) {
                e.preventDefault();
                var $this = $(this);
                var parent = $(this).parent();

                if (parent.hasClass('active')) {
                    return;
                }
                $('ul.list-message li').removeClass('active');
                parent.addClass('active').addClass('read').removeClass('unread');

                $this.closest('.message-section-wrapper').find('.replies-content').addClass('loading');

                $.ajax({
                    url: wp_private_message_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'message_id': $(this).data('id'),
                        'action': 'wp_private_message_choose_message',
                        'nonce': $(this).data('nonce')
                    }
                }).done(function(data) {
                    $this.closest('.message-section-wrapper').find('.replies-content').removeClass('loading');

                    if (data.status) {
                        $this.closest('.message-section-wrapper').find('.replies-content').html(data.msg);
                        var $inner = $this.closest('.message-section-wrapper').find(".list-replies-inner");
                        $inner.perfectScrollbar();
                        $inner.scrollTop($inner.prop("scrollHeight"));
                        $inner.perfectScrollbar('update');
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                });
                return false;
            });
        },
        searchMessage: function() {
            var self = this;
            $(document).on('submit', 'form.search-message-form', function(e) {
                e.preventDefault();
                var $this = $(this);
                var form_id = $this.attr('id');
                $this.closest('.list-message-wrapper').addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                $.ajax({
                    url: wp_private_message_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.closest('.list-message-wrapper').removeClass('loading');

                    if (data.status) {
                        $this.closest('.list-message-wrapper').find('ul.list-message').html(data.output);
                        $this.closest('.list-message-wrapper').find('.loadmore-action').remove();
                        if (data.next_page) {
                            $this.closest('.list-message-wrapper').find('.list-message-inner').append(data.next_page);
                        }
                        var $inner = $this.closest('.list-message-wrapper').find('.list-message-inner');
                        $inner.perfectScrollbar();
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                });
                return false;
            });
            $(document).on('change', 'input[name=search_read]', function() {
                $('form.search-message-form').trigger('submit');
            });
        },
        messageLoadmore: function() {
            var self = this;
            $(document).on('click', '.loadmore-message-btn', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.addClass('loading');
                var search = '';
                if ($('form.search-message-form').length > 0) {
                    search = $('form.search-message-form').find('input[name=search]').val();
                }
                $.ajax({
                    url: wp_private_message_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'paged': $this.data('paged'),
                        'action': 'wp_private_message_message_loadmore',
                        'search': search,
                    },
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.closest('.list-message-inner').find('.list-message').append(data.output);
                        if (data.next_page > 0) {
                            $this.attr('data-paged', data.next_page);
                        } else {
                            $this.remove();
                        }
                    }
                });
                return false;
            });
        },
        repliedLoadmore: function() {
            var self = this;
            $(document).on('click', '.loadmore-replied-btn', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.addClass('loading');

                $.ajax({
                    url: wp_private_message_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'paged': $this.attr('data-paged'),
                        'action': 'wp_private_message_replied_loadmore',
                        'parent': $this.data('parent'),
                    },
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.closest('.list-replies-inner').find('.list-replies').prepend(data.output);
                        if (data.next_page > 0) {
                            $this.attr('data-paged', data.next_page);
                        } else {
                            $this.remove();
                        }
                    }
                });
                return false;
            });
        },
        deleteMessage: function() {
            var self = this;
            $(document).on('click', 'a.delete-message-btn', function(e) {
                e.preventDefault();
                var $this = $(this);
                var message_id = $this.data('id');
                $this.closest('.replies-content').addClass('loading');

                $.ajax({
                    url: wp_private_message_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'message_id': message_id,
                        'action': 'wp_private_message_delete_message',
                        'nonce': $this.data('nonce')
                    }
                }).done(function(data) {
                    $this.closest('.replies-content').removeClass('loading');

                    if (data.status) {
                        $this.closest('.message-section-wrapper').find('#message-id-' + message_id).remove();
                        $this.closest('.replies-content').html('');
                    }
                    self.showMessage(data.msg, data.status);
                });
                return false;
            });
        },
        showMessage: function(msg, status) {
            console.log(msg);
            if (msg) {
                var classes = 'alert bg-warning';
                if (status) {
                    classes = 'alert bg-info';
                }
                var $html = '<div id="wp-private-message-popup-message" class="animated fadeInRight"><div class="message-inner ' + classes + '">' + msg + '</div></div>';
                $('body').find('#wp-private-message-popup-message').remove();
                $('body').append($html).fadeIn(500);
                setTimeout(function() {
                    $('body').find('#wp-private-message-popup-message').removeClass('fadeInRight').addClass('delay-2s fadeOutRight');
                }, 2500);
            }
        }
    }

    $.wjbMainCore = WJBMainCore.prototype;

    $(document).ready(function() {
        // Initialize script
        new WJBMainCore();

    });

})(jQuery);