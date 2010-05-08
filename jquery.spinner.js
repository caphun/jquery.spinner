(function($) {
	
	$.fn.spinner = function(options) {
		
		options = $.extend({}, $.spinner.defaults, options);
		
		return this.each(function() {
			$.spinner(this, options);
		});
	}
	
	$.spinner = function(elem, options) {
		
	}
	
	$.spinner.defaults = {
		
	}
	
})(jQuery);