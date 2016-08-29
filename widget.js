/* global requirejs cprequire cpdefine chilipeppr THREE $*/
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

cprequire_test(["inline:com-chilipeppr-widget-cml"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    // init my widget
    myWidget.init();
    // $('#' + myWidget.id).css('margin', '20px');
    $('body').css('padding', '20px');
    $('body').css('height', '100%');
    $('html').css('height', '100%');
    $('title').html(myWidget.name);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-cml", ["chilipeppr_ready", /* other dependencies here */ ], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-cml", // Make the id the same as the cpdefine id
        name: "Widget / CML", // The descriptive name of your widget.
        desc: "Sample CML experience.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            // '/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
        },
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            var that = this;
            
            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();
            
            // attach events to buttons
            // buttons should be named btn-s1 and bubbles should be named bubble-s1
            // we will create 20 bubble events
            for (var i = 1; i < 20; i++) {
                $('#' + this.id + ' .btn-s' + i).click('#' + this.id + ' .bubble-s' + i, this.slideIt);
            }
            
            // CML composer and send button
            $('.btn-sendhybrid').click(this.mimicRecvCml.bind(this));
            $('.btn-clearbubbles').click(this.clearBubbles.bind(this));
            $('.menu-ccard').click(this.onCmlTemplateCcard.bind(this));
            $('.menu-addr').click(this.onCmlTemplateAddr.bind(this));
            $('.menu-youtube').click(this.onCmlTemplateYoutube.bind(this));
            $('.menu-hello').click(this.onCmlTemplateHello.bind(this));
            $('.menu-animgif').click(this.onCmlTemplateAnimgif.bind(this));

            
            // transition from generic phone to branded header
            $('.btn-name').click(function() {
                $('.cml-text-interface .top-phone-generic').addClass('hidden');
                $('.top-phone-jimmyjohn').removeClass('hidden');
            });
            $('.btn-logo').click(function() {
                $('.logo-jimmyjohn').removeClass("hidden");
            });
            
            $('.btn-lock').click(function() {
                $('.lockicon').removeClass("hidden");
            });
            
            // topbar
            $('.topbar').click(this.showNotificationMenu.bind(this));
            $('.notify-mainmenu').click(this.hideNotificationMenu.bind(this));
            
            // jimmyjohn usecase
            $('.btn-usecase-jimmyjohn').click(function() {
                $('.toolbar-usecase-jimmyjohn').toggleClass('hidden'); 
            });
            
            // amex usecase
            $('.btn-usecase-amex').click(function() {
                $('.toolbar-usecase-amex').toggleClass('hidden'); 
            });
            
            // delivery btn
            $('.btn-delivery').click('.bubble-s2', this.slideIt);
            
            // bind address picker
            $('#' + this.id + ' .btn-addrpicker').click(this.openAddrPicker.bind(this));
            $('#' + this.id + ' .dlg-addrpicker .close').click(this.closeAddrPicker.bind(this));
            $('#' + this.id + ' .btn-addr-home').click(function() {
                if (that.isInGenericMode) {
                    that.closeAddrPicker();
                    that.isInGenericMode = false;
                } else {
                    that.closeAddrPicker();
                    that.slideIt({data:'#' + that.id + ' .bubble-s4'});
                }
            });
            
            // credit card picker
            $('#' + this.id + ' .btn-ccardpicker').click(this.openCcardPicker.bind(this));
            $('#' + this.id + ' .dlg-ccardpicker .close').click(this.closeCcardPicker.bind(this));
            // $('#' + this.id + ' .btn-ccard-visa').click(this.closeCcardPicker.bind(this));
            $('#' + this.id + ' .btn-ccard-visa').click(function() {
                if (that.isInGenericMode) {
                    that.closeCcardPicker();
                    $('.btn-ccard-default').text("Visa - 9010");
                    that.changeComposeBox("Visa 4000 1234 5678 9010 Exp: 12/20");
                    that.isInGenericMode = false;
                } else {
                    that.closeCcardPicker();
                    that.slideIt({data:'#' + that.id + ' .bubble-s10'});
                }
            });
            $('#' + this.id + ' .btn-ccard-amex').click(function() {
                if (that.isInGenericMode) {
                    that.closeCcardPicker();
                    $('.btn-ccard-default').text("Amex - 21001");
                    that.changeComposeBox("American Express 3759 876543 21001 Exp: 04/22");
                    that.isInGenericMode = false;
                } else {
                    that.closeCcardPicker();
                    // that.slideIt({data:'#' + that.id + ' .bubble-s10'});
                }
            });
                           
            // compose box
            $('.compose-box').keypress(this.onComposeKeypress.bind(this));
            $('.compose-box').keyup(this.onComposeKeyup.bind(this));
            $('.cml-text-interface .compose-box').keyup(this.onComposeCmlKeyup.bind(this));
            $('.generic-text-interface .compose-box').keyup(this.onComposeGenericKeyup.bind(this));
            $('.send-arrow').click(this.onClickSendButton.bind(this));
            
            // for debug need to see dialog
            //this.openAddrPicker();

            console.log("I am done being initted.");
        },
        changeComposeBox: function(txt) {
            $('.compose-box').val(txt);
            this.onComposeKeyup();
        },
        onComposeKeypress: function(event) {
            console.log("keypress")
            var keycode = (event.keyCode ? event.keyCode : event.which);
        	if (keycode == '13'){
        // 		console.log('You pressed a "enter" key in textbox');
        		var text = $('.compose-box').val();
        		this.mimicSendText(text);
        		$('.compose-box').val("");
    		}
        	
        },
        onComposeCmlKeyup: function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            // console.log("cml keyup. event:", event, "keycode:", keycode);
            $('.generic-text-interface .compose-box').val($('.cml-text-interface .compose-box').val());
        },
        onComposeGenericKeyup: function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            // console.log("generic keyup. event:", event, "keycode:", keycode);
            $('.cml-text-interface .compose-box').val($('.generic-text-interface .compose-box').val());
        },
        onComposeKeyup: function(event) {
            // see if empty and if so then put mic back
    	    if ($('.compose-box').val().length > 0) {
        	    this.showSendArrow();
    	    } else {
    	        this.showMic();
    	    }
        },
        showSendArrow: function() {
            // put send arrow in place of mic
    		$('.microphone').addClass("hidden");
    		$('.send-arrow').removeClass("hidden");
        },
        showMic: function() {
            // put mic back from send arrow
    		$('.microphone').removeClass("hidden");
    		$('.send-arrow').addClass("hidden");
        },
        onClickSendButton: function() {
            var text = $('.compose-box').val();
    		this.mimicSendText(text);
    		$('.compose-box').val("");
    		
    		this.showMic();
        },
        mimicSendText: function(text) {
            console.log("sendCml.");
            
            // get bubble template
            var bubbleOutTemplateEl = $('.bubble-template.bubble-out').clone();
            bubbleOutTemplateEl.removeClass('bubble-template');
            bubbleOutTemplateEl.removeClass('hidden');
            bubbleOutTemplateEl.addClass("bubble-dynamicallygenerated");
            
            // insert bubble in text region
            var bubbleTextEl = bubbleOutTemplateEl.clone();
            var bcEl = bubbleTextEl.find('.bubble-content');
            bcEl.text(text);
            $('.generic-text-interface .panel-body').append(bubbleTextEl);
            
            // insert bubble in CML region
            var bubbleTextEl2 = bubbleTextEl.clone();
            $('.cml-text-interface .panel-body').append(bubbleTextEl2);
        },
        onCmlTemplateYoutube: function() {
            var tmplt = $('.cml-template-youtube').clone();
            tmplt.removeClass("hidden");
            tmplt.removeClass("cml-template-ccard");
            $('.cml-text').val(tmplt[0].outerHTML);
        },
        onCmlTemplateAddr: function() {
            var tmplt = $('.cml-template-addr').clone();
            tmplt.removeClass("hidden");
            tmplt.removeClass("cml-template-ccard");
            $('.cml-text').val(tmplt[0].outerHTML);
        },
        onCmlTemplateCcard: function() {
            var tmpltCcard = $('.cml-template-ccard').clone();
            tmpltCcard.removeClass("hidden");
            tmpltCcard.removeClass("cml-template-ccard");
            $('.cml-text').val(tmpltCcard[0].outerHTML);
        },
        onCmlTemplateHello: function() {
            var tmplt = $('.cml-template-hello').clone();
            tmplt.removeClass("hidden");
            tmplt.removeClass("cml-template-hello");
            $('.cml-text').val(tmplt[0].outerHTML);
        },
        onCmlTemplateAnimgif: function() {
            var tmplt = $('.cml-template-animgif').clone();
            tmplt.removeClass("hidden");
            tmplt.removeClass("cml-template-hello");
            $('.cml-text').val(tmplt[0].outerHTML);
            
        },
        mimicRecvCml: function(altText) {
            console.log("sendCml.");
            
            // take the text and parse it
            var cmltext = $('.cml-text').val();
            console.log("cmltext:", cmltext);
            var cml = $(cmltext);
            console.log("cml:", cml);
            
            // deal with fallback
            var fallback = cml.find('cml-fallback');
            console.log("fallback:", fallback);
            var fallbackTxt = fallback.text();
            
            // delete fallback element
            fallback.remove();
            
            // now extract HTML
            var html = cml.html();
            
            // get bubble template
            var bubbleInTemplateEl = $('.bubble-template.bubble-in').clone();
            bubbleInTemplateEl.removeClass('bubble-template');
            bubbleInTemplateEl.removeClass('hidden');
            bubbleInTemplateEl.addClass("bubble-dynamicallygenerated");
            
            // insert bubble in text region
            var bubbleTextEl = bubbleInTemplateEl.clone();
            var bcEl = bubbleTextEl.find('.bubble-content');
            bcEl.text(fallbackTxt);
            $('.generic-text-interface .panel-body').append(bubbleTextEl);
            
            // insert bubble in CML region
            var bubbleHtmlEl = bubbleInTemplateEl.clone();
            var bcEl = bubbleHtmlEl.find('.bubble-content');
            bcEl.html(html);
            
            // see if there is a style tag in cml
            var cmlStyle = cml.attr('style');
            console.log("cmlStyle:", cmlStyle);
            bcEl.attr('style', cmlStyle);
            
            // see if there is a credit card picker in CML
            var ccardEl = bcEl.find('cml-creditcard');
            if (ccardEl.length > 0) {
                console.log("there is a credit card picker wanted");
                // find template
                var ccTmplt = $('.template-ccardpicker').clone();
                ccTmplt.removeClass('hidden');
                ccTmplt.removeClass('template-ccardpicker');
                ccardEl.replaceWith(ccTmplt);
                bcEl.find('.btn-ccardpicker').click(this.openCcardPickerGeneric.bind(this));
                var that = this;
                bcEl.find('.btn-ccard-default').click(function(event) {
                    console.log("default ccard got clicked. event:", event);
                    var el = $(event.currentTarget);
                    if (el.text().match(/visa/i)) {
                        that.changeComposeBox("Visa 4000 1234 5678 9010 Exp: 12/20");
                    } else {
                        that.changeComposeBox("American Express 3759 876543 21001 Exp: 04/22");
                    }
                });
            }
            
            // see if there is an address picker in CML
            var ccardEl = bcEl.find('cml-address');
            if (ccardEl.length > 0) {
                console.log("there is a credit card picker wanted");
                // find template
                var ccTmplt = $('.template-addrpicker').clone();
                ccTmplt.removeClass('hidden');
                ccTmplt.removeClass('template-addrpicker');
                ccardEl.replaceWith(ccTmplt);
                bcEl.find('.btn-addrpicker').click(this.openAddrPickerGeneric.bind(this));
                var that = this;
                bcEl.find('.btn-addr-default').click(function(event) {
                    console.log("default addr got clicked. event:", event);
                    var el = $(event.currentTarget);
                    if (el.text().match(/home/i)) {
                        that.changeComposeBox("2917 W Eaton St, Seattle, WA 98199");
                    } else {
                        that.changeComposeBox("2401 4th Ave, Suite 600, Seattle, WA 98121");
                    }
                });
            }
            
            $('.cml-text-interface .panel-body').append(bubbleHtmlEl);
            
            
        },
        clearBubbles: function() {
            $('.generic-text-interface .panel-body .bubble-dynamicallygenerated').remove();
            $('.cml-text-interface .panel-body .bubble-dynamicallygenerated').remove();
        },
        showNotificationMenu: function() {
            console.log("showNotificationMenu");
            $('#' + this.id + " .android-pulldown").removeClass("hidden");
        },
        hideNotificationMenu: function() {
            $('#' + this.id + " .notify-mainmenu").addClass("slideoutanim");
            $('#' + this.id + " .notify-jimmyjohn").addClass("slideoutanim2");
            var that = this;
            setTimeout(function() {
                $('#' + that.id + " .notify-mainmenu").addClass("hidden");
                $('#' + that.id + " .notify-jimmyjohn").addClass("hidden");
                $('#' + that.id + " .android-pulldown").addClass("hidden");
                setTimeout(function() {
                    $('#' + that.id + " .notify-mainmenu").removeClass("slideoutanim");
                    $('#' + that.id + " .notify-jimmyjohn").removeClass("slideoutanim2");
                    $('#' + that.id + " .notify-mainmenu").removeClass("hidden");
                    $('#' + that.id + " .notify-jimmyjohn").removeClass("hidden");
                }, 1000);
            }, 1000);
        },
        openAddrPicker: function() {
            console.log("openAddrPicker");
            $('#' + this.id + " .dlg-addrpicker").removeClass("hidden"); 
        },
        openAddrPickerGeneric: function() {
            this.isInGenericMode = true;
            console.log("openAddrPicker");
            $('#' + this.id + " .dlg-addrpicker").removeClass("hidden"); 
        },
        closeAddrPicker: function() {
            $('#' + this.id + " .dlg-addrpicker").addClass("hidden"); 
        },
        openCcardPicker: function() {
            $('#' + this.id + " .dlg-ccardpicker").removeClass("hidden"); 
        },
        openCcardPickerGeneric: function() {
            this.isInGenericMode = true;
            $('#' + this.id + " .dlg-ccardpicker").removeClass("hidden"); 
        },
        closeCcardPicker: function() {
            $('#' + this.id + " .dlg-ccardpicker").addClass("hidden"); 
        },
        /**
         * Pass in a class name and we'll hide it and then show it again so the anim applies.
         */
        slideIt: function(data) {
            console.log("slideIt. data:", className);
            var className = data.data;
            console.log("slideIt. className:", className);
            $(className).addClass('hidden');
            setTimeout(function() {
                console.log("unhiding. className:", className);
                $(className).removeClass('hidden');
                var d = $(className).parent();
                d.scrollTop(d.prop("scrollHeight"));
            }, 200);
        },
        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-sayhello').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-sayhello').popover("hide");
                // Show a flash msg
                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Hello Title",
                    "Hello World from widget " + that.id,
                    1000
                );
            });

            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-helloworld2').click(this.onHelloBtnClick.bind(this));

        },
        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onHelloBtnClick: function(evt) {
            console.log("saying hello 2 from btn in tab 1");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Hello 2 Title",
                "Hello World 2 from Tab 1 from widget " + this.id,
                2000 /* show for 2 second */
            );
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up more room since it's showing
            $(window).trigger("resize");
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
            // this will send an artificial event letting other widgets know to resize
            // themselves since this widget is now taking up less room since it's hiding
            $(window).trigger("resize");
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});