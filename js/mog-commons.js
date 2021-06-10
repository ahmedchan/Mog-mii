/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(h,j,e){var a="placeholder" in j.createElement("input");var f="placeholder" in j.createElement("textarea");var k=e.fn;var d=e.valHooks;var b=e.propHooks;var m;var l;if(a&&f){l=k.placeholder=function(){return this};l.input=l.textarea=true}else{l=k.placeholder=function(){var n=this;n.filter((a?"textarea":":input")+"[placeholder]").not(".placeholder").bind({"focus.placeholder":c,"blur.placeholder":g}).data("placeholder-enabled",true).trigger("blur.placeholder");return n};l.input=a;l.textarea=f;m={get:function(o){var n=e(o);var p=n.data("placeholder-password");if(p){return p[0].value}return n.data("placeholder-enabled")&&n.hasClass("placeholder")?"":o.value},set:function(o,q){var n=e(o);var p=n.data("placeholder-password");if(p){return p[0].value=q}if(!n.data("placeholder-enabled")){return o.value=q}if(q==""){o.value=q;if(o!=j.activeElement){g.call(o)}}else{if(n.hasClass("placeholder")){c.call(o,true,q)||(o.value=q)}else{o.value=q}}return n}};if(!a){d.input=m;b.value=m}if(!f){d.textarea=m;b.value=m}e(function(){e(j).delegate("form","submit.placeholder",function(){var n=e(".placeholder",this).each(c);setTimeout(function(){n.each(g)},10)})});e(h).bind("beforeunload.placeholder",function(){e(".placeholder").each(function(){this.value=""})})}function i(o){var n={};var p=/^jQuery\d+$/;e.each(o.attributes,function(r,q){if(q.specified&&!p.test(q.name)){n[q.name]=q.value}});return n}function c(o,p){var n=this;var q=e(n);if(n.value==q.attr("placeholder")&&q.hasClass("placeholder")){if(q.data("placeholder-password")){q=q.hide().next().show().attr("id",q.removeAttr("id").data("placeholder-id"));if(o===true){return q[0].value=p}q.focus()}else{n.value="";q.removeClass("placeholder");n==j.activeElement&&n.select()}}}function g(){var r;var n=this;var q=e(n);var p=this.id;if(n.value==""){if(n.type=="password"){if(!q.data("placeholder-textinput")){try{r=q.clone().attr({type:"text"})}catch(o){r=e("<input>").attr(e.extend(i(this),{type:"text"}))}r.removeAttr("name").data({"placeholder-password":q,"placeholder-id":p}).bind("focus.placeholder",c);q.data({"placeholder-textinput":r,"placeholder-id":p}).before(r)}q=q.removeAttr("id").hide().prev().attr("id",p).show()}q.addClass("placeholder");q[0].value=q.attr("placeholder")}else{q.removeClass("placeholder")}}}(this,document,jQuery));

