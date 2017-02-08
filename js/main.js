(function ($) {
	
	$(".article .body a").each(function(){
		
		var url = $(this).attr('href');
		
		if(url) {
			
			if(url && url.indexOf('historyofvaccines') != -1 && url.indexOf("#") != -1) {
				var hash =  url.split("#")[1];	
				$(this).attr('href', '#'+hash);
			}	
		}
		
   		//do something with the element here.
	});

	$('.article .body a[href*="#"]:not([href="#"])').click(function(e) {
		
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	        e.preventsDefault();
	        e.stopPropagation();
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

    if ($('.mollom-privacy').html()){
        var mollom_policy = $('.mollom-privacy').html().slice(0,-1);
        $('.mollom-privacy').html(mollom_policy + ' and our <a href="http://www.historyofvaccines.org/content/legal-and-privacy" target="_blank">moderation and blog commenting policies</a>.<br><br>');
    }
        
    $('.panel-group .panel-title').click(function(){
	    $(this).find('span.glyphicon').toggleClass('glyphicon-plus glyphicon-minus');
	});
    
    $('.gallery-form input').on('change', function(){
        $(this).closest('form').submit();
    });
    $('#views-exposed-form-gallery-gallery').on('change', function(){
        $(this).closest('form').submit();
    });

	
    $(document.body).on('click', '.body-mediaitem-small-article' ,function(){
	    /*var root = $(this).attr('data-filename');
        var caption = $(this).attr('data-caption');
        var type = $(this).attr('data-type');
        
        
        $('.gallery-image-container .show-modal').attr('data-filename', root);
        $('.gallery-image-container + p small').html(caption);
        
        
        if (type == 'image') {
            $('.gallery-image-container .video').addClass('hidden');
            $('.gallery-image-container .image').removeClass('hidden');
            $('.gallery-image-container img').attr('src', 'http://media.historyofvaccines.org/images/' + root + '_265.jpg');

        } else if (type == 'video') {
            $('.gallery-image-container .image').addClass('hidden');
            $('.gallery-image-container .video').removeClass('hidden');
            $('.gallery-items video').attr('src', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.mp4')
                .attr('poster', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.jpg');
        }*/
        
        var root = $(this).attr('data-filename');
        var caption = $(this).attr('data-caption');
       
        var type = $(this).attr('data-type');
        
        
        $('.gallery-image-container .show-modal').attr('data-filename', root);
        $('.gallery-image-container p').html(caption);
        
        
        if (type == 'image') {
            $('.gallery-image-container .video').addClass('hidden');
            $('.gallery-image-container .image').addClass('hidden');
            $('.gallery-image-container .' + root).removeClass('hidden');
            
            $('video').each(function () {
		        this.pause();
		        //this.currentTime = 0;
		    });
            
            //$('.gallery-image-container .image img').attr('src', 'http://media.historyofvaccines.org/images/' + root + '_265.jpg');

        } else if (type == 'video') {
            $('.gallery-image-container .image').addClass('hidden');
            $('.gallery-image-container .video').addClass('hidden');
            $('.gallery-image-container .' + root).removeClass('hidden');
            
             $('video').each(function () {
		        this.pause();
		        //this.currentTime = 0;
		    });
		    
		    
            //$('.gallery-image-container video').attr('src', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.mp4')
            //    .attr('poster', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.jpg');
        }
    });
    
    $(document.body).on('click', '.body-mediaitem-small-timeline' ,function(){
	    var root = $(this).attr('data-filename');
        var caption = $(this).attr('data-caption');
       
        var type = $(this).attr('data-type');
        
        
        $('.gallery-image-container .show-modal').attr('data-filename', root);
        //$('.gallery-image-container p').html(caption);
        
        $('.caption-area').html(caption);
        
        
        if (type == 'image') {
            //$('.gallery-image-container .video').addClass('hidden');
            //$('.gallery-image-container .image').removeClass('hidden');
            //$('.gallery-items img').attr('src', 'http://media.historyofvaccines.org/images/' + root + '_540.jpg');
            $('.gallery-item').hide();
            $('.'+root).show();
            
            if($('.'+root).hasClass('hidden')) {
	            $('.'+root).removeClass('hidden');
            }

        } else if (type == 'video') {
            //$('.gallery-image-container .image').addClass('hidden');
            //$('.gallery-image-container .video').removeClass('hidden');
            //$('.gallery-items video').attr('src', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.mp4')
               // .attr('poster', 'http://media.historyofvaccines.org/mobile/video/320/' + root + '.jpg');
            $('.gallery-item').hide();
            $('.'+root).show();
            
            if($('.'+root).hasClass('hidden')) {
	            $('.'+root).removeClass('hidden');
            }
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
    
    $(document).on('click', '.show-modal', function(){
        var root = $(this).attr('data-filename');
        var hideBrowser = $(this).attr('data-hidebrowser');

        baseSetup();
        populateMediaInfo(root);
        if (hideBrowser == false) {
            buildBrowser(root);
        }
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
    
    function fixTitle(title) {
	        return title.replace("&#039;", "'");
    }
    function populateMediaInfo(root) {    
        var title = fixTitle(data[root].title);
        var description = data[root].description;
        var caption = data[root].caption;

        if (title != '') {
          $title.text(fixTitle(title));
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
    
            //console.log('success()', root, width, height, tileSize, minLevel);
            OpenSeadragon({
              id: "openseadragon",
              prefixUrl: "/themes/historyofvaccines/js/lib/openseadragon/images/",
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
		
		var _this = $(this);
		
		var filename = $invoker.data('filename');
		//var title = $invoker.data('title');
		var filetype = $invoker.data('filetype');
		var uniqueID = $invoker.data('uniqueid');
		var caption =  $invoker.data('caption');
		var creator =  $invoker.data('creator');
		
		console.log(caption, creator);
		
		if(uniqueID) {
			var path = "http://www.historyofvaccines.org/timeline#EVT_" + uniqueID;
			window.history.pushState("object or string", "Title", path);	
		}
		
        var file_arr = filename.split("|,|");
        var filetype_arr = filetype.split("|,|");
        
        var creator_arr = creator.split("|,|");
        var caption_arr = caption.split("|,|");
        ///var title_arr = title.split("|,|");
       
        file_arr.pop();
        filetype_arr.pop();
        creator_arr.pop();
        caption_arr.pop();
        //title_arr.pop();
        
       var file_arr_count = formatArray(file_arr);
       var mediaHtml = createHTML(file_arr, filetype_arr, creator_arr, caption_arr);
        

		$('.timeline-modal-date').html($invoker.data('datestr'));
		$('.timeline-modal-title').html($invoker.data('title'));
		$('.timeline-modal-body').html($invoker.data('body'));
		
		if(file_arr.length == 0) {
			$('.timeline-modal-image').html("");
		} else {
			 $('.timeline-modal-image').html(mediaHtml);
		}
        
        /*$.each(file_arr,function(k,v){
            $('.timeline-modal-image').append('<img src="http://media.historyofvaccines.org/images/' + v + '_265.jpg"  />');
        });*/
		
		if(!file_arr_count > 0) {
			$('.timeline-modal-left').hide();
			$('.timeline-modal-right').removeClass('col-md-7');
			$('.timeline-modal-right').addClass('col-md-12');
		} else {
			$('.timeline-modal-left').show();
			$('.timeline-modal-right').addClass('col-md-7');
			$('.timeline-modal-right').removeClass('col-md-12');
		}
	});
	
	function formatArray(files) {
		var count = 0;
		
		for(var i =0; i < files.length; i++) {
			
			var temp = files[i];
			if(temp) {
				count++;
			}
			
		}
		
		return count;
	}
	
	function createHTML(file_arr, filetype_arr, creator_arr, caption_arr) {
		var htmlString = "";
		htmlString = '<div class="body-mediaitem"><div class="gallery-image-container"><div class="gallery-items">';

		if(file_arr.length > 0) {
			var file = file_arr[0];
			var filetype = filetype_arr[0];
			
			if(file != "") {
		
				var type = 'image';
				
				if(file.indexOf('m4v') != -1 || filetype == "37") {
					type = 'video';	
				}
				
	        	htmlString += '<div class="gallery-item '+ type +  ' ' + file +'" style="position:relative;">';
	        	
	        	var attr = '';
	        	
	        	if(type == 'image') {
		        	var filename = "http://media.historyofvaccines.org/images/" + file + "_540.jpg";
		        	htmlString += '<img src="'+ filename +'" alt="' + caption_arr[0] + '"><div class="show-modal" data-hidebrowser="true" '+ attr +' data-filename="' + file + '">+</div>';
	        	} else {
		        	var filename = "http://media.historyofvaccines.org/mobile/video/320/" + file.split('.')[0] + ".mp4";
					var poster = "http://media.historyofvaccines.org/mobile/video/320/" + file.split('.')[0] + ".jpg";
					htmlString += '<video src="'+ filename + '" poster="'+ poster +'" controls="controls" preload="none" width="100%"></video>';
	        	}
	        	
	        	htmlString += '</div>';
        	
        	}
		}
		
		
		for(var i = 1; i < file_arr.length; i++) {
			var file = file_arr[i];
			var filetype = filetype_arr[i];
			var type = 'image';
			var class_file = file;
			if(file.indexOf('m4v') != -1 || filetype == "37") {
				type = 'video';	
				class_file = file.split('.')[0];
			}
			
        	htmlString += '<div class="gallery-item '+ type + ' ' + class_file +' hidden">';
        	
        	var attr = ' ';
        	if(type == 'image') {
	        	var filename = "http://media.historyofvaccines.org/images/" + file + "_540.jpg";
	        	htmlString += '<img src="'+ filename +'" alt="' + caption_arr[i] + '"><div class="show-modal" data-hidebrowser="true" ' + attr + ' data-filename="' + file + '">+</div>';	
        	} else {
	        	var filename = "http://media.historyofvaccines.org/mobile/video/320/" + file.split('.')[0] + ".mp4";
				var poster = "http://media.historyofvaccines.org/mobile/video/320/" + file.split('.')[0] + ".jpg";
				htmlString += '<video src="'+ filename + '" poster="'+ poster +'" controls="controls" preload="none" width="100%"></video>';
        	}
        	
        	htmlString += '</div></div>';
        }
        
        var creator = '';
        var caption = '';

        if (creator_arr[0]){
            creator = '<span>' + creator_arr[0] + '</span><br />';
        }
        if (caption_arr[0]){
    	    caption = "<b>" + caption_arr[0] + "</b>";
        }
        
        htmlString += "<p style='text-align:left; font-size: 11px; margin: 5px 0px; line-height: 16px; color: #999;' class='caption-area'>" + creator + ' ' + caption + "</p>";
        
        htmlString += '<div id="body-mediaitem-switcher">'
        for(var i = 0; i < file_arr.length; i++) {
	        var file = file_arr[i];
	        var filetype = filetype_arr[i];
	        
            var creator;
            var caption;

            if (creator_arr[i]){
	            creator = '<span>' + creator_arr[i] + '</span>';
            }
            if (caption_arr[i]){
	            caption = "<b>" + caption_arr[i] + "</b>";
            }
	        
	        if(file != "") {
		    
				var type = 'image';
				
				if(file.indexOf('m4v') != -1 || filetype == "37") {
					type = 'video';	
				}
				
	        	
				htmlString += '<div class="body-mediaitem-small body-mediaitem-small-timeline '+ file +'" data-filename="'+file+'" data-type="'+ type +'" data-caption="'+ creator + ' <br /> ' + caption +'">';
					if(type == 'image') {
			        	var filename = "http://media.historyofvaccines.org/images/" + file + "_265.jpg";
			        	htmlString += '<img src="'+ filename +'" alt="' + caption_arr[i] + '">';	
		        	} else {
			        	var filename = "http://media.historyofvaccines.org/images/" + file + "_265.jpg";
			        	htmlString += '<img src="'+ filename +'" alt="' + caption_arr[i] + '">';
		        	}
				htmlString += '</div>';
					
			}
			
		}
		htmlString += '</div>';
		
		htmlString += '</div></div>';
		
		return htmlString;
	}
	
	/*window.onbeforeunload = function() {
	  localStorage.removeItem("assessments");
	  return '';
	};*/
	
   
})(jQuery);
