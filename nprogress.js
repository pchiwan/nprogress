/**********************************************
* A stylized progress bar based on
* NProgress (c) 2013, Rico Sta. Cruz
* http://ricostacruz.com/nprogress/
* by Sílvia Mur Blanch aka PchiwaN
* http://github.com/pchiwan/nprogress
***********************************************/

function NProgress (_settings) {
    /// <summary>Returns an instance of the progress bar</summary>
    /// <param name="_settings" type="Object">
    /// <para> ---------------------------------------------- </para>
    /// <para> minimum:Decimal -> Minimum percentage of increment. </para>
    /// <para> ---------------------------------------------- </para>
    /// <para> easing:String -> CSS easing string for the animation settings. </para>        
    /// <para> ---------------------------------------------- </para>
    /// <para> speed:Integer -> Animation speed in milliseconds. </para>
    /// <para> ---------------------------------------------- </para>
    /// <para> trickle:Boolean -> Set to false to turn off the trickling (automatic progress increment). True by default. </para>
    /// <para> ---------------------------------------------- </para>
    /// <para> trickeRate:Integer -> How much to increase per trickle.</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> trickleSpeed:Integer -> How often to trickle, in milliseconds.</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> showSpinner:Boolean -> Set to true to turn on the loading spinner. False by default</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> container:String -> jQuery selector of the container DOM element. The progress bar will be PREPENDED TO the container.</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> renderOnInit:Boolean -> Set to true to render the progress bar upon instantiation (though it will remain hidden until the progress is set). False by default.</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> removeOnFinish:Boolean -> Set to true to remove the progress bar from the DOM when it reaches 100%. True by default.</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> randomTrickle:Boolean -> Set to true to use random trickle increments. False by default.</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> startOnInit:Boolean -> Set to true to start running the progress bar's progress upon instantiation. False by default.</para>
    /// <para> ---------------------------------------------- </para>
    /// <para> template:String -> HTML markup used to render the progress bar.</para>
    /// </param>

    var self = this;

    var Settings = {
        minimum: 0.05, /*0.08*/
        easing: 'ease',
        positionUsing: '',
        speed: 200,
        trickle: true,
        trickleRate: 0.02,
        trickleSpeed: 800,
        showSpinner: false,
        container: 'body',
        renderOnInit: false,
        removeOnFinish: true,
        randomTrickle: false,
        startOnInit: false,
        template: '<div class="bar" role="bar"><div class="peg"></div></div>'
    };

    this.settings = $.extend({}, Settings, _settings);

    this.version = '0.1.2';
    this.id = self.settings.container === 'body' ? '#nprogress' + self.settings.container + ' #nprogress';

    //the DOM element itself
    var $progress;

    var paused = false;
    var timeout;

    /**
    * Updates configuration.
    *
    * NProgress.configure({
    * minimum: 0.1
    * });
    */
    this.configure = function (options) {
        $.extend(Settings, options);
        return this;
    };

    /**
    * Last number.
    */
    this.status = null;

    /**
    * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
    *
    * NProgress.set(0.4);
    * NProgress.set(1.0);
    */
    this.set = function (n) {
        var started = self.isStarted();

        n = clamp(n, self.settings.minimum, 1);
        self.status = (n === 1 ? null : n);

        render(!started);
        var $bar = $progress.find('[role="bar"]'),
            speed = self.settings.speed,
            ease = self.settings.easing;

        var dummy = $progress[0].offsetWidth; /* Repaint */

        $progress.queue(function (next) {
            // Set positionUsing if it hasn't already been set
            if (self.settings.positionUsing === '') { self.settings.positionUsing = self.getPositioningCSS(); }

            // Add transition
            $bar.css(barPositionCSS(n, speed, ease));

            if (n === 1) {
                // Fade out
                $progress.css({ transition: 'none', opacity: 1 });
                dummy = $progress[0].offsetWidth; /* Repaint */

                setTimeout(function () {
                    $progress.css({ transition: 'all ' + speed + 'ms linear', opacity: 0 });
                    setTimeout(function () {
                        self.remove();
                        next();
                    }, speed);
                }, speed);
            } else {
                setTimeout(next, speed);
            }
        });

        return this;
    };

    this.isStarted = function () {
        return typeof self.status === 'number' && self.status > 0;
    };

    /**
    * Shows the progress bar.
    * This is the same as setting the status to 0%, except that it doesn't go backwards.
    *
    * NProgress.start();
    */
    this.start = function () {
        self.set(0);

        setTimeout(function () {
            $progress.css({ transition: 'none', opacity: 1 });
        }, 10);

        //start work loop if trickle is set to true
        if (self.settings.trickle) {
            work();
        }

        return this;
    };

    /**
    * Hides the progress bar.
    * This is the *sort of* the same as setting the status to 100%, with the
    * difference being `done()` makes some placebo effect of some realistic motion.
    *
    * NProgress.done();
    *
    * If `true` is passed, it will show the progress bar even if its hidden.
    *
    * NProgress.done(true);
    */
    this.done = function (force) {
        if ((!force && !self.status) || !self.isStarted) { return this; }

        //return self.inc(0.3 + 0.5 * Math.random()).set(1);
        return self.set(1);
    };

    /**
    * Actually it's just a call to `reset`, which stops the progress bar's progress, 
    * regardless of what its current status is. But the name if more intuitive and 
    * the purpose of this is to give the idea that something went wrong and therefore 
    * the progress could not reach the end successfully.
    */
    this.stop = function () {
        self.reset();
    };

    /**
    * Pause the progress bar's progress. It will start running again and pick up 
    * from where it left off by calling `keepGoing`.
    */
    this.pause = function () {
        clearTimeout(timeout);
        paused = true;
    };

    /**
    * Starts running the progress bar's progress again after it's been paused.
    * It picks up status from where it left off.
    */
    this.keepGoing = function () {
        if (paused) {
            paused = false;
            work();
        }
    };

    /**
    * Reset's the progress bar after it's done, so it can start running again anytime.
    */
    this.reset = function () {
        self.status = 0;
        var $bar = $progress.find('[role="bar"]');
        $bar.css(barPositionCSS(0, self.settings.speed, self.settings.easing));
    };

    /**
    * Increments the progress bar by a specific amount.
    */
    this.inc = function (amount) {
        var n = self.status;

        if (!n) {
            return self.start();
        } else {
            if (typeof amount !== 'number') {
                amount = (1 - n) * clamp(self.settings.randomTrickle ? Math.random() * n : n, 0.1, 0.95);
            }

            n = clamp(n + amount, 0, 0.994);
            return self.set(n);
        }
    };

    /**
    * Increments the progress bar by a random amount.
    */
    this.trickle = function () {
        return self.inc(self.settings.randomTrickle ? Math.random() * self.settings.trickleRate : self.settings.trickleRate);
    };

    /**
    * Removes the element. Opposite of render().
    */
    this.remove = function () {
        $('html').removeClass('nprogress-busy');
        if (self.settings.removeOnFinish) {
            //remove progress bar from the DOM
            $progress.remove();
        } else {
            //do not remove it, simply reset it
            self.reset();
        }
    };

    /**
    * Determine which positioning CSS rule to use.
    */
    this.getPositioningCSS = function () {
        //SMB rewritten: use Modernizr to know whether we can use CSS transforms or not
        if (Modernizr.csstransforms) {
            // Modern browsers with CSS3 support, e.g. Webkit, IE9+
            return 'scaleX';
        } else {
            // Browsers without translate() support, e.g. IE7-8
            return 'width';
        }
    };

    /**
    * Runs the progress bar in demo mode.
    */
    this.demo = function () {
        self.set(0);

        setTimeout(function () {
            $progress.css({ transition: 'none', opacity: 1 });
        }, 10);

        work();
    };

    //*********************************
    //* Helpers and Internal methods)
    //*********************************

    /**
    * (internal) renders the progress bar markup based on the `template`
    * setting.
    */
    function render(fromStart) {
        if (isRendered()) { return $progress; }
        $('html').addClass('nprogress-busy');

        $progress = $('<div id="nprogress" class="nprogress"></div>');
        $progress.append($(self.settings.template));

        var perc = fromStart ? 0 : toBarPerc(self.status || 0);

        if (Modernizr.csstransforms) {
            $progress.find('[role="bar"]').css({
                transition: 'all 0 linear',
                transform: 'scaleX(' + perc + ')'
            });
        } else {
            $progress.find('[role="bar"]').css('width', '0%');
        }

        if (!self.settings.showSpinner) {
            $progress.find('[role="spinner"]').remove();
        }

        //finally attach to the DOM
        if (self.settings.container === 'body') {
            //if the container is the body, place progress bar right before it
            $(self.settings.container).before($progress);
            $progress.find('.peg').show();
        } else {
            //otherwise, prepend the progress bar to the container element
            $progress.prependTo(self.settings.container + ':first');
            $progress.css('margin-bottom', '1px');
        }
    }

    /**
    * (internal) checks if the progress bar is rendered.
    */
    function isRendered() {
        return $(self.id + ':first').length > 0;
    }

    /**
    * (internal) returns `min` if `n` is less than `min` 
    * or `max`if `n` is greater than `max`
    * otherwise returns n.
    */
    function clamp(n, min, max) {
        if (n < min) { return min; }
        if (n > max) { return max; }
        return n;
    }

    /**
    * (Internal) converts a percentage (`0..1`) to a bar translateX
    * percentage (`0%..100%`).
    */
    function toBarPerc(n) {
        return n * 100;
    }

    /**
    * (Internal) sets the working loop of the progress bar        
    */
    function work() {
        timeout = setTimeout(function () {
            if (!self.status) { return; }
            self.trickle();
            work();
        }, self.settings.trickleSpeed);
    }

    /**
    * (Internal) returns the correct CSS for changing the bar's
    * position given an n percentage, and speed and ease from Settings
    */
    function barPositionCSS(n, speed, ease) {
        var barCSS;

        if (self.settings.positionUsing === 'scaleX') {
            barCSS = { transform: 'scaleX(' + n + ')' };
        } else {
            barCSS = { 'width': toBarPerc(n) + '%' };
        }

        barCSS.transition = 'all ' + speed + 'ms ' + ease;

        return barCSS;
    }

    //#region Initialization

    if (self.settings.renderOnInit) {
        render(true);
    }

    if (self.settings.startOnInit) {
        self.start();
    }

    //#endregion

    return self;
}