/* less more */
;(function($, undefined) {
    $.fn.shorten = function(settings) {
        return this.each(function() {
            "use strict";

            var $this = $(this),

                config = {
                    showChars: 210,
                    ellipsesText: "...",
                    moreText: "<i class='fa fa-ellipsis-h' aria-hidden='true'></i>",
                    lessText: "<i class='fa fa-ellipsis-h' aria-hidden='true'></i>",
                    errMsg: null,
                    force: false
                };

            if (settings) {
                $.extend(config, settings);
            }

            if ($this.data('jquery.shorten') && !config.force) {
                return false;
            }
            $this.data('jquery.shorten', true);

            $this.off("click", '.morelink');

            $this.on({
                click: function() {
                    var $this = $(this);
                    if ($this.hasClass('less')) {
                        $this.removeClass('less');
                        $this.html(config.moreText);
                        $this.parent().prev().prev().show(); // shortcontent
                        $this.parent().prev().hide(); // allcontent
                    } else {
                        $this.addClass('less');
                        $this.html(config.lessText);
                        $this.parent().prev().prev().hide(); // shortcontent
                        $this.parent().prev().show(); // allcontent
                    }
                    return false;
                }
            }, '.morelink');

            var content = $this.html(), contentlen = $this.text().length;
            if (contentlen > config.showChars) {
                var c = content.substr(0, config.showChars);
                if (c.indexOf('<') >= 0) // If there's HTML don't want to cut it
                {
                    var inTag = false, // I'm in a tag?
                        bag = '', // Put the characters to be shown here
                        countChars = 0, // Current bag size
                        openTags = [], // Stack for opened tags, so I can close them later
                        tagName = null,
                        i, r;

                    for (i = 0, r = 0; r <= config.showChars; i++) {
                        if (content[i] == '<' && !inTag) {
                            inTag = true;
                            // This could be "tag" or "/tag"
                            tagName = content.substring(i + 1, content.indexOf('>', i));
                            // If its a closing tag
                            if (tagName[0] == '/') {

                                if (tagName != '/' + openTags[0]) {
                                    config.errMsg = 'ERROR en HTML: the top of the stack should be the tag that closes';
                                } else {
                                    openTags.shift(); // Pops the last tag from the open tag stack (the tag is closed in the retult HTML!)
                                }

                            } else {
                                // There are some nasty tags that don't have a close tag like <br/>
                                if (tagName.toLowerCase() != 'br') {
                                    openTags.unshift(tagName); // Add to start the name of the tag that opens
                                }
                            }
                        }
                        if (inTag && content[i] == '>') {
                            inTag = false;
                        }

                        if (inTag) { bag += content.charAt(i); } // Add tag name chars to the result
                        else {
                            r++;
                            if (countChars <= config.showChars) {
                                bag += content.charAt(i); // Fix to ie 7 not allowing you to reference string characters using the []
                                countChars++;
                            } else // Now I have the characters needed
                            {
                                if (openTags.length > 0) // I have unclosed tags
                                {
                                    //console.log('They were open tags');
                                    //console.log(openTags);
                                    for (j = 0; j < openTags.length; j++) {
                                        //console.log('Cierro tag ' + openTags[j]);
                                        bag += '</' + openTags[j] + '>'; // Close all tags that were opened
                                        // You could shift the tag from the stack to check if you end with an empty stack, that means you have closed all open tags
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    c = $('<div/>').html(bag + '<span class="ellip">' + config.ellipsesText + '</span>').html();
                }else{
                    c+=config.ellipsesText;
                }

                var html = '<div class="shortcontent">' + c +
                    '</div><div class="allcontent">' + content +
                    '</div><span class="morelink-container"><a href="javascript://nop/" class="btn btn-xs btn-gray morelink">' + config.moreText + '</a></span>';

                $this.html(html);
                $this.find(".allcontent").hide(); // Hide all text
                $('.shortcontent p:last', $this).css('margin-bottom', 0); //Remove bottom margin on last paragraph as it's likely shortened
            }
        });

    }
})(jQuery);


// adjust modal to be verticllay and horizontilly centered and apply filter with easing...
var modalAdjust = (function(){

  function setModalMaxHeight(element) {
    this.$element     = $(element);  
    this.$content     = this.$element.find('.modal-content');
    var borderWidth   = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin  = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight  = this.$element.find('.modal-header').outerHeight() || 0;
    var footerHeight  = this.$element.find('.modal-footer').outerHeight() || 0;
    var maxHeight     = contentHeight - (headerHeight + footerHeight);

    this.$content.css({
        'overflow': 'hidden'
    });
    
    this.$element
      .find('.modal-body').css({
        'max-height': maxHeight,
        'overflow-y': 'auto'
    });
  }

  return {
    setModalMaxHeight: setModalMaxHeight
  }

})();


// ripple effect with javascript
var rippleEffect = (function(){

  var $ripple = $('.ripple-effect');

  function activeRipple(){

    $ripple.bind('click', function(e){
      var $rippleTrigger = $(this);
      // create .ink element if it doesn't exist
      if($rippleTrigger.find(".ink").length == 0) {
          $rippleTrigger.append("<span class='ink'></span>");
      }

      var ink = $rippleTrigger.find(".ink");

      // prevent quick double clicks
      ink.removeClass("animate");

      // set .ink diametr
      if(!ink.height() && !ink.width())
      {
          var d = Math.max($rippleTrigger.outerWidth(), $rippleTrigger.outerHeight());
          ink.css({height: d, width: d});
      }

      // get click coordinates
      var x = e.pageX - $rippleTrigger.offset().left - ink.width()/2;
      var y = e.pageY - $rippleTrigger.offset().top - ink.height()/2;

      // set .ink position and add class .animate
      ink.css({
        top: y+'px',
        left:x+'px'
      }).addClass("animate");
    });
  }

  return {
    activeRipple: activeRipple
  };

})();


// rating system module
var rating = (function(el){

  var $el = $('[data-star="rating"]');

  var setRatingStar = function() {
    return $el.each(function() {
      if (parseInt($el.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
        return $(this).removeClass('fa-star-o').addClass('fa-star');
      } else {
        return $(this).removeClass('fa-star').addClass('fa-star-o');
      }
    });
  };

  var makeRate = function(){
    $(document).on('click','[data-star="rating"]', function(){
      $el.siblings('input.rating-value').val($(this).data('rating'));
      return setRatingStar();
    });
  };
  

  return {
    makeRate: makeRate
  }

})();


// persist header to be fixed on scroll
function UpdateTableHeaders() {
   $(".persist-area").each(function() {
   
       var el             = $(this),
           offset         = el.offset(),
           scrollTop      = $(window).scrollTop(),
           floatingHeader = $(".floatingHeader", this);
       
       if ((scrollTop > offset.top) && (scrollTop < offset.top + el.height())) {
           floatingHeader.css({
            "visibility": "visible"
           });
       } else {
           floatingHeader.css({
            "visibility": "hidden"
           });      
       };
   });
}



////////////////////////////////////// active on DOM ready
$(document).ready(function(){

  var $win = $(window), $doc = $(document), $body = $(document.body), $wrap = $('#wrap');
  var isRTL = $("html[lang=ar]").attr("dir") ? true: false;

  /////////////////////////////////////// show hide header on scroll
  $("[data-headroom]").headroom();

  //////////////////////////////////////// rating
  rating.makeRate();

  //////////////////////////////////////////////// modals and modal ajax  
  $doc.on( 'click', '[data-toggle="pajax"]', function(e){
    e && e.preventDefault();
    var $this = $(this),
      $remote = $this.data('remote') || $this.attr('href'),
      $modal = $('<div class="modal fade" tabindex="-1" role="dialog" id="pajax"></div>');
    $body.append($modal);
    $modal.append('<div class="nprogress-spinner blue"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>').modal('show').on('hide.bs.modal', function(event){ $('#pajax').remove(); });
    $modal.load($remote, function(responseTxt, statusTxt, xhr){
      if(statusTxt == "error") $('#pajax').remove();
    });
  });

  $win.resize(function() {
    if ($('.modal.in').length != 0) {
      modalAdjust.setModalMaxHeight($('.modal.in'));
    }
  });

  /////////////////////////////////////////// sticky headers
  var clonedHeaderRow;

  $(".persist-area").each(function() {
    clonedHeaderRow = $(".persist-header", this);
    clonedHeaderRow.before(clonedHeaderRow.clone()).css("width", clonedHeaderRow.width()).addClass("floatingHeader");
  });
   
  $win.scroll(UpdateTableHeaders).trigger("scroll");


  /////////////////////////////////////////// ripple-effects
  rippleEffect.activeRipple();


  ///////////////////////////////////////////////////// slick
  $('[data-cycle="offers"]').slick({
    infinite: true,
    speed: 300,
    rtl : isRTL ? true : false,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></button>'
  });

  $('[data-cycle="mapgallary"]').slick({
    infinite: false,
    speed: 300,
    rtl : isRTL ? true : false,
    variableWidth: true,
    cssEase: 'linear',
    prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></button>'
  });


  /////////////////////////////////////////////////////////// placeholder
  $('input[placeholder], textarea[placeholder]').placeholder();

  /////////////////////////////////////////////////// shorten
  $('[data-shorten="shorten"]').shorten();

  /////////////////////////////////////////////////////////// popover
  $("[data-toggle=popover]").popover();
  $(document).on('click', '.popover-title .close', function(e){
    var $target = $(e.target), $popover = $target.closest('.popover').prev();
    $popover && $popover.popover('hide');
  });

  ///////////////////////////////// colorbox
  $('[rel="colorbox"]').colorbox({rel:'info', previous:'<i class="fa">&#xf104;</i>', next:'<i class="fa">&#xf105;</i>'});


  //////////////////////////////////////// orderForm
  var $orderForm = $('#orderForm').stepFormWizard({
    height : "auto",
    duration: 200,
    rtl : isRTL ? true : false,
    showNavNumbers: false,
    linkNav:'prev',
    transition: "fade",
    finishBtn: $('<button type="button" class="btn btn-blue finish-btn ripple-effect">Submit</button>'),
    nextBtn: $('<button type="button" class="btn btn-gray next-btn  ripple-effect">Next</button>'),
    prevBtn: $('<button type="button" class="btn btn-gray prev-btn ripple-effect">Previous</button>')
    //markPrevSteps: true
  });



  ///////////////////////////////////////////////////////// class
  $(document).on('click', '[data-toggle^="class"]', function(e){
    e && e.preventDefault();
    var $this = $(e.target), $class , $target, $tmp, $classes, $targets;
    !$this.data('toggle') && ($this = $this.closest('[data-toggle^="class"]'));
    $class = $this.data()['toggle'];
    $target = $this.data('target') || $this.attr('href');
    $class && ($tmp = $class.split(':')[1]) && ($classes = $tmp.split(','));
    $target && ($targets = $target.split(','));
    $targets && $targets.length && $.each($targets, function( index, value ) {
      ($targets[index] !='#') && $($targets[index]).toggleClass($classes[index]);
    });
    $this.toggleClass('active');
  });

  ////////////////////////////////////////////////////// sticky
  $('[data-stick="sticky"]').each(function() {
    var $this = $(this),opts;
    var pluginOptions = $this.data('plugin-options');
    if (pluginOptions) opts = pluginOptions;
    $this.theiaStickySidebar(opts);
  });


  /////////////////////////////////////////////////////// dropdown menu
  $.fn.dropdown.Constructor.prototype.change = function(e){
    e.preventDefault();
    var $item = $(e.target), $select, $checked = false, $menu, $label;
    !$item.is('a') && ($item = $item.closest('a'));
    $menu = $item.closest('.dropdown-menu');
    $label = $menu.parent().find('.dropdown-label');
    $labelHolder = $label.text();
    $select = $item.find('input');
    $checked = $select.is(':checked');
    if($select.is(':disabled')) return;
    if($select.attr('type') == 'radio' && $checked) return;
    if($select.attr('type') == 'radio') $menu.find('li').removeClass('active');
    $item.parent().removeClass('active');
    !$checked && $item.parent().addClass('active');
    $select.prop("checked", !$select.prop("checked"));

    $items = $menu.find('li > a > input:checked');
    if ($items.length) {
        $text = [];
        $items.each(function () {
            var $str = $(this).parent().text();
            $str && $text.push($.trim($str));
        });

        $text = $text.length < 4 ? $text.join(', ') : $text.length + ' selected';
        $label.html($text);
    }else{
      $label.html($label.data('placeholder'));
    }      
  }
  $doc.on('click.dropdown-menu', '.dropdown-select > li > a', $.fn.dropdown.Constructor.prototype.change);

});
