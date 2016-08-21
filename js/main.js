(function ($) {

	$('.article a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top + 1
                }, 1000);
                return false;
            }
        }
    });
    
    $('.panel-group .panel-title').click(function(){
	    $(this).find('span.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
	});
    
    $('.gallery-form input').on('change', function(){
        $(this).closest('form').submit();
    });
    $('#views-exposed-form-gallery-gallery').on('change', function(){
        $(this).closest('form').submit();
    });

    $('#body-mediaitem-switcher > div').on('click', function() {
        var root = $(this).attr('data-filename');
        var caption = $(this).attr('data-caption');
        var type = $(this).attr('data-type');

        $('.gallery-image-container .show-modal').attr('data-filename', root);
        $('.gallery-image-container + p small').text(caption);
        
        if (type == 'image') {
            $('.gallery-image-container .video').addClass('hidden');
            $('.gallery-image-container .image').removeClass('hidden');
            $('.gallery-image-container img').attr('src', 'http://media.historyofvaccines.org/images/' + root + '_265.jpg');

        } else if (type == 'video') {
            $('.gallery-image-container .image').addClass('hidden');
            $('.gallery-image-container .video').removeClass('hidden');
            $('.gallery-image-container video').attr('src', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.mp4')
                .attr('poster', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.jpg');
        }
    });

    var $window = null;
    var $viewer = null;
    var $inner = null;

    var $data = null;
    var $event = null;
    var allimages = [];

    var $title = null;
    var $browser = null;
    var $info = null;

    var $openseadragon = null;
    
    $('.show-modal').on('click', function(){
        var root = $(this).attr('data-filename');
        baseSetup();
        populateMediaInfo(root);
        buildBrowser(root);
        buildSeadragon(root);
    });

    function baseSetup() {
        $data = null;
        $event = null;
        allimages = [];
    
        $viewer = $('#viewer');
        $inner = $('#viewer-inner');
    
        $inner.empty();
        $title = $('<div id="viewer-title"></div>');
        $info = $('<div id="viewer-info" class="viewer--tab closed"><div class="title">Media Info</div><div class="contents"></div></div>');
    
        $openseadragon = $('<div id="openseadragon"></div>');
    
        var $close = $('<div id="viewer-close" class="replace"><span>Close</span></div>').bind('click', close);

        $browser = $('<div id="viewer-browser"></div>');
        var $images =  $('<div id="viewer-browser-images"></div>');
        
        $('.title', $info).bind('click', function () {
          $(this).parent().toggleClass('closed');
        });

        $browser.append($images);

        $inner.append($close);
        $inner.append($title);
        $inner.append($info);
        $inner.append($browser);
        $inner.append($openseadragon);

        $viewer.css({ display: 'block' })
    }
    function populateMediaInfo(root) {    
        var title = data[root].title;
        var description = data[root].description;
        var caption = data[root].caption;

        if (title != '') {
          $title.text(title);
        } 
        else {
          $title.text('');
        }

        if (description != '') {
          $('.contents', $info).html(description);
        }
        else if (caption != '') {
          $('.contents', $info).html(caption);
        }
        else {
          $('.contents', $info).text('');
        }
    }
    function buildBrowser(root) {
        var $images = $('#viewer-browser-images');

        if (Object.keys(data).length > 1){ 
            $.each(Object.keys(data), function(key, value) {
                var $img = $('<img>')
                    .attr({ src: 'http://media.historyofvaccines.org/images/' + data[value].root + '_265.jpg' })
                    .data('filename', data[value].root)
                    .bind('click', function() {
                        baseSetup();
                        populateMediaInfo(data[value].root);
                        buildBrowser(data[value].root);
                        buildSeadragon(data[value].root);
                    });
                if (root == data[value].root) {
                    $img.addClass('selected');
                }
                $images.append($img);
            });
        }
    }
    function buildSeadragon(root) {
        $.ajax({
          type: 'GET',
          dataType: 'xml',
          url: 'http://media.historyofvaccines.org/images/tiles/' + root + '_img/ImageProperties.xml',
          success: function (xml)
          {
            var $IMAGE_PROPERTIES = $('IMAGE_PROPERTIES', xml);
            var width = $IMAGE_PROPERTIES.attr('WIDTH') | 0;
            var height = $IMAGE_PROPERTIES.attr('HEIGHT') | 0;
            var tileSize = $IMAGE_PROPERTIES.attr('TILESIZE') | 0;
    
            var minLevelW = Math.ceil(Math.log(width / tileSize) / Math.log(2));
            var minLevelH = Math.ceil(Math.log(height / tileSize) / Math.log(2));
    
            var minLevel = Math.max(minLevelW, minLevelH);
    
            console.log('success()', root, width, height, tileSize, minLevel);
            OpenSeadragon({
              id: "openseadragon",
              prefixUrl: "/drupal/themes/historyofvaccines/js/lib/openseadragon/images/",
              autoHideControls: false,
    
              showNavigator: false,
              navigatorPosition: 'TOP_RIGHT',
    
              showZoomControl: true,
              showHomeControl: true,
              showFullPageControl: false,
    
              tileSources: {
                width: width,
                height: height,
                tileSize: tileSize,
                minLevel: minLevel,
    
                getTileUrl: function (level, x, y) {
                  var url = 'http://media.historyofvaccines.org/images/tiles/' + root + '_img/TileGroup0/' + (level - 8) + '-' + x + '-' + y + '.jpg';    
                  return url;
                }
              }
            });
          }
        });
    }
    function close() {
        $("#viewer").css("display", "none");
    }
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
	
	$('#myModal').on('show.bs.modal', function (e) {
		var $invoker = $(e.relatedTarget);
		
		var filename = $invoker.data('filename');
        var file_arr = filename.split("|,|");
        file_arr.pop();
        console.log("file_arr: ");
        console.log(file_arr);

		$('.timeline-modal-date').html($invoker.data('year'));
		$('.timeline-modal-title').html($invoker.data('title'));
		$('.timeline-modal-body').html($invoker.data('body'));
        $('.timeline-modal-image').html("");
        $.each(file_arr,function(k,v){
            $('.timeline-modal-image').append('<img src="http://media.historyofvaccines.org/images/' + v + '_265.jpg"  />');
        });
		
		if(!filename) {
			$('.timeline-modal-left').hide();
			$('.timeline-modal-right').removeClass('col-md-7');
			$('.timeline-modal-right').addClass('col-md-12');
		} else {
			$('.timeline-modal-left').show();
			$('.timeline-modal-right').addClass('col-md-7');
			$('.timeline-modal-right').removeClass('col-md-12');
		}
	});
	
	/*function imageHTMLMaker(file_arr) {
		var str = "";
		
		for(var i = 1; i < file_arr.length; i++) {
			var file = file_arr[i];
			var filename = "";
			if(file.indexOf('m4v') == -1) {
				filename = "http://media.historyofvaccines.org/images/" + file + "_265.jpg";
				htmlString = '<div class="image hidden">
					            <img src="' + filename + '" alt="Smallpox in the Revolution">
					         </div>'
			} else {
				filename = "http://media.historyofvaccines.org/mobile/video/320/" + file.split('.')[0] + ".mp4";
				var poster = "http://media.historyofvaccines.org/mobile/video/320/" + file.split('.')[0] + ".jpg";
				htmlString = '<div class="video hidden">
                                 <video src="'+ filename + '" poster="'+ poster +'" controls="controls" autoplay="true" width="100%"></video>
                            </div>'
			}
			
			
			str = '<div class="gallery-image-container">
					        <div class="image hidden">
					            <img src="http://media.historyofvaccines.org/images/000135_265.jpg" alt="Smallpox in the Revolution">
					        </div>
					    </div>
						
					
					     <div id="body-mediaitem-switcher">
					        <div class="body-mediaitem-small" data-filename="" data-type="image" data-caption="U.S. Yellow Fever Commission">
							   <img src="http://media.historyofvaccines.org/images/_265.jpg" alt="U.S. Yellow Fever Commission">
					        </div>
			
			
		    </div>';
		}
		
		return str;
	};*/
   
})(jQuery);
