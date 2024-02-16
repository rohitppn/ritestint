(function($) {
    "use strict";

    if (!$.wpfiExtensions)
        $.wpfiExtensions = {};

    function WJBPMainCore() {
        var self = this;
        self.init();
    };

    WJBPMainCore.prototype = {
        /**
         *  Initialize
         */
        init: function() {
            var self = this;

            self.fileUpload();

            self.userLoginRegister();
            self.userLoginRegisterNew();

            self.userChangePass();

            self.removeItem();

            self.fillJob();

            self.applyEmail();

            self.recaptchaCallback();

            self.applyInternal();

            self.applicantsInit();

            self.applicationMeeting();

            // favorite
            self.jobFavorite();

            self.serviceFavorite();

            self.projectFavorite();

            self.employerFavorite();

            self.freelancerFavorite();

            //
            self.servicePrice();

            self.projectProposal();

            self.reviewInit();

            self.jobAlert();

            self.freelancerAlert();

            self.jobSocialApply();

            self.select2Init();

            self.jobSubmission();

            self.filterListing();

            self.employerAddEmployee();

            self.inviteFreelancer();

            self.statementPayout();

            self.dispute();

            self.mixesFn();

            self.loadExtension();
        },
        loadExtension: function() {
            var self = this;

            // if ($.wpfiExtensions.ajax_upload) {
            //     $.wpfiExtensions.ajax_upload.call(self);
            // }
        },
        fileUpload: function() {

            var imagesPreview = function(input, placeToInsertImagePreview) {
                if (input.files) {
                    var filesAmount = input.files.length;
                    var i;
                    for (i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                        }
                        reader.readAsDataURL(input.files[i]);
                    }
                }
            };
            var filesPreview = function(input, placeToInsertImagePreview) {
                if (input.files) {
                    var filesAmount = input.files.length;
                    var i;
                    for (i = 0; i < filesAmount; i++) {
                        var html = $($.parseHTML('<div><code>' + input.files[i].name + '</code></div>')).appendTo(placeToInsertImagePreview);
                    }
                }
            };
            $('.cmb-type-wp-freeio-file').each(function(e) {
                var $e_this = $(this);
                $(this).find('input[type="file"]:not(.wp-freeio-file-upload)').on('change', function() {
                    $e_this.find('.wp-freeio-uploaded-files').html('');

                    // Validate type
                    var allowed_types = $(this).data('file_types');

                    if (allowed_types) {
                        var acceptFileTypes = new RegExp('(\.|\/)(' + allowed_types + ')$', 'i');
                        if (this.files[0].name.length && !acceptFileTypes.test(this.files[0].name)) {
                            alert(wp_freeio_opts.not_allow);
                            $(this).val(null);
                            return false;
                        }
                    }

                    var file = this.files[0];
                    var fileType = file["type"];
                    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
                    if ($.inArray(fileType, validImageTypes) < 0) {
                        filesPreview(this, $e_this.find('.wp-freeio-uploaded-files'));
                        $e_this.find('.wp-freeio-uploaded-files').css("display", "block");
                    } else {
                        imagesPreview(this, $e_this.find('.wp-freeio-uploaded-files'));
                        $e_this.find('.wp-freeio-uploaded-files').css("display", "block");
                    }
                });
            });

            $(document).on('change', '.upload-file-btn-wrapper input[type="file"]', function() {
                var $e_this = $(this).closest('.upload-file-btn-wrapper');
                var $text = $e_this.find('.upload-file-btn').data('text');
                // Validate type
                var allowed_types = $(this).data('file_types');

                if ($(this).val() == '') {
                    $e_this.find('.upload-file-btn span.text').html($text);
                    $e_this.find('.label-can-drag').removeClass('has-file');
                    return false;
                }
                if (allowed_types) {
                    var acceptFileTypes = new RegExp('(\.|\/)(' + allowed_types + ')$', 'i');
                    if (this.files[0].name.length && !acceptFileTypes.test(this.files[0].name)) {
                        alert(wp_freeio_opts.not_allow);
                        $(this).val(null);
                        $e_this.find('.upload-file-btn span.text').html($text);
                        $e_this.find('.label-can-drag').removeClass('has-file');
                        return false;
                    }
                }

                if (this.files) {
                    var filesAmount = this.files.length;
                    var i;
                    $e_this.find('.upload-file-btn span.text').html('');
                    for (i = 0; i < filesAmount; i++) {
                        var $file_html = $($.parseHTML('<span class="text-inner"><span>' + this.files[i].name + '</span></span>'));
                        $e_this.find('.upload-file-btn span.text').append($file_html);
                    }
                    $e_this.find('.upload-file-btn span.text').append($($.parseHTML('<span class="close">&times;</span>')));
                    $e_this.find('.label-can-drag').addClass('has-file');
                }
            });

            $(document).on('click', '.upload-file-btn-wrapper .upload-file-btn span.close', function(e) {
                e.preventDefault();
                var $e_this = $(this).closest('.upload-file-btn-wrapper');
                var $file_input = $e_this.find('input[type="file"]');
                var $text = $e_this.find('.upload-file-btn').data('text');

                $file_input.val(null);
                $e_this.find('.upload-file-btn span.text').html($text);
                $e_this.find('.label-can-drag').removeClass('has-file');
            });

            var isAdvancedUpload = function() {
                var div = document.createElement('div');
                return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
            }();

            if (isAdvancedUpload) {

                var droppedFiles = false;
                $('.label-can-drag').each(function() {
                    var label_self = $(this);
                    label_self.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }).on('dragover dragenter', function() {
                        label_self.addClass('is-dragover');
                    }).on('dragleave dragend drop', function() {
                        label_self.removeClass('is-dragover');
                    }).on('drop', function(e) {
                        droppedFiles = e.originalEvent.dataTransfer.files;
                        label_self.parent().find('input[type="file"]').prop('files', droppedFiles).trigger('change');
                    });
                });
            }
            $(document).on('click', '.label-can-drag:not(.has-file)', function() {
                $(this).parent().find('input[type="file"]').trigger('click');
            });
        },
        userLoginRegisterNew: function() {
            var self = this;

            $(document).on('submit', 'form._employer_register_fields, form._freelancer_register_fields', function() {
                var $this = $(this);

                if (self.registerAjax) {
                    self.registerAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $(this).attr('id');


                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.registerAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_registernew&action=wp_freeio_ajax_registernew'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        if (data.redirect) {
                            setTimeout(function() {
                                if (data.role == 'wp_freeio_employer') {
                                    window.location.href = wp_freeio_opts.after_register_page_url;
                                } else {
                                    window.location.href = wp_freeio_opts.after_register_page_freelancer_url;
                                }
                            }, 500);
                        }
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                        if (wp_freeio_opts.recaptcha_enable) {
                            var recaptchas = document.getElementsByClassName("ga-recaptcha");
                            for (var i = 0; i < recaptchas.length; i++) {
                                grecaptcha.reset(i);
                            }
                        }
                    }

                    self.registerAjax = false;
                });

                return false;
            });
        },
        userLoginRegister: function() {
            var self = this;

            // sign in proccess
            $('body').on('submit', 'form.login-form', function() {
                var $this = $(this);
                $('.alert', this).remove();
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_login'),
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize() + "&action=wp_freeio_ajax_login"
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            if (data.role == 'wp_freeio_employer') {
                                window.location.href = wp_freeio_opts.after_login_page_url;
                            } else {
                                window.location.href = wp_freeio_opts.after_login_page_freelancer_url;
                            }

                        }, 500);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');

                        if (wp_freeio_opts.recaptcha_enable) {
                            var recaptchas = document.getElementsByClassName("ga-recaptcha");
                            for (var i = 0; i < recaptchas.length; i++) {
                                grecaptcha.reset(i);
                            }
                        }
                    }
                });
                return false;
            });
            $('body').on('click', '.back-link', function(e) {
                e.preventDefault();
                var $con = $(this).closest('.login-form-wrapper');
                $con.find('.form-container').hide();
                $($(this).attr('href')).show();
                return false;
            });

            // lost password in proccess
            $('body').on('submit', 'form.forgotpassword-form', function() {
                var $this = $(this);
                $('.alert', this).remove();
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_forgotpass'),
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize() + "&action=wp_freeio_ajax_forgotpass"
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            window.location.reload(true);
                        }, 500);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }
                });
                return false;
            });
            $('body').on('click', '#forgot-password-form-wrapper form .btn-cancel', function(e) {
                e.preventDefault();
                $('#forgot-password-form-wrapper').hide();
                $('#login-form-wrapper').show();
            });

            // register
            $('body').on('submit', 'form.register-form', function() {
                var $this = $(this);
                $('.alert', this).remove();
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_register'),
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize() + "&action=wp_freeio_ajax_register"
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        if (data.redirect) {
                            setTimeout(function() {
                                if (data.role == 'wp_freeio_employer') {
                                    window.location.href = wp_freeio_opts.after_register_page_url;
                                } else {
                                    window.location.href = wp_freeio_opts.after_register_page_freelancer_url;
                                }
                            }, 500);
                        }
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                        if (wp_freeio_opts.recaptcha_enable) {
                            var recaptchas = document.getElementsByClassName("ga-recaptcha");
                            for (var i = 0; i < recaptchas.length; i++) {
                                grecaptcha.reset(i);
                            }
                        }
                    }
                });
                return false;
            });

            if ($('form.register-form').length > 0) {
                $('.role-tabs input[type=radio]').on('change', function() {
                    var val = $(this).val();
                    var container = $(this).closest('.register-form');
                    if (val == 'wp_freeio_freelancer') {
                        container.find('.wp_freeio_freelancer_show').show();
                        container.find('.wp_freeio_employer_show').hide();
                    } else {
                        container.find('.wp_freeio_freelancer_show').hide();
                        container.find('.wp_freeio_employer_show').show();
                    }
                });
                var val = $('.role-tabs input[type=radio]:checked').val();
                var container = $('form.register-form').closest('.register-form');
                if (val == 'wp_freeio_freelancer') {
                    container.find('.wp_freeio_freelancer_show').show();
                    container.find('.wp_freeio_employer_show').hide();
                } else {
                    container.find('.wp_freeio_freelancer_show').hide();
                    container.find('.wp_freeio_employer_show').show();
                }
            }

            // wp-freeio-resend-approve-account-btn
            $(document).on('click', '.wp-freeio-resend-approve-account-btn', function(e) {
                e.preventDefault();
                var $this = $(this),
                    $container = $(this).parent();
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_resend_approve_account'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'wp_freeio_ajax_resend_approve_account',
                        login: $this.data('login'),
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $container.html(data.msg);
                    } else {
                        $container.html(data.msg);
                    }
                });
            });

            $('.switch-user-role').on('click', function(e) {
                e.preventDefault();
                var $this = $(this);
                if (self.switchUserRoleAjax) {
                    self.switchUserRoleAjax.abort();
                }
                $this.addClass('loading');

                self.switchUserRoleAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_switch_user_role'),
                    type: 'POST',
                    dataType: 'json',
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        // self.showMessage(data.msg, data.status);
                        setTimeout(function() {
                            location.reload();
                        }, 500);
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                });
                self.switchUserRoleAjax = false;
            });
        },
        userChangePass: function() {
            var self = this;
            $('body').on('submit', 'form.change-password-form', function() {
                var $this = $(this);
                $('.alert', this).remove();
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_change_password'),
                    type: 'POST',
                    dataType: 'json',
                    data: $(this).serialize() + "&action=wp_freeio_ajax_change_password"
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            window.location.href = wp_freeio_opts.login_register_url;
                        }, 500);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }
                });
                return false;
            });
        },
        removeItem: function() {
            var self = this;
            $('.job-button-delete').on('click', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var job_id = $(this).data('job_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_job'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'job_id': job_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_remove_job',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.my-item-wrapper').remove();
                        }
                        $(document).trigger("after_remove_my_job", [$this, data]);

                        self.showMessage(data.msg, data.status);
                    });
                }
            });
            // remove project
            $('.project-button-delete').on('click', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var project_id = $(this).data('project_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_project'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'project_id': project_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_remove_project',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.my-item-wrapper').remove();
                        }
                        $(document).trigger("after_remove_my_project", [$this, data]);

                        self.showMessage(data.msg, data.status);
                    });
                }
            });
            // remove service
            $('.service-button-delete').on('click', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var service_id = $(this).data('service_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_service'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'service_id': service_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_remove_service',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.my-item-wrapper').remove();
                        }
                        $(document).trigger("after_remove_my_service", [$this, data]);

                        self.showMessage(data.msg, data.status);
                    });
                }
            });

            // remove service
            $('.service-addon-button-delete').on('click', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var service_addon_id = $(this).data('service_addon_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_service_addon'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'service_addon_id': service_addon_id,
                            'nonce': nonce,
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.my-item-wrapper').remove();
                        }
                        $(document).trigger("after_remove_my_service_addon", [$this, data]);

                        self.showMessage(data.msg, data.status);
                    });
                }
            });

            // remove proposal
            $('.proposal-button-delete').on('click', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var proposal_id = $(this).data('proposal_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_proposal'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'proposal_id': proposal_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_remove_proposal',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.my-item-wrapper').remove();
                        }
                        $(document).trigger("after_remove_my_proposal", [$this, data]);

                        self.showMessage(data.msg, data.status);
                    });
                }
            });
        },
        fillJob: function() {
            var self = this;
            $(document).on('click', '.btn-action-icon.mark_filled', function() {
                var $this = $(this);
                $this.addClass('loading');
                var job_id = $this.data('job_id');
                var nonce = $this.data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_mark_filled_job'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_mark_filled_job',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.attr('title', data.title);
                        $this.data('nonce', data.nonce);
                        $this.removeClass('mark_filled').addClass('mark_not_filled');
                        $this.find('i').attr('class', data.icon_class);

                        $this.closest('tr').find('.job-title-wrapper .application-status-label').remove();
                        if (data.label) {
                            $this.closest('tr').find('.job-title-wrapper').append(data.label);
                        }
                    }
                    self.showMessage(data.msg, data.status);
                });
            });
            $(document).on('click', '.btn-action-icon.mark_not_filled', function() {
                var $this = $(this);
                $this.addClass('loading');
                var job_id = $this.data('job_id');
                var nonce = $this.data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_mark_not_filled_job'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_mark_not_filled_job',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.attr('title', data.title);
                        $this.data('nonce', data.nonce);
                        $this.removeClass('mark_not_filled').addClass('mark_filled');
                        $this.find('i').attr('class', data.icon_class);

                        $this.closest('tr').find('.job-title-wrapper .application-status-label').remove();
                        if (data.label) {
                            $this.closest('tr').find('.job-title-wrapper').append(data.label);
                        }
                    }
                    self.showMessage(data.msg, data.status);
                });
            });
        },
        recaptchaCallback: function() {
            if (!window.grecaptcha) {} else {
                setTimeout(function() {
                    var recaptchas = document.getElementsByClassName("ga-recaptcha");
                    for (var i = 0; i < recaptchas.length; i++) {
                        var recaptcha = recaptchas[i];
                        var sitekey = recaptcha.dataset.sitekey;

                        grecaptcha.render(recaptcha, {
                            'sitekey': sitekey
                        });
                    }
                }, 500);
            }
        },
        applyEmail: function() {
            var self = this;

            $('.btn-apply-job-email:not(.filled), .btn-apply-job-call:not(.filled)').magnificPopup({
                mainClass: 'apus-mfp-zoom-in apus-mfp-zoom-call-in',
                type: 'inline',
                midClick: true
            });

            $('.btn-apply-job-email:not(.filled)').magnificPopup({
                mainClass: 'apus-mfp-zoom-in',
                type: 'inline',
                midClick: true
            });

            $(document).on('click', '.btn-apply-job-email.filled', function(e) {
                e.preventDefault();
                self.showMessage(wp_freeio_opts.job_filled, false);
            });

            $(document).on('submit', 'form.job-apply-email-form', function() {
                var $this = $(this);

                if (self.applyEmailAjax) {
                    self.applyEmailAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $(this).attr('id');
                var error = false;

                if (wp_freeio_opts.cv_required == 'on') {
                    var cv_file = $this.find('input[name="cv_file"]');
                    if (cv_file.length > 0 && cv_file.val() != '') {
                        cv_file = cv_file.prop('files')[0];
                        var file_size = cv_file.size;
                        var file_type = cv_file.type;

                        var allowed_types = wp_freeio_opts.cv_file_types;
                        var filesize_allow = wp_freeio_opts.cv_file_size_allow;
                        filesize_allow = parseInt(filesize_allow);

                        if (file_size > filesize_allow) {
                            alert(wp_freeio_opts.cv_file_size_error);
                            error = true;
                        }
                        if (allowed_types.indexOf(file_type) < 0) {
                            alert(wp_freeio_opts.cv_file_types_error);
                            error = true;
                        }
                    }
                }

                if (error == false) {
                    $this.find('.alert').remove();

                    $this.addClass('loading');
                    var form_data = new FormData($('#' + form_id)[0]);

                    var action = $(this).find('input[name=action]').val();
                    self.applyEmailAjax = $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', action),
                        type: 'POST',
                        dataType: 'json',
                        data: form_data,
                        processData: false,
                        contentType: false,
                    }).done(function(data) {
                        $this.removeClass('loading');

                        if (data.status) {
                            $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        } else {
                            $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                        }

                        self.applyEmailAjax = false;
                    });
                } else {
                    alert(wp_freeio_opts.choose_a_cv);
                }
                return false;
            });
        },
        applyInternal: function() {
            var self = this;
            $(document).on('click', '.btn-apply-job-internal-required:not(.filled)', function() {
                var msg = $(this).parent().find('.job-apply-internal-required-wrapper .msg-inner').text();
                self.showMessage(msg, false);
            });
            $('.btn-apply-job-internal:not(.filled), .btn-apply-job-internal-without-login:not(.filled)').magnificPopup({
                mainClass: 'apus-mfp-zoom-in',
                type: 'inline',
                midClick: true
            });

            $(document).on('click', '.btn-apply-job-internal.filled, .btn-apply-job-internal-without-login.filled, .btn-apply-job-internal-required.filled', function(e) {
                e.preventDefault();
                self.showMessage(wp_freeio_opts.job_filled, false);
            });

            $(document).on('submit', 'form.job-apply-internal-form', function() {
                var $this = $(this);

                if (self.applyInternalAjax) {
                    self.applyInternalAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }
                var form_wrapper_id = $(this).closest('.job-apply-internal-form-wrapper').attr('id');
                var form_id = $(this).attr('id');


                var error = true;
                if ($this.find('input[name="apply_cv_id"]:checked').val()) {
                    var error = false;
                }

                var cv_file = $this.find('input[name="cv_file"]');
                if (cv_file.length > 0 && cv_file.val() != '') {
                    var file_error = false;
                    cv_file = cv_file.prop('files')[0];
                    var file_size = cv_file.size;
                    var file_type = cv_file.type;

                    var allowed_types = wp_freeio_opts.cv_file_types;
                    var filesize_allow = wp_freeio_opts.cv_file_size_allow;
                    filesize_allow = parseInt(filesize_allow);

                    if (file_size > filesize_allow) {
                        alert(wp_freeio_opts.cv_file_size_error);
                        file_error = true;
                    }
                    if (allowed_types.indexOf(file_type) < 0) {
                        alert(wp_freeio_opts.cv_file_types_error);
                        file_error = true;
                    }

                    if (file_error == true) {
                        return false;
                    }
                    error = false;
                }

                if (wp_freeio_opts.cv_required == 'on') {

                } else {
                    var error = false;
                }

                if (error == false) {
                    $this.find('.alert').remove();

                    $this.addClass('loading');
                    var form_data = new FormData($('#' + form_id)[0]);

                    var action = $(this).find('input[name=action]').val();
                    self.applyInternalAjax = $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', action),
                        type: 'POST',
                        dataType: 'json',
                        data: form_data,
                        processData: false,
                        contentType: false,
                    }).done(function(data) {
                        $this.removeClass('loading');

                        if (data.status) {
                            $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                            if ($('a[href="#' + form_wrapper_id + '"]').length) {
                                $('a[href="#' + form_wrapper_id + '"]').html(data.text).removeClass('btn-apply-job-internal').addClass('btn-applied-job-internal');
                                setTimeout(function() {
                                    $.magnificPopup.close();
                                }, 2000);
                            }
                        } else {
                            $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                        }

                        self.applyInternalAjax = false;
                    });
                } else {
                    alert(wp_freeio_opts.choose_a_cv);
                }
                return false;
            });

            $(document).on('submit', 'form#_freelancer_register_fields_apply', function() {
                var $this = $(this);

                if (self.registerAjax) {
                    self.registerAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $(this).attr('id');


                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.registerAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_register_apply&action=wp_freeio_ajax_register_apply'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            location.reload();
                        }, 500);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                        if (wp_freeio_opts.recaptcha_enable) {
                            var recaptchas = document.getElementsByClassName("ga-recaptcha");
                            for (var i = 0; i < recaptchas.length; i++) {
                                grecaptcha.reset(i);
                            }
                        }
                    }

                    self.registerAjax = false;
                });

                return false;
            });
        },
        applicantsInit: function() {
            var self = this;
            $(document).on('click', '.btn-remove-job-applied', function(e) {
                e.preventDefault();
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    var $this = $(this);
                    $this.addClass('loading');
                    var applicant_id = $(this).data('applicant_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_applied'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'applicant_id': applicant_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_remove_applied',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.job-applied-wrapper').remove();
                            $this.closest('.job-applicant-wrapper').remove();
                        }
                        self.showMessage(data.msg, data.status);
                    });
                }
            });

            // reject applicant
            $(document).on('click', '.btn-reject-job-applied', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.addClass('loading');
                var applicant_id = $(this).data('applicant_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_reject_applied'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'applicant_id': applicant_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_reject_applied',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        var total_rej = parseInt($this.closest('.job-applicants').find('.rejected-applicants span').text()) + 1;
                        $this.closest('.job-applicants').find('.rejected-applicants span').text(total_rej);

                        if (data.output) {
                            $this.closest('.job-applicant-wrapper').replaceWith(data.output);

                            $('.btn-create-meeting-job-applied').magnificPopup({
                                mainClass: 'apus-mfp-zoom-in',
                                type: 'inline',
                                midClick: true,
                                closeBtnInside: false,
                            });
                        }
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // undo reject applicant
            $(document).on('click', '.btn-undo-reject-job-applied', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.addClass('loading');
                var applicant_id = $(this).data('applicant_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_undo_reject_applied'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'applicant_id': applicant_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_undo_reject_applied',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        var total_rej = parseInt($this.closest('.job-applicants').find('.rejected-applicants span').text()) - 1;
                        $this.closest('.job-applicants').find('.rejected-applicants span').text(total_rej);

                        if ($this.closest('.job-applicants').find('.rejected-applicants').hasClass('active')) {

                            $this.closest('.job-applied-wrapper').remove();
                            $this.closest('.job-applicant-wrapper').remove();
                        } else {
                            if (data.output) {
                                $this.closest('.job-applicant-wrapper').replaceWith(data.output);

                                $('.btn-create-meeting-job-applied').magnificPopup({
                                    mainClass: 'apus-mfp-zoom-in',
                                    type: 'inline',
                                    midClick: true,
                                    closeBtnInside: false,
                                });
                            }
                        }
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // show reject applicants
            $(document).on('click', '.show-rejected-applicants', function(e) {
                e.preventDefault();
                var $this = $(this),
                    $con = $this.closest('.job-applicants');

                if ($this.hasClass('active') || $this.hasClass('loading')) {
                    return false;
                }

                $this.addClass('loading');
                var job_id = $(this).data('job_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_show_rejected_applicants'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_show_rejected_applicants'
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $con.find('.applicants-wrapper').html(data.output);
                        $con.find('.show-total-applicants').removeClass('active');
                        $con.find('.show-approved-applicants').removeClass('active');
                        $this.addClass('active');

                        $('.btn-create-meeting-job-applied').magnificPopup({
                            mainClass: 'apus-mfp-zoom-in',
                            type: 'inline',
                            midClick: true,
                            closeBtnInside: false,
                        });
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // approve applicant
            $(document).on('click', '.btn-approve-job-applied', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.addClass('loading');
                var applicant_id = $(this).data('applicant_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_approve_applied'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'applicant_id': applicant_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_approve_applied',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        var total_app = parseInt($this.closest('.job-applicants').find('.approved-applicants span').text()) + 1;
                        $this.closest('.job-applicants').find('.approved-applicants span').text(total_app);

                        if (data.output) {
                            $this.closest('.job-applicant-wrapper').replaceWith(data.output);

                            $('.btn-create-meeting-job-applied').magnificPopup({
                                mainClass: 'apus-mfp-zoom-in',
                                type: 'inline',
                                midClick: true,
                                closeBtnInside: false,
                            });
                        }

                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // undo approved applicant
            $(document).on('click', '.btn-undo-approve-job-applied', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.addClass('loading');
                var applicant_id = $(this).data('applicant_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_undo_approve_applied'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'applicant_id': applicant_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_undo_approve_applied',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {

                        var total_approve = parseInt($this.closest('.job-applicants').find('.approved-applicants span').text()) - 1;
                        $this.closest('.job-applicants').find('.approved-applicants span').text(total_approve);

                        if ($this.closest('.job-applicants').find('.approved-applicants').hasClass('active')) {
                            $this.closest('.job-applied-wrapper').remove();
                            $this.closest('.job-applicant-wrapper').remove();
                        } else {
                            if (data.output) {
                                $this.closest('.job-applicant-wrapper').replaceWith(data.output);

                                $('.btn-create-meeting-job-applied').magnificPopup({
                                    mainClass: 'apus-mfp-zoom-in',
                                    type: 'inline',
                                    midClick: true,
                                    closeBtnInside: false,
                                });
                            }
                        }
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // show approved applicants
            $(document).on('click', '.show-approved-applicants', function(e) {
                e.preventDefault();
                var $this = $(this),
                    $con = $this.closest('.job-applicants');

                if ($this.hasClass('active') || $this.hasClass('loading')) {
                    return false;
                }

                $this.addClass('loading');
                var job_id = $(this).data('job_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_show_approved_applicants'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_show_approved_applicants'
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $con.find('.applicants-wrapper').html(data.output);
                        $con.find('.show-total-applicants').removeClass('active');
                        $con.find('.show-rejected-applicants').removeClass('active');
                        $this.addClass('active');

                        $('.btn-create-meeting-job-applied').magnificPopup({
                            mainClass: 'apus-mfp-zoom-in',
                            type: 'inline',
                            midClick: true,
                            closeBtnInside: false,
                        });
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // show applicants
            $(document).on('click', '.show-total-applicants', function(e) {
                e.preventDefault();
                var $this = $(this),
                    $con = $this.closest('.job-applicants');

                if ($this.hasClass('active') || $this.hasClass('loading')) {
                    return false;
                }
                $this.addClass('loading');
                var job_id = $(this).data('job_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_show_applicants'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_show_applicants'
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $con.find('.applicants-wrapper').html(data.output);
                        $con.find('.show-rejected-applicants').removeClass('active');
                        $con.find('.show-approved-applicants').removeClass('active');
                        $this.addClass('active');

                        $('.btn-create-meeting-job-applied').magnificPopup({
                            mainClass: 'apus-mfp-zoom-in',
                            type: 'inline',
                            midClick: true,
                            closeBtnInside: false,
                        });
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // pagination
            $(document).on('submit', 'form.applicants-pagination-form', function(e) {
                e.preventDefault();
                var $this = $(this);
                var $container = $(this).closest('.applicants-wrapper');
                if ($this.hasClass('loading')) {
                    return false;
                }
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_applicants_pagination'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize()
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $container.find('.applicants-inner').append(data.output);
                        if (data.paged > 0) {
                            $this.find('input[name=paged]').val(data.paged);
                        } else {
                            $this.remove();
                        }

                        $('.btn-create-meeting-job-applied').magnificPopup({
                            mainClass: 'apus-mfp-zoom-in',
                            type: 'inline',
                            midClick: true,
                            closeBtnInside: false,
                        });
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                });
                return false;
            });

        },
        applicationMeeting: function() {
            if ($('input.datetimepicker-date').length) {
                $("input.datetimepicker-date").each(function() {
                    $(this).datepicker({
                        dateFormat: $(this).data('date_format'),
                        altField: $(this).data('id'),
                        altFormat: 'yy-mm-dd'
                    });
                });
            }

            if ($.isFunction($.fn.select2) && typeof wp_freeio_select2_opts !== 'undefined') {
                var select2_args = wp_freeio_select2_opts;
                select2_args['allowClear'] = false;
                select2_args['minimumResultsForSearch'] = -1;
                select2_args['width'] = '100%';
                if (typeof wp_freeio_select2_opts.language_result !== 'undefined') {
                    select2_args['language'] = {
                        noResults: function(params) {
                            return wp_freeio_select2_opts['language_result'];
                        }
                    }
                }
                $('select.select-time-hour').select2(select2_args);
            }


            $('.btn-create-meeting-job-applied, .btn-messages-job-meeting, .btn-reschedule-job-meeting, .employer-meeting-zoom-settings').magnificPopup({
                mainClass: 'apus-mfp-zoom-in',
                type: 'inline',
                midClick: true,
                closeBtnInside: false,
            });

            $(document).on('click', '.close-popup', function() {
                $.magnificPopup.close()
            });

            $(document).on('submit', 'form.create-meeting-form', function(e) {
                e.preventDefault();
                var $this = $(this);

                if (self.createMeetingAjax) {
                    self.createMeetingAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }
                var form_id = $(this).attr('id');


                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                var action = $(this).find('input[name=action]').val();
                self.createMeetingAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', action),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');

                        setTimeout(function() {
                            $.magnificPopup.close();
                        }, 2000);

                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.createMeetingAjax = false;
                });

            });

            $(document).on('submit', 'form.reschedule-meeting-form', function(e) {
                e.preventDefault();
                var $this = $(this);

                if (self.rescheduleMeetingAjax) {
                    self.rescheduleMeetingAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }
                var form_id = $(this).attr('id');


                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                var action = $(this).find('input[name=action]').val();
                self.rescheduleMeetingAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', action),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        location.reload();
                        setTimeout(function() {
                            $.magnificPopup.close();
                        }, 2000);

                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.rescheduleMeetingAjax = false;
                });

            });

            $(document).on('click', '.btn-remove-job-meeting', function(e) {
                e.preventDefault();
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    var $this = $(this),
                        $con = $this.closest('.meetings-list-inner');

                    if ($this.hasClass('loading')) {
                        return false;
                    }
                    $this.addClass('loading');
                    var meeting_id = $(this).data('meeting_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_meeting'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'meeting_id': meeting_id,
                            'nonce': nonce
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            if ($con.find('.meeting-wrapper').length > 1) {
                                $this.closest('.meeting-wrapper').remove();
                            } else {
                                location.reload();
                            }
                        }
                        self.showMessage(data.msg, data.status);
                    });
                }
            });

            $(document).on('click', '.btn-cancel-job-meeting', function(e) {
                e.preventDefault();
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    var $this = $(this),
                        $con = $this.closest('.meetings-list-inner');

                    if ($this.hasClass('loading')) {
                        return false;
                    }
                    $this.addClass('loading');
                    var meeting_id = $(this).data('meeting_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_cancel_meeting'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'meeting_id': meeting_id,
                            'nonce': nonce
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            location.reload();
                        }
                        self.showMessage(data.msg, data.status);
                    });
                }
            });

            // zoom settings
            $(document).on('submit', 'form.zoom-meeting-settings-form', function(e) {
                e.preventDefault();

                var $this = $(this);

                if (self.zoomSettingAjax) {
                    self.zoomSettingAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }
                var form_id = $(this).attr('id');


                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                var action = $(this).find('input[name=action]').val();
                self.zoomSettingAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', action),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');

                    // if ( data.status ) {
                    $this.prepend('<div class="data">' + data.html + '</div>');

                    // setTimeout(function(){
                    //     $.magnificPopup.close();
                    // }, 2000);

                    // } else {
                    //     $this.prepend( '<div class="alert alert-warning">'+data.html+'</div>' );
                    // }

                    self.zoomSettingAjax = false;
                });
            });
        },

        jobFavorite: function() {
            var self = this;
            $(document).on('click', '.btn-add-job-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var job_id = $(this).data('job_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_add_job_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_add_job_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-add-job-favorite').addClass('btn-added-job-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_add_job_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // remove
            $(document).on('click', '.btn-added-job-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var job_id = $(this).data('job_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_job_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_job_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-added-job-favorite').addClass('btn-add-job-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_remove_job_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            $('.btn-remove-job-favorite').on('click', function() {
                var $this = $(this);
                $this.addClass('loading');
                var job_id = $(this).data('job_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_job_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'job_id': job_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_job_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.closest('.job-favorite-wrapper').remove();

                        $(document).trigger("after_remove_job_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });
        },
        serviceFavorite: function() {
            var self = this;
            $(document).on('click', '.btn-add-service-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var service_id = $(this).data('service_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_add_service_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'service_id': service_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_add_service_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-add-service-favorite').addClass('btn-added-service-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_add_service_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // remove
            $(document).on('click', '.btn-added-service-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var service_id = $(this).data('service_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_service_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'service_id': service_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_service_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-added-service-favorite').addClass('btn-add-service-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_remove_service_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            $('.btn-remove-service-favorite').on('click', function() {
                var $this = $(this);
                $this.addClass('loading');
                var service_id = $(this).data('service_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_service_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'service_id': service_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_service_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.closest('.service-favorite-wrapper').remove();

                        $(document).trigger("after_remove_service_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });
        },
        projectFavorite: function() {
            var self = this;
            $(document).on('click', '.btn-add-project-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var project_id = $(this).data('project_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_add_project_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'project_id': project_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_add_project_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-add-project-favorite').addClass('btn-added-project-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_add_project_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // remove
            $(document).on('click', '.btn-added-project-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var project_id = $(this).data('project_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_project_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'project_id': project_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_project_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-added-project-favorite').addClass('btn-add-project-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_remove_project_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            $('.btn-remove-project-favorite').on('click', function() {
                var $this = $(this);
                $this.addClass('loading');
                var project_id = $(this).data('project_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_project_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'project_id': project_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_project_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.closest('.project-favorite-wrapper').remove();

                        $(document).trigger("after_remove_project_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });
        },
        employerFavorite: function() {
            var self = this;
            $(document).on('click', '.btn-add-employer-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var employer_id = $(this).data('employer_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_add_employer_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'employer_id': employer_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_add_employer_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-add-employer-favorite').addClass('btn-added-employer-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_add_employer_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // remove
            $(document).on('click', '.btn-added-employer-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var employer_id = $(this).data('employer_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_employer_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'employer_id': employer_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_employer_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-added-employer-favorite').addClass('btn-add-employer-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_remove_employer_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            $('.btn-remove-employer-favorite').on('click', function() {
                var $this = $(this);
                $this.addClass('loading');
                var employer_id = $(this).data('employer_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_employer_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'employer_id': employer_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_employer_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.closest('.employer-favorite-wrapper').remove();

                        $(document).trigger("after_remove_employer_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });
        },
        freelancerFavorite: function() {
            var self = this;
            $(document).on('click', '.btn-add-freelancer-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var freelancer_id = $(this).data('freelancer_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_add_freelancer_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'freelancer_id': freelancer_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_add_freelancer_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-add-freelancer-favorite').addClass('btn-added-freelancer-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_add_freelancer_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            // remove
            $(document).on('click', '.btn-added-freelancer-favorite', function() {
                var $this = $(this);
                $this.addClass('loading');
                var freelancer_id = $(this).data('freelancer_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_freelancer_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'freelancer_id': freelancer_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_freelancer_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.removeClass('btn-added-freelancer-favorite').addClass('btn-add-freelancer-favorite');
                        $this.data('nonce', data.nonce);

                        $(document).trigger("after_remove_freelancer_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });

            $('.btn-remove-freelancer-favorite').on('click', function() {
                var $this = $(this);
                $this.addClass('loading');
                var freelancer_id = $(this).data('freelancer_id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_freelancer_favorite'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'freelancer_id': freelancer_id,
                        'nonce': nonce,
                        'action': 'wp_freeio_ajax_remove_freelancer_favorite',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.closest('.freelancer-favorite-wrapper').remove();

                        $(document).trigger("after_remove_freelancer_favorite", [$this, data]);
                    }
                    self.showMessage(data.msg, data.status);
                });
            });
        },
        servicePrice: function() {
            var self = this;

            $(document).on('submit', 'form.submit-service-addon-form', function() {
                var $this = $(this);

                if (self.registerAjax) {
                    self.registerAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $this.attr('id');

                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.registerAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_submit_service_addon'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        self.showMessage(data.msg, data.status);
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                    self.registerAjax = false;
                });

                return false;
            });

            $(document).on('change', 'form.service-add-to-cart .service-price-addons .addon-item input', function() {
                var $this = $(this);

                if (self.registerAjax) {
                    self.registerAjax.abort();
                }

                var form_container = $(this).closest('form.service-add-to-cart');
                var form_id = form_container.attr('id');

                if (form_container.hasClass('loading')) {
                    return false;
                }

                form_container.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.registerAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_change_service_addon'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    form_container.removeClass('loading');
                    if (data.status) {
                        form_container.find('.service-price-inner').html(data.price);
                        form_container.find('button span').html(data.price_without_html);
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                    self.registerAjax = false;
                });

                return false;
            });

            $(document).on('submit', 'form.service-add-to-cart', function() {
                var $this = $(this);

                if (self.registerAjax) {
                    self.registerAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $this.attr('id');

                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.registerAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_hire_service'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        self.showMessage(data.msg, data.status);
                        window.location.href = data.checkout_url;
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                    self.registerAjax = false;
                });

                return false;
            });

            $(document).on('submit', 'form.service-order-message-form', function() {
                var $this = $(this);

                if (self.applyEmailAjax) {
                    self.applyEmailAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $(this).attr('id');
                var error = false;


                var attachments = $this.find('input[name="attachments"]');
                if (attachments.length > 0 && attachments.val() != '') {
                    attachments = attachments.prop('files')[0];

                    var file_size = attachments.size;
                    var file_type = attachments.type;

                    var allowed_types = wp_freeio_opts.cv_file_types;
                    var filesize_allow = wp_freeio_opts.cv_file_size_allow;
                    filesize_allow = parseInt(filesize_allow);

                    if (file_size > filesize_allow) {
                        alert(wp_freeio_opts.cv_file_size_error);
                        error = true;
                    }
                    if (allowed_types.indexOf(file_type) < 0) {
                        alert(wp_freeio_opts.cv_file_types_error);
                        error = true;
                    }
                }

                if (error == false) {
                    $this.find('.alert').remove();

                    $this.addClass('loading');
                    var form_data = new FormData($('#' + form_id)[0]);

                    self.applyEmailAjax = $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_send_service_order_message'),
                        type: 'POST',
                        dataType: 'json',
                        data: form_data,
                        processData: false,
                        contentType: false,
                    }).done(function(data) {
                        $this.removeClass('loading');

                        if (data.status) {
                            if (data.html) {
                                $('.messages-list').html(data.html);
                                $(".list-replies").scrollTop($(".list-replies").prop("scrollHeight"));

                                $this.trigger("reset");
                            }
                        }
                        self.showMessage(data.msg, data.status);

                        self.applyEmailAjax = false;
                    });
                } else {
                    alert(wp_freeio_opts.choose_a_cv);
                }
                return false;
            });

            $('.update-service-order-status').on('click', function() {
                var $this = $(this);

                $this.addClass('loading');
                var service_order_id = $(this).data('service_order_id');
                var nonce = $(this).data('nonce');
                var status = $('#service_order_status').val();
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_change_service_order_status'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'service_order_id': service_order_id,
                        'nonce': nonce,
                        'status': status
                    }
                }).done(function(data) {
                    $this.removeClass('loading');

                    $(document).trigger("after_change_service_order_status", [$this, data]);

                    self.showMessage(data.msg, data.status);
                });
            });
        },
        projectProposal: function() {
            var self = this;

            $(document).on('submit', 'form.project-proposal-form', function() {
                var $this = $(this);

                if (self.registerAjax) {
                    self.registerAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $this.attr('id');

                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.registerAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_project_proposal'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        self.showMessage(data.msg, data.status);
                        if (data.edit) {
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            if (data.html) {
                                $('.project-detail-proposals').html(data.html);
                            }
                        }
                    } else {
                        self.showMessage(data.msg, data.status);
                    }
                    self.registerAjax = false;
                });

                return false;
            });

            // hire
            $('.proposal-button-hire-now').on('click', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var proposal_id = $(this).data('proposal_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_hire_proposal'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'proposal_id': proposal_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_hire_proposal',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');

                        self.showMessage(data.msg, data.status);
                        if (data.status) {
                            window.location.href = data.checkout_url;
                        }

                        $(document).trigger("after_hire_project_proposal", [$this, data]);

                        self.showMessage(data.msg, data.status);
                    });
                }
            });

            if ($(".messages-list .list-replies")) {
                $(".messages-list .list-replies").scrollTop($(".messages-list .list-replies").prop("scrollHeight"));
            }
            $(document).on('submit', 'form.proposal-message-form', function() {
                var $this = $(this);

                if (self.applyEmailAjax) {
                    self.applyEmailAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $(this).attr('id');
                var error = false;


                var attachments = $this.find('input[name="attachments"]');
                if (attachments.length > 0 && attachments.val() != '') {
                    attachments = attachments.prop('files')[0];

                    var file_size = attachments.size;
                    var file_type = attachments.type;

                    var allowed_types = wp_freeio_opts.cv_file_types;
                    var filesize_allow = wp_freeio_opts.cv_file_size_allow;
                    filesize_allow = parseInt(filesize_allow);

                    if (file_size > filesize_allow) {
                        alert(wp_freeio_opts.cv_file_size_error);
                        error = true;
                    }
                    if (allowed_types.indexOf(file_type) < 0) {
                        alert(wp_freeio_opts.cv_file_types_error);
                        error = true;
                    }
                }

                if (error == false) {
                    $this.find('.alert').remove();

                    $this.addClass('loading');
                    var form_data = new FormData($('#' + form_id)[0]);

                    self.applyEmailAjax = $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_send_proposal_message'),
                        type: 'POST',
                        dataType: 'json',
                        data: form_data,
                        processData: false,
                        contentType: false,
                    }).done(function(data) {
                        $this.removeClass('loading');

                        if (data.status) {
                            if (data.html) {
                                $('.messages-list').html(data.html);

                                $(".list-replies").scrollTop($(".list-replies").prop("scrollHeight"));

                                $this.trigger("reset");
                            }
                        }
                        self.showMessage(data.msg, data.status);

                        self.applyEmailAjax = false;
                    });
                } else {
                    alert(wp_freeio_opts.choose_a_cv);
                }
                return false;
            });

            $('.update-proposal-status').on('click', function() {
                var $this = $(this);

                $this.addClass('loading');
                var proposal_id = $(this).data('proposal_id');
                var nonce = $(this).data('nonce');
                var status = $('#proposal_status').val();
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_change_proposal_status'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'proposal_id': proposal_id,
                        'nonce': nonce,
                        'status': status
                    }
                }).done(function(data) {
                    $this.removeClass('loading');

                    $(document).trigger("after_change_proposal_status", [$this, data]);

                    self.showMessage(data.msg, data.status);
                });
            });
        },
        reviewInit: function() {
            var self = this;
            if ($('.comment-form-rating').length > 0) {
                var $star = $('.comment-form-rating .filled');
                var $review = $('#_input_rating');
                $star.find('li').on('mouseover', function() {
                    $(this).nextAll().addClass('active');
                    $(this).prevAll().removeClass('active');
                    $(this).removeClass('active');
                });
                $star.on('mouseout', function() {
                    var current = $review.val() - 1;
                    var current_e = $star.find('li').eq(current);

                    current_e.nextAll().addClass('active');
                    current_e.prevAll().removeClass('active');
                    current_e.removeClass('active');
                });
                $star.find('li').on('click', function() {
                    $(this).nextAll().addClass('active');
                    $(this).prevAll().removeClass('active');
                    $(this).removeClass('active');

                    $review.val($(this).index() + 1);
                });
            }
        },
        jobAlert: function() {
            var self = this;
            $(document).on('click', '.btn-job-alert', function() {
                var form_html = $('.job-alert-form-wrapper').html();
                $.magnificPopup.open({
                    mainClass: 'wp-freeio-mfp-container',
                    items: {
                        src: form_html,
                        type: 'inline'
                    }
                });
            });
            $(document).on('submit', 'form.job-alert-form', function() {
                var $this = $(this);
                $this.addClass('loading');
                $this.find('.alert').remove();
                var url_vars = self.getUrlVars();
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_add_job_alert'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize() + '&action=wp_freeio_ajax_add_job_alert' + url_vars
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            $.magnificPopup.close();
                        }, 1500);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }
                });

                return false;
            });

            // Remove job alert
            $(document).on('click', '.btn-remove-job-alert', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var alert_id = $(this).data('alert_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_job_alert'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'alert_id': alert_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_remove_job_alert',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.job-alert-wrapper').remove();
                        }
                        self.showMessage(data.msg, data.status);
                    });
                }
            });
        },
        freelancerAlert: function() {
            var self = this;
            $(document).on('click', '.btn-freelancer-alert', function() {
                var form_html = $('.freelancer-alert-form-wrapper').html();
                $.magnificPopup.open({
                    mainClass: 'wp-freeio-mfp-container',
                    items: {
                        src: form_html,
                        type: 'inline'
                    }
                });
            });
            $(document).on('submit', 'form.freelancer-alert-form', function() {
                var $this = $(this);
                $this.addClass('loading');
                var url_vars = self.getUrlVars();
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_add_freelancer_alert'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize() + '&action=wp_freeio_ajax_add_freelancer_alert' + url_vars
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            $.magnificPopup.close();
                        }, 1500);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }
                });

                return false;
            });

            // Remove freelancer alert
            $(document).on('click', '.btn-remove-freelancer-alert', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var alert_id = $(this).data('alert_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_freelancer_alert'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'alert_id': alert_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_remove_freelancer_alert',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('.freelancer-alert-wrapper').remove();
                        }
                        self.showMessage(data.msg, data.status);
                    });
                }
            });
        },
        getUrlVars: function() {
            var self = this;
            var vars = '';
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                vars += '&' + hashes[i];
            }
            return vars;
        },
        jobSocialApply: function() {
            var self = this;
            $('.facebook-apply-btn').on('click', function() {
                var job_id = $(this).data('job_id');
                var facebook_login_url = $(this).attr('href');
                self.setCookie('wp_freeio_facebook_job_id', job_id, 1);
                window.location.href = facebook_login_url;
            });

            // google
            $('.google-apply-btn').on('click', function() {
                var job_id = $(this).data('job_id');
                var google_login_url = $(this).attr('href');
                self.setCookie('wp_freeio_google_job_id', job_id, 1);
                window.location.href = google_login_url;
            });

            // linkedin
            $('.linkedin-apply-btn').on('click', function() {
                var job_id = $(this).data('job_id');
                var linkedin_login_url = $(this).attr('href');
                self.setCookie('wp_freeio_linkedin_job_id', job_id, 1);
                window.location.href = linkedin_login_url;
            });

            // twitter
            $('.twitter-apply-btn').on('click', function() {
                var job_id = $(this).data('job_id');
                var twitter_login_url = $(this).attr('href');
                self.setCookie('wp_freeio_twitter_job_id', job_id, 1);
                window.location.href = twitter_login_url;
            });
        },
        select2Init: function() {
            var self = this;
            if ($.isFunction($.fn.select2) && typeof wp_freeio_select2_opts !== 'undefined') {
                var select2_args = wp_freeio_select2_opts;
                select2_args['allowClear'] = false;
                select2_args['minimumResultsForSearch'] = 10;
                select2_args['width'] = 'auto';
                if (typeof wp_freeio_select2_opts.language_result !== 'undefined') {
                    select2_args['language'] = {
                        noResults: function(params) {
                            return wp_freeio_select2_opts['language_result'];
                        }
                    }
                }
                if ($('.woocommerce-ordering select.orderby').length) {
                    var woo_select2_args = select2_args;
                    woo_select2_args.theme = 'default orderby';
                    $('.woocommerce-ordering select.orderby').select2(woo_select2_args);
                }
                $('select.orderby').select2(select2_args);
                $('select.job_id').select2(select2_args);
            }
        },
        jobSubmission: function() {
            var self = this;
            // select2
            if ($.isFunction($.fn.select2) && typeof wp_freeio_select2_opts !== 'undefined') {
                var select2_args = wp_freeio_select2_opts;
                select2_args['allowClear'] = false;
                if (typeof wp_freeio_select2_opts.language_result !== 'undefined') {
                    select2_args['language'] = {
                        noResults: function(params) {
                            return select2_args['language_result'];
                        }
                    }
                }
                select2_args['minimumResultsForSearch'] = 10;

                $('select.cmb2_select').select2(select2_args);
            }

            $('.cmb-repeatable-group').on('cmb2_add_group_row_start', function(event, instance) {
                var $table = $(document.getElementById($(instance).data('selector')));
                var $oldRow = $table.find('.cmb-repeatable-grouping').last();

                $oldRow.find('select.cmb2_select').each(function() {
                    $(this).select2('destroy');
                });
            });

            $('.cmb-repeatable-group').on('cmb2_add_row', function(event, newRow) {
                $(newRow).find('select.cmb2_select').each(function() {
                    $('option:selected', this).removeAttr("selected");
                    $(this).select2(select2_args);
                });

                // Reinitialise the field we previously destroyed
                $(newRow).prev().find('select.cmb2_select').each(function() {
                    $(this).select2(select2_args);
                });
            });

            ///
            $('.cmb-add-row-button').on('click', function(event) {
                var $table = $(document.getElementById($(event.target).data('selector')));
                var $oldRow = $table.find('.cmb-row').last();

                $oldRow.find('select.cmb2_select').each(function() {
                    $(this).select2('destroy');
                });
            });

            $('.cmb-repeat-table').on('cmb2_add_row', function(event, newRow) {
                // Reinitialise the field we previously destroyed
                $(newRow).prev().find('select.cmb2_select').each(function() {
                    $('option:selected', this).removeAttr("selected");
                    $(this).select2(select2_args);
                });
            });

            //
            var apply_type = $('#_job_apply_type').val();
            if (apply_type == 'internal') {
                $('.cmb2-id--job-apply-url').hide();
                $('.cmb2-id--job-apply-email').hide();
                $('.cmb2-id--job-phone').hide();
            } else if (apply_type == 'external') {
                $('.cmb2-id--job-apply-url').show();
                $('.cmb2-id--job-apply-email').hide();
                $('.cmb2-id--job-phone').hide();
            } else if (apply_type == 'with_email') {
                $('.cmb2-id--job-apply-url').hide();
                $('.cmb2-id--job-phone').hide();
                $('.cmb2-id--job-apply-email').show();
            } else if (apply_type == 'call') {
                $('.cmb2-id--job-apply-url').hide();
                $('.cmb2-id--job-apply-email').hide();
                $('.cmb2-id--job-phone').show();
            }
            $('#_job_apply_type').change(function() {
                var apply_type = $(this).val();
                if (apply_type == 'internal') {
                    $('.cmb2-id--job-apply-url').hide();
                    $('.cmb2-id--job-apply-email').hide();
                    $('.cmb2-id--job-phone').hide();
                } else if (apply_type == 'external') {
                    $('.cmb2-id--job-apply-url').show();
                    $('.cmb2-id--job-apply-email').hide();
                    $('.cmb2-id--job-phone').hide();
                } else if (apply_type == 'with_email') {
                    $('.cmb2-id--job-apply-url').hide();
                    $('.cmb2-id--job-phone').hide();
                    $('.cmb2-id--job-apply-email').show();
                } else if (apply_type == 'call') {
                    $('.cmb2-id--job-apply-url').hide();
                    $('.cmb2-id--job-apply-email').hide();
                    $('.cmb2-id--job-phone').show();
                }
            });
            var price_type = $('#_service_price_type').val();
            if (price_type == 'package') {
                $('.cmb-row.cmb2-id--service-price').hide();
                $('.cmb-row.cmb2-id--service-price-packages').show();
            } else {
                $('.cmb-row.cmb2-id--service-price').show();
                $('.cmb-row.cmb2-id--service-price-packages').hide();
            }
            $('#_service_price_type').change(function() {
                var price_type = $(this).val();
                if (price_type == 'package') {
                    $('.cmb-row.cmb2-id--service-price').hide();
                    $('.cmb-row.cmb2-id--service-price-packages').show();
                } else {
                    $('.cmb-row.cmb2-id--service-price').show();
                    $('.cmb-row.cmb2-id--service-price-packages').hide();
                }
            });
        },
        filterListing: function() {
            var self = this;

            $(document).on('click', 'form .toggle-field .heading-label', function() {
                var container = $(this).closest('.form-group');
                container.find('.form-group-inner').slideToggle();
                if (container.hasClass('hide-content')) {
                    container.removeClass('hide-content');
                } else {
                    container.addClass('hide-content');
                }
            });
            $(document).on('click', '.toggle-filter-list', function() {
                var $this = $(this);
                var container = $(this).closest('.form-group');
                container.find('.terms-list .more-fields').each(function() {
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        $this.find('.text').text(wp_freeio_opts.show_more);
                    } else {
                        $(this).addClass('active');
                        $this.find('.text').text(wp_freeio_opts.show_less);
                    }
                });
            });

            if ($.isFunction($.fn.slider)) {
                $('.search-distance-slider').each(function() {
                    var $this = $(this);
                    var search_distance = $this.closest('.search-distance-wrapper').find('input[name^=filter-distance]');
                    var search_wrap = $this.closest('.search_distance_wrapper');
                    $(this).slider({
                        range: "min",
                        value: search_distance.val(),
                        min: 0,
                        max: 100,
                        slide: function(event, ui) {
                            search_distance.val(ui.value);
                            $('.text-distance', search_wrap).text(ui.value);
                            $('.distance-custom-handle', $this).attr("data-value", ui.value);
                            search_distance.trigger('change');
                        },
                        create: function() {
                            $('.distance-custom-handle', $this).attr("data-value", $(this).slider("value"));
                        }
                    });
                });

                $('.main-range-slider').each(function() {
                    var $this = $(this);
                    $this.slider({
                        range: true,
                        min: $this.data('min'),
                        max: $this.data('max'),
                        values: [$this.parent().find('.filter-from').val(), $this.parent().find('.filter-to').val()],
                        slide: function(event, ui) {
                            $this.parent().find('.from-text').text(ui.values[0]);
                            $this.parent().find('.filter-from').val(ui.values[0])
                            $this.parent().find('.to-text').text(ui.values[1]);
                            $this.parent().find('.filter-to').val(ui.values[1]);
                            $this.parent().find('.filter-to').trigger('change');
                        }
                    });
                });

                $('.salary-range-slider').each(function() {
                    var $this = $(this);
                    $this.slider({
                        range: true,
                        min: $this.data('min'),
                        max: $this.data('max'),
                        values: [$this.parent().find('.filter-from').val(), $this.parent().find('.filter-to').val()],
                        slide: function(event, ui) {
                            $this.parent().find('.from-text .price-text').text(self.addCommas(ui.values[0]));
                            $this.parent().find('.filter-from').val(ui.values[0])
                            $this.parent().find('.to-text .price-text').text(self.addCommas(ui.values[1]));
                            $this.parent().find('.filter-to').val(ui.values[1]);
                            $this.parent().find('.filter-to').trigger('change');
                        }
                    });
                });
            }

            $('.find-me').on('click', function() {
                $(this).addClass('loading');
                var this_e = $(this);
                var container = $(this).closest('.form-group');

                navigator.geolocation.getCurrentPosition(function(position) {
                    container.find('input[name="filter-center-latitude"]').val(position.coords.latitude);
                    container.find('input[name="filter-center-longitude"]').val(position.coords.longitude);
                    container.find('input[name="filter-center-location"]').val('Location');
                    container.find('.clear-location').removeClass('hidden');
                    container.find('.leaflet-geocode-container').html('').removeClass('active');
                    var position = [position.coords.latitude, position.coords.longitude];

                    if (typeof L.esri.Geocoding.geocodeService != 'undefined') {

                        var geocodeService = L.esri.Geocoding.geocodeService();
                        geocodeService.reverse().latlng(position).run(function(error, result) {
                            container.find('input[name="filter-center-location"]').val(result.address.Match_addr);
                        });
                    }

                    return this_e.removeClass('loading');
                }, function(e) {
                    return this_e.removeClass('loading');
                }, {
                    enableHighAccuracy: true
                });
            });

            $('.clear-location').on('click', function() {
                var container = $(this).closest('.form-group');

                container.find('input[name="filter-center-latitude"]').val('');
                container.find('input[name="filter-center-longitude"]').val('');
                container.find('input[name="filter-center-location"]').val('').trigger('keyup');
                container.find('.clear-location').addClass('hidden');
            });
            $('input[name="filter-center-location"]').on('keyup', function() {
                var container = $(this).closest('.form-group');
                var val = $(this).val();
                if ($(this).val() !== '') {
                    container.find('.clear-location').removeClass('hidden');
                } else {
                    container.find('.clear-location').removeClass('hidden').addClass('hidden');
                }
            });

            // search autocomplete location
            if (wp_freeio_opts.map_service == 'google-map') {
                if (typeof google === 'object' && typeof google.maps === 'object') {
                    function search_location_initialize() {

                        $('input[name="filter-center-location"]').each(function() {
                            var $id = $(this).attr('id');

                            if (typeof $id !== 'undefined') {
                                var container = $('#' + $id).closest('.form-group-inner');
                                var input = document.getElementById($id);
                                var autocomplete = new google.maps.places.Autocomplete(input);
                                autocomplete.setTypes([]);

                                if (wp_freeio_opts.geocoder_country) {
                                    autocomplete.setComponentRestrictions({
                                        country: [wp_freeio_opts.geocoder_country],
                                    });
                                }

                                autocomplete.addListener('place_changed', function() {
                                    var place = autocomplete.getPlace();
                                    place.toString();

                                    if (!place.geometry) {
                                        window.alert("No details available for input: '" + place.name + "'");
                                        return;
                                    }

                                    container.find('input[name=filter-center-latitude]').val(place.geometry.location.lat());
                                    container.find('input[name=filter-center-longitude]').val(place.geometry.location.lng());

                                });
                            }
                        });
                    }
                    google.maps.event.addDomListener(window, 'load', search_location_initialize);
                }
            } else {
                if (typeof L.Control.Geocoder.Nominatim != 'undefined') {
                    if (wp_freeio_opts.geocoder_country) {
                        var geocoder = new L.Control.Geocoder.Nominatim({
                            geocodingQueryParams: {
                                countrycodes: wp_freeio_opts.geocoder_country,
                                lang: wp_freeio_opts.geocoder_country
                            }
                        });
                    } else {
                        var geocoder = new L.Control.Geocoder.Nominatim();
                    }

                    function delay(fn, ms) {
                        let timer = 0
                        return function(...args) {
                            clearTimeout(timer)
                            timer = setTimeout(fn.bind(this, ...args), ms || 0)
                        }
                    }

                    $("input[name=filter-center-location]").attr('autocomplete', 'off').after('<div class="leaflet-geocode-container"></div>');
                    $("input[name=filter-center-location]").on("keyup", delay(function(e) {
                        var s = $(this).val(),
                            $this = $(this),
                            container = $(this).closest('.form-group-inner');
                        if (s && s.length >= 3) {

                            $this.parent().addClass('loading');
                            geocoder.geocode(s, function(results) {
                                var output_html = '';
                                for (var i = 0; i < results.length; i++) {
                                    output_html += '<li class="result-item" data-latitude="' + results[i].center.lat + '" data-longitude="' + results[i].center.lng + '" ><i class="fa fa-map-marker" aria-hidden="true"></i> ' + results[i].name + '</li>';
                                }
                                if (output_html) {
                                    output_html = '<ul>' + output_html + '</ul>';
                                }

                                container.find('.leaflet-geocode-container').html(output_html).addClass('active');

                                var highlight_texts = s.split(' ');

                                highlight_texts.forEach(function(item) {
                                    container.find('.leaflet-geocode-container').highlight(item);
                                });

                                $this.parent().removeClass('loading');
                            });
                        } else {
                            container.find('.leaflet-geocode-container').html('').removeClass('active');
                        }
                    }, 500));
                    $('.form-group-inner').on('click', '.leaflet-geocode-container ul li', function() {
                        var container = $(this).closest('.form-group-inner');
                        container.find('input[name=filter-center-latitude]').val($(this).data('latitude'));
                        container.find('input[name=filter-center-longitude]').val($(this).data('longitude'));
                        container.find('input[name=filter-center-location]').val($(this).text());
                        container.find('.leaflet-geocode-container').removeClass('active').html('');
                    });
                }
            }

        },
        employerAddEmployee: function() {
            var self = this;

            // add
            $(document).on('submit', 'form.employer-add-employees-form', function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('loading')) {
                    return false;
                }
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_employer_add_employee'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize() + '&action=wp_freeio_ajax_employer_add_employee'
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $('.employer-employees-list-inner').prepend(data.html);
                        if ($('.employer-employees-list-inner .not-found').length) {
                            $('.employer-employees-list-inner .not-found').remove();
                        }
                        $this.find('.team-employee-inner').remove();
                    }
                    self.showMessage(data.msg, data.status);
                });
                return false;
            });
            // remove
            $(document).on('click', '.btn-employer-remove-employee', function() {
                var $this = $(this);
                var r = confirm(wp_freeio_opts.rm_item_txt);
                if (r == true) {
                    $this.addClass('loading');
                    var employee_id = $(this).data('employee_id');
                    var nonce = $(this).data('nonce');
                    $.ajax({
                        url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_employer_remove_employee'),
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            'employee_id': employee_id,
                            'nonce': nonce,
                            'action': 'wp_freeio_ajax_employer_remove_employee',
                        }
                    }).done(function(data) {
                        $this.removeClass('loading');
                        if (data.status) {
                            $this.closest('article.employee-team-wrapper').remove();
                        }
                        self.showMessage(data.msg, data.status);
                    });
                }
            });
        },
        inviteFreelancer: function() {
            var self = this;

            $(document).on('click', '.cannot-download-cv-btn', function() {
                var msg = $(this).data('msg');
                self.showMessage(msg, false);
            });
            $('.btn-invite-freelancer:not(.cannot-download-cv-btn)').magnificPopup({
                mainClass: 'apus-mfp-zoom-in',
                type: 'inline',
                midClick: true
            });

            // add
            $(document).on('submit', 'form.invite-freelancer-form', function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('loading')) {
                    return false;
                }
                if (self.inviteAjax) {
                    self.inviteAjax.abort();
                }

                $this.find('.alert').remove();
                $this.addClass('loading');
                self.inviteAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_invite_freelancer'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize()
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.inviteAjax = false;
                });
                return false;
            });
        },
        statementPayout: function() {
            var self = this;

            $(document).on('submit', 'form.payouts-withdraw-settings-form', function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('loading')) {
                    return false;
                }
                if (self.inviteAjax) {
                    self.inviteAjax.abort();
                }

                $this.find('.alert').remove();
                $this.addClass('loading');
                self.inviteAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_save_withdraw_settings'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize()
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.inviteAjax = false;
                });
                return false;
            });

            $(document).on('submit', 'form.withdraw-form', function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('loading')) {
                    return false;
                }
                if (self.inviteAjax) {
                    self.inviteAjax.abort();
                }

                $this.find('.alert').remove();
                $this.addClass('loading');
                self.inviteAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_save_withdraw'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize()
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            window.location.reload(true);
                        }, 2000);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.inviteAjax = false;
                });
                return false;
            });
        },
        dispute: function() {
            var self = this;
            $(document).on('submit', 'form.create-dispute-form', function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('loading')) {
                    return false;
                }
                if (self.disputeAjax) {
                    self.disputeAjax.abort();
                }

                $this.find('.alert').remove();
                $this.addClass('loading');
                self.disputeAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_save_dispute'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize()
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            window.location.reload(true);
                        }, 2000);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.disputeAjax = false;
                });
                return false;
            });

            $(document).on('submit', 'form.dispute-message-form', function() {
                var $this = $(this);

                if (self.disputeMessageAjax) {
                    self.disputeMessageAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $(this).attr('id');

                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.disputeMessageAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_send_dispute_message'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        if (data.html) {
                            $('.messages-list').html(data.html);

                            $(".list-replies").scrollTop($(".list-replies").prop("scrollHeight"));

                            $this.trigger("reset");
                        }
                    }
                    self.showMessage(data.msg, data.status);

                    self.disputeMessageAjax = false;
                });

                return false;
            });
        },
        mixesFn: function() {
            var self = this;

            $('.my-jobs-ordering').on('change', 'select.orderby', function() {
                $(this).closest('form').submit();
            });

            $('.contact-form-wrapper').on('submit', function() {
                var $this = $(this);
                $this.find('.alert').remove();
                $this.addClass('loading');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_contact_form'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize() + '&action=wp_freeio_ajax_contact_form'
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }
                });

                return false;
            });

            $(document).on('submit', 'form.delete-profile-form', function() {
                var $this = $(this);
                $this.addClass('loading');
                $(this).find('.alert').remove();
                $.ajax({
                    url: wp_freeio_opts.ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize() + '&action=wp_freeio_ajax_delete_profile'
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        window.location.href = wp_freeio_opts.home_url;
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }
                });

                return false;
            });

            $('.cannot-download-cv-btn').on('click', function(e) {
                e.preventDefault();
                self.showMessage($(this).data('msg'), false);
            });

            // Location Change
            $('body').on('change', 'select.select-field-region', function() {
                var val = $(this).val();
                var next = $(this).data('next');
                var main_select = 'select.select-field-region' + next;
                if ($(main_select).length > 0) {

                    var select2_args = wp_freeio_select2_opts;
                    select2_args['allowClear'] = true;
                    select2_args['minimumResultsForSearch'] = 10;
                    select2_args['width'] = '100%';

                    if (typeof wp_freeio_select2_opts.language_result !== 'undefined') {
                        select2_args['language'] = {
                            noResults: function() {
                                return wp_freeio_select2_opts.language_result;
                            }
                        };
                    }

                    $(main_select).prop('disabled', true);
                    $(main_select).val('').trigger('change');

                    if (val) {
                        $(main_select).parent().addClass('loading');
                        $.ajax({
                            url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wpjb_process_change_location'),
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                'action': 'wpjb_process_change_location',
                                'parent': val,
                                'taxonomy': $(main_select).data('taxonomy'),
                                'security': wp_freeio_opts.ajax_nonce,
                            }
                        }).done(function(data) {
                            $(main_select).parent().removeClass('loading');

                            $(main_select).find('option').remove();
                            if (data) {
                                $.each(data, function(i, item) {
                                    var option = new Option(item.name, item.id, true, true);
                                    $(main_select).append(option);
                                });
                            }
                            $(main_select).prop("disabled", false);
                            $(main_select).val(null).select2("destroy").select2(select2_args);
                        });
                    } else {
                        $(main_select).find('option').remove();
                        $(main_select).prop("disabled", false);
                        $(main_select).val(null).select2("destroy").select2(select2_args);
                    }
                }
            });

            // remove notify
            $('.notifications-wrapper').on('click', '.remove-notify-btn', function(e) {
                e.stopPropagation();
                var $this = $(this);

                $this.addClass('loading');
                var unique_id = $(this).data('id');
                var nonce = $(this).data('nonce');
                $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_remove_notify'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        'unique_id': unique_id,
                        'nonce': nonce,
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        if ($this.closest('ul').find('li').length > 1) {
                            $this.closest('li').remove();
                        } else {
                            window.location.reload(true);
                        }
                    }
                    self.showMessage(data.msg, data.status);
                });

            });

            // currencies
            $('body').on('change', '.jobs-currencies input', function() {
                $(this).closest('form').trigger('submit');
            });

            // Report
            $(document).on('submit', 'form.report-form-wrapper', function(e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.hasClass('loading')) {
                    return false;
                }
                if (self.reportAjax) {
                    self.reportAjax.abort();
                }

                $this.find('.alert').remove();
                $this.addClass('loading');
                self.reportAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_report_form'),
                    type: 'POST',
                    dataType: 'json',
                    data: $this.serialize()
                }).done(function(data) {
                    $this.removeClass('loading');

                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.reportAjax = false;
                });
                return false;
            });

            // Verify
            $(document).on('submit', 'form.verification-identity-form', function() {
                var $this = $(this);

                if (self.verifyAjax) {
                    self.verifyAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                var form_id = $(this).attr('id');


                $this.find('.alert').remove();

                $this.addClass('loading');
                var form_data = new FormData($('#' + form_id)[0]);

                self.verifyAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_verification_identity'),
                    type: 'POST',
                    dataType: 'json',
                    data: form_data,
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            window.location.reload(true);
                        }, 500);
                    } else {
                        $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.verifyAjax = false;
                });

                return false;
            });

            // revoke rerify
            $(document).on('click', '.revoke-verification', function() {
                var $this = $(this);

                if (self.verifyAjax) {
                    self.verifyAjax.abort();
                }

                if ($this.hasClass('loading')) {
                    return false;
                }

                $this.parent().find('.alert').remove();

                $this.addClass('loading');
                self.verifyAjax = $.ajax({
                    url: wp_freeio_opts.ajaxurl_endpoint.toString().replace('%%endpoint%%', 'wp_freeio_ajax_revoke_verification_identity'),
                    type: 'POST',
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                }).done(function(data) {
                    $this.removeClass('loading');
                    if (data.status) {
                        $this.parent().prepend('<div class="alert alert-info">' + data.msg + '</div>');
                        setTimeout(function() {
                            window.location.reload(true);
                        }, 500);
                    } else {
                        $this.parent().prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                    }

                    self.verifyAjax = false;
                });

                return false;
            });
        },
        addCommas: function(str) {
            var parts = (str + "").split("."),
                main = parts[0],
                len = main.length,
                output = "",
                first = main.charAt(0),
                i;

            if (first === '-') {
                main = main.slice(1);
                len = main.length;
            } else {
                first = "";
            }
            i = len - 1;
            while (i >= 0) {
                output = main.charAt(i) + output;
                if ((len - i) % 3 === 0 && i > 0) {
                    output = wp_freeio_opts.money_thousands_separator + output;
                }
                --i;
            }
            // put sign back
            output = first + output;
            // put decimal part back
            if (parts.length > 1) {
                output += wp_freeio_opts.money_dec_point + parts[1];
            }
            return output;
        },
        showMessage: function(msg, status) {
            if (msg) {
                var classes = 'alert bg-warning';
                if (status) {
                    classes = 'alert bg-info';
                }
                var $html = '<div id="wp-freeio-popup-message" class="animated fadeInRight"><div class="message-inner ' + classes + '">' + msg + '</div></div>';
                $('body').find('#wp-freeio-popup-message').remove();
                $('body').append($html).fadeIn(500);
                setTimeout(function() {
                    $('body').find('#wp-freeio-popup-message').removeClass('fadeInRight').addClass('delay-2s fadeOutRight');
                }, 2500);
            }
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
        },
    }

    $.wpfiMainCore = WJBPMainCore.prototype;

    $(document).ready(function() {
        // Initialize script
        new WJBPMainCore();

    });

})(jQuery);