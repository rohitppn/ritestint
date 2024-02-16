(function($) {
    "use strict";

    var map, mapSidebar, markers, CustomHtmlIcon, group;
    var markerArray = [];

    $.extend($.apusThemeCore, {
        /**
         *  Initialize scripts
         */
        job_map_init: function() {
            var self = this;

            if ($('#jobs-google-maps').length) {
                L.Icon.Default.imagePath = 'wp-content/themes/freeio/images/';
            }

            setTimeout(function() {
                self.mapInit();
            }, 50);

        },

        mapInit: function() {
            var self = this;

            var $window = $(window);

            if (!$('#jobs-google-maps').length) {

                return;
            }

            map = L.map('jobs-google-maps', {
                scrollWheelZoom: false
            });

            markers = new L.MarkerClusterGroup({
                showCoverageOnHover: false
            });

            CustomHtmlIcon = L.HtmlIcon.extend({
                options: {
                    html: "<div class='map-popup'></div>",
                    iconSize: [30, 30],
                    iconAnchor: [22, 30],
                    popupAnchor: [0, -30]
                }
            });

            $window.on('pxg:refreshmap', function() {
                map._onResize();
                setTimeout(function() {

                    if (markerArray.length > 0) {
                        group = L.featureGroup(markerArray);
                        map.fitBounds(group.getBounds());
                    }
                }, 100);
            });

            $window.on('pxg:simplerefreshmap', function() {
                map._onResize();
            });

            if (freeio_job_map_opts.map_service == 'mapbox') {
                var tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/' + freeio_job_map_opts.mapbox_style + '/tiles/{z}/{x}/{y}?access_token=' + freeio_job_map_opts.mapbox_token, {
                    attribution: " &copy;  <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy;  <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                    maxZoom: 18,
                });
            } else if (freeio_job_map_opts.map_service == 'here') {

                var hereTileUrl = 'https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/' + freeio_job_map_opts.here_style + '/{z}/{x}/{y}/512/png8?apiKey=' + freeio_job_map_opts.here_map_api_key + '&ppi=320';
                var tileLayer = L.tileLayer(hereTileUrl, {
                    attribution: " &copy;  <a href='https://www.mapbox.com/about/maps/'>Here</a> &copy; <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
                    maxZoom: 18,
                });

            } else {
                if (freeio_job_map_opts.custom_style != '') {
                    try {
                        var custom_style = $.parseJSON(freeio_job_map_opts.custom_style);
                        var tileLayer = L.gridLayer.googleMutant({
                            type: 'roadmap',
                            styles: custom_style
                        });

                    } catch (err) {
                        var tileLayer = L.gridLayer.googleMutant({
                            type: 'roadmap'
                        });
                    }
                } else {
                    var tileLayer = L.gridLayer.googleMutant({
                        type: 'roadmap'
                    });
                }
            }



            map.addLayer(tileLayer);

            // check archive/single page
            if (!$('#jobs-google-maps').is('.single-job-map')) {
                self.updateMakerCards();
            } else {
                var $item = $('.single-listing-wrapper');

                if ($item.data('latitude') !== "" && $item.data('latitude') !== "") {
                    var zoom = (typeof MapWidgetZoom !== "undefined") ? MapWidgetZoom : 15;
                    self.addMakerToMap($item);
                    map.addLayer(markers);

                    map.setView([$item.data('latitude'), $item.data('longitude')], zoom);
                    $(window).on('update:map', function() {
                        map.setView([$item.data('latitude'), $item.data('longitude')], zoom);
                    });
                } else {
                    $('#jobs-google-maps').hide();
                }
            }
        },
        updateMakerCards: function() {
            var self = this;
            var $items = $('.main-items-wrapper .map-item');


            if ($('#jobs-google-maps').length && typeof map !== "undefined") {

                if (!$items.length) {
                    map.setView([freeio_job_map_opts.default_latitude, freeio_job_map_opts.default_longitude], 12);
                    return;
                }

                map.removeLayer(markers);
                markers = new L.MarkerClusterGroup({
                    showCoverageOnHover: false
                });
                $items.each(function(i, obj) {
                    self.addMakerToMap($(obj), true);
                });

                map.addLayer(markers);

                if (markerArray.length > 0) {
                    group = L.featureGroup(markerArray);
                    map.fitBounds(group.getBounds());
                }
            }
        },
        addMakerToMap: function($item, archive) {
            var self = this;
            var marker;

            if ($item.data('latitude') == "" || $item.data('longitude') == "") {
                return;
            }

            if ($item.data('logo')) {
                var img_logo = "<img src='" + $item.data('logo') + "' alt=''>";
                var mapPinHTML = "<div class='map-popup'><div class='icon-wrapper has-img is-job'>" + img_logo + "</div></div>";
            } else {
                var mapPinHTML = "<div class='map-popup'><div class='icon-wrapper is-freelancer'></div></div>";
            }

            marker = L.marker([$item.data('latitude'), $item.data('longitude')], {
                icon: new CustomHtmlIcon({
                    html: mapPinHTML
                })
            });

            if (typeof archive !== "undefined") {

                $item.on('mouseenter', function() {
                    $(marker._icon).find('.map-popup').addClass('map-popup-selected');
                }).on('mouseleave', function() {
                    $(marker._icon).find('.map-popup').removeClass('map-popup-selected');
                });

                var html_output = '';
                if ($item.hasClass('job_listing')) {
                    var logo_html = '';
                    if ($item.data('img')) {
                        logo_html = "<div class='employer-logo'><div class='image-wrapper image-loaded'>" +
                            "<img src='" + $item.data('img') + "' alt=''>" +
                            "</div></div>";
                    }

                    var title_html = '';
                    if ($item.find('.job-title').length) {
                        title_html = "<div class='job-title'>" + $item.find('.job-title').html() + "</div>";
                    }
                    var category_html = '';
                    if ($item.find('.category-job').length) {
                        category_html = "<div class='category-job'>" + $item.find('.category-job').html() + "</div>";
                    }
                    var salary_html = '';
                    if ($item.find('.job-salary').length) {
                        salary_html = "<div class='job-salary'>" + $item.find('.job-salary').html() + "</div>";
                    }
                    var location_html = '';
                    if ($item.find('.job-location').length) {
                        location_html = "<div class='job-location'>" + $item.find('.job-location').html() + "</div>";
                    }
                    var meta_html = "<div class='job-metas'>" + salary_html + category_html + location_html + "</div>";

                    html_output = "<div class='maps-popup-style job-item st-small'>" +
                        "<div class='inner'>" + logo_html +
                        "<div class='job-list-content'>" + title_html + meta_html + "</div>" +
                        "</div>" +
                        "</div>";
                } else if ($item.hasClass('service')) {
                    var logo_html = '';
                    if ($item.data('img')) {
                        logo_html = "<div class='service-logo'><div class='image-wrapper image-loaded'>" +
                            "<img src='" + $item.data('img') + "' alt=''>" +
                            "</div></div>";
                    }

                    var meta_html = '';
                    if ($item.find('.service-information').length) {
                        meta_html = "<div class='service-information'>" + $item.find('.service-information').html() + "</div>";
                    }

                    html_output = "<div class='maps-popup-style service-popup-item service-item st-small'>" +
                        "<div class='inner'>" + logo_html + meta_html +
                        "</div>" +
                        "</div>";
                } else if ($item.hasClass('freelancer')) {
                    var logo_html = '';
                    if ($item.data('img')) {
                        logo_html = "<div class='freelancer-logo'><div class='image-wrapper image-loaded'>" +
                            "<img src='" + $item.data('img') + "' alt=''>" +
                            "</div></div>";
                    }

                    var heading_html = '';
                    if ($item.find('.freelancer-title').length) {
                        heading_html = heading_html + '<div class="' + $item.find('.freelancer-title').attr('class') + '">' + $item.find('.freelancer-title').html() + "</div>";
                    }

                    var job_html = '';
                    if ($item.find('.freelancer-job').length) {
                        job_html = job_html + '<div class="' + $item.find('.freelancer-job').attr('class') + '">' + $item.find('.freelancer-job').html() + "</div>";
                    }

                    var meta_html = '<div class="freelancer-information">';
                    if ($item.find('.rating-reviews').length) {
                        meta_html = meta_html + '<div class="' + $item.find('.rating-reviews').attr('class') + '">' + $item.find('.rating-reviews').html() + "</div>";
                    }

                    if ($item.find('.freelancer-location').length) {
                        meta_html = meta_html + '<div class="' + $item.find('.freelancer-location').attr('class') + '">' + $item.find('.freelancer-location').html() + "</div>";
                    }

                    if ($item.find('.freelancer-salary').length) {
                        meta_html = meta_html + '<div class="' + $item.find('.freelancer-salary').attr('class') + '">' + $item.find('.freelancer-salary').html() + "</div>";
                    }

                    meta_html = meta_html + "</div>";

                    html_output = "<div class='maps-popup-style freelancer-popup-item freelancer-item st-small'>" +
                        "<div class='inner d-flex align-items-center'>" + logo_html + "<div class='inner-right'>" + heading_html + job_html + meta_html +
                        "</div></div>" +
                        "</div>";
                } else {
                    var logo_html = '';
                    if ($item.data('img')) {
                        logo_html = "<div class='employer-logo'><div class='image-wrapper image-loaded'>" +
                            "<img src='" + $item.data('img') + "' alt=''>" +
                            "</div></div>";
                    }

                    var title_html = '';
                    if ($item.find('.freelancer-title').length) {
                        title_html = "<div class='job-title'>" + $item.find('.freelancer-title').html() + "</div>";
                    }
                    var meta_html = '';
                    if ($item.find('.job-metas').length) {
                        meta_html = "<div class='job-metas'>" + $item.find('.job-metas').html() + "</div>";
                    }

                    html_output = "<div class='maps-popup-style job-list'>" +
                        "<div class='inner'>" + logo_html +
                        "<div class='job-list-content'>" + title_html + meta_html + "</div>" +
                        "</div>" +
                        "</div>";
                }

                marker.bindPopup(html_output).openPopup();
            }

            markers.addLayer(marker);
            markerArray.push(L.marker([$item.data('latitude'), $item.data('longitude')]));
        },

    });

    $.apusThemeExtensions.job_map = $.apusThemeCore.job_map_init;


})(jQuery);