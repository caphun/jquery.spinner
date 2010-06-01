(function($) {

// shortcut constants
var hover = 'ui-state-hover',
	active = 'ui-state-active',
	uiSpinnerClasses = 'ui-spinner ui-state-default ui-widget ui-widget-content ui-corner-all ';

// define spinner method
$.extend( $.fn, {
	spinner: function( options ) {
		return this.each( function() {
			new $.spinner( this, options );
		});
	}
});

// add special number filter for HTML5 support
$.extend( $.expr[":"], {
	number: function( elem ) { 
		type = 'number';
		return type === this.type // for browsers that understand the expression
			|| new RegExp('type="'+ type +'"').test($("<div/>").append($(elem).clone()).html()); // catch others by inspection
	}
});

// plugin constructor
$.spinner = function( input, options ) {
	
	// deep extend
	this.options = $.extend( true, {}, $.spinner.defaults, options );
	
	// this is the original element
	this.element = $( input );
	
	// let's get going!
	this.init();
}

// plugin extensions
$.extend($.spinner, {

	// plugin defaults
	defaults: {
		groupSeparator: ',',
		radixPoint: '.',
		precision: 0,
		prefix: '',
		suffix: '',
		dir: 'ltr',
		page: 5,
		step: 1
	},

	// keycode hash
	keyCode: {
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38
	},

	// ignore these key codes
	// (i.e. the spinner will simply let these pass through without inspection)
	ignoreCode: function() {
		var c = $.spinner.keyCode;
		return [c.TAB,
			c.BACKSPACE,
			c.LEFT,
			c.RIGHT,
			c.PERIOD,
			c.NUMPAD_DECIMAL,
			c.NUMPAD_SUBTRACT
		]
	},

	// plugin prototypes
	prototype: {

		// initialize
		init: function() {

			var self = this;

			// cosmetics
			this.element
				.addClass( 'ui-spinner-input' )
				.attr( 'autocomplete', 'off' ) // switch off autocomplete in opera
				.wrap( this.widgetHtml() )
				.parent()
					.append( this.buttonsHtml() );

			// event bindings on element
			this.element
				.bind( 'keydown', function( event ) {
					var keyCode = $.spinner.keyCode;

					// step-up on UP
					if ( event.keyCode === keyCode.UP ) {
						return self.spin( self.options.step );
					}

					// step-down on DOWN
					if ( event.keyCode === keyCode.DOWN ) {
						return self.spin( -self.options.step );
					}

					// page-up on PAGE_UP
					if ( event.keyCode === keyCode.PAGE_UP ) {
						return self.spin( self.options.page );
					}

					// page-down on PAGE_DOWN
					if ( event.keyCode === keyCode.PAGE_DOWN ) {
						return self.spin( -self.options.page );
					}

					// last line filtering
					return ( ( event.keyCode >= 96 && event.keyCode <= 105 ) // numeric keypad 0-9
						|| ( /[0-9\.]/ ).test( String.fromCharCode( event.keyCode ) ) 
						|| $.inArray( event.keyCode, $.spinner.ignoreCode() ) !== -1 );
				});

			this.widget = this.element.parent();
			this.buttons = this.widget.find('.ui-spinner-button');

			this.buttons.bind( 'click', function() {
				self.spin( $( this ).hasClass( 'ui-spinner-up' ) ? self.options.step : -self.options.step );
			});

		},

		// widget container (the outer stuff around the spinner)
		widgetHtml: function() {
			return '<div role="spinbutton" class="' + uiSpinnerClasses + 
					' ui-spinner-' + this.options.dir + 
					'"></div>';
		},

		// button controls
		buttonsHtml: function() {
			return '<a class="ui-spinner-button ui-spinner-up ui-state-default ui-corner-t' + this.options.dir.substr( -1, 1 ) + 
					'"><span class="ui-icon ui-icon-triangle-1-n">&#9650;</span></a>' +
					'<a class="ui-spinner-button ui-spinner-down ui-state-default ui-corner-b' + this.options.dir.substr( -1, 1 ) + 
					'"><span class="ui-icon ui-icon-triangle-1-s">&#9660;</span></a>';
		},
		
		// converts a humanized number into a machine-readable number
		parse: function( val ) {
			if ( typeof val == 'string' ) {
				val = val.replace( this.options.radixPoint, '.' ).replace( /[^0-9\.]/, '' );
			}
			return isNaN( val ) ? null : val;
		},

		// pretty-up a machine-readable number
		format: function( num ) {
			var regex = /(\d+)(\d{3})/,
				options = this.options,
				prefix = options.prefix || '',
				suffix = options.suffix || '',
				dec = options.precision,
				radix = 10,
				group = options.groupSeparator,
				pt = options.radixPoint,
				neg = num < 0 ? '-' : '';

			for (
				num = (
					isNaN( num )
						? options.value
						: radix === 10
							? parseFloat( num, radix ).toFixed( dec ) 
							: parseInt( num, radix )
					).toString( radix ).replace( '.', pt );
				regex.test( num ) && group;
				num = num.replace( regex, '$1'+group+'$2' )
			);

			result = num.replace( '-', '' );
			this.element.val( neg + prefix + result + suffix );
		},

		// increment/decrement stored value
		spin: function( val ) {
			var value  = this.value();
			this.value( parseFloat( value || 0 ) + parseFloat( val ) );
		},

		// get/set the spinner value
		value: function( val ) {
			if ( val === undefined ) {
				return this.element.val();
			}
			return this.element.val( val );
		}
	}
});

})( jQuery );