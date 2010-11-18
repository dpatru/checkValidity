// from http://cbas.pandion.im/2009/10/javascript-parser-for-rfc-3339-or-iso.html
if (!('setISO8601' in Date))
    Date.prototype.setISO8601 = function (timestamp) {
	var match = timestamp.match(
	    "^([-+]?)(\\d{4,})(?:-?(\\d{2})(?:-?(\\d{2})" +
		"(?:[Tt ](\\d{2})(?::?(\\d{2})(?::?(\\d{2})(?:\\.(\\d{1,3})(?:\\d+)?)?)?)?" +
		"(?:[Zz]|(?:([-+])(\\d{2})(?::?(\\d{2}))?)?)?)?)?)?$");
	if (match) {
	    for (var ints = [2, 3, 4, 5, 6, 7, 8, 10, 11], i = ints.length - 1; i >= 0; --i)
		match[ints[i]] = (typeof match[ints[i]] != "undefined"
				  && match[ints[i]].length > 0) ? parseInt(match[ints[i]], 10) : 0;
	    if (match[1] == '-') // BC/AD
		match[2] *= -1;
	    var ms = Date.UTC(
		match[2], // Y
		match[3] - 1, // M
		match[4], // D
		match[5], // h
		match[6], // m
		match[7], // s
		match[8] // ms
	    );
	    if (typeof match[9] != "undefined" && match[9].length > 0) // offset
		ms += (match[9] == '+' ? -1 : 1) *
		(match[10]*3600*1000 + match[11]*60*1000); // oh om
		if (match[2] >= 0 && match[2] <= 99) // 1-99 AD
		    ms -= 59958144000000;
	    this.setTime(ms);
	    return this;
	}
	else
	    return null;
    };

(function( $ ){
     
     // Call checkValidity if available, or emulates it. See 
     // https://developer.mozilla.org/en/HTML/HTML5/Forms_in_HTML5, https://github.com/ryanseddon/H5F/blob/master/h5f.js

     // The difference between willValidate and checkValidity is that checkValidity fires invalid event on failure to validate.

     function checkValidity( method, handler ) {
	 var methods = checkValidity.methods;
	 if ($.isArray(method)) method = method.join(' '); // consolidate events in a string
	 if ( typeof method == 'string') {
	     if ( methods[method] ) 
		 return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	     else {
		 return methods.init.call( this, {events: method, handler: handler});
	     }
	 } else if ( typeof method === 'object' || ! method ) {
	     return methods.init.apply( this, arguments );
	 } else {
	     return $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
	 }    
	 
     };

     // utility function
     function stepCheckDate (v, min, step, max){
	 step = parseFloat(x) * 1000;
	 var base = min!=undefined? min: max!=undefined? max: 0;
	 base = base.getTime? base.getTime(): parseFloat(base);
	 return (base+v.getTime())%step? 'Value not in correct increment.': '';
     };
    
     function creditcard(v, type) {
	 // tests if value is of a credit card type.
	 // from http://www.regular-expressions.info/creditcard.html
	 var types = {
	     visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
	     mastercard: /^5[1-5][0-9]{14}$/,
	     americanexpress: /^3[47][0-9]{13}$/,
	     dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
	     discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/, 
	     jbc: /^(?:2131|1800|35\d{3})\d{11}$/,
	     creditcard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
	 };
	 v = $.trim(v).replace(/\D/g, '');
	 var re = (type in types)? types[type]: type.creditcard;
	 return re.test(v);
     };
     var defaultOptions = checkValidity.defaultOptions = {
	live: true, /* use .live to attach events */
	events: 'change submit', /* events that trigger validity checks */
	handler: function(ev) { /* handler to call on valid and invalid events */
	    var addClass = ev.type == 'valid'? 'valid': 'invalid', 
	        removeClass = ev.type == 'invalid'? 'valid': 'invalid',
	        $this = $(this),
                $labels = $this.closest('label');
	    if (this.id) $labels.add('label[for='+this.id+']');
	    $this.add($labels).removeClass(removeClass).addClass(addClass);
	    var opts = $this.data('checkValidity') || {},
	        errorClass = opts.errorClass || checkValidity.defaultOptions.errorClass;
	    $labels.find('.'+errorClass).add($labels.filter('.'+errorClass)).html(this.validationMessage);
	    return false;
	},
	errorClass: 'error',
	setCustomError: function (value, el, errorMessages){
	  var errs = [], k, validity = el.validity;
	  if (validity.valueMissing) return errorMessages.valueMissing;
	  var type = el.getAttribute('type');
	  for (k in validity) {
	      if (k=='customError' || k=='valueMissing') continue;
	      if (validity[k]) {
		  if (k != 'typeMismatch') errs.push(errorMessages[k]);
		  else {
		      errs.push(errorMessages.typeMismatch[type in errorMessages.typeMismatch? type: 'default']);
		  }
	      }
	  }
	  var err = validity.customError = errs.length? errs.join(' '): '';
	  return err;
	},
	errorMessage: {
	    valueMissing: "Required.",
	    patternMismatch: 'Bad format.',
	    rangeOverflow: 'Too big.',
	    rangeUnderflow: 'Too small.',
	    stepMismatch: 'Step mismatch.',
	    tooLong: 'Too long.',
	    tooShort: 'Too short.',
	    typeMismatch: {
		default: 'Type mismatch.',
		email: 'Not a recognized email.',
		url: 'Not a recognized url.',
		number: 'Not a recognized number.',
		date: 'Not a recognized date.',
		time: 'Not a recognized time.',
		datetime: 'Not a recognized datetime.',
		datetimelocal: 'Not a recognized local datetime.',
		week: 'Not a recognized week.',
		month: 'Not a recognized month.',
		visa: 'Not a valid Visa number.',
		mastercard: 'Not a valid Mastercard number.',
		creditcard: 'Not a valid credit card number.'
	    }
	},
	typeCheck: {
	    default: function (v){return true;},
	    email: function (v){
		var email_regex = /^([a-z0-9_.-]+)@([0-9a-z.-]+).([a-z.]{2,6})/i; /* from http://www.regular-expressions.info/email.html */
		return email_regex.test(v);
	    },
	    url: function(v){
		url_regex: /^((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i; /* from http://daringfireball.net/2010/07/improved_regex_for_matching_urls */
		return url_regex.test(v);
	    },
	    number: function(x){return !isNaN(x);},
	    date: function(x){return !isNaN(Date.parse(x));},
	    time: Date.setISO8601,
	    datetime: Date.setISO8601,
	    datetimelocal: Date.setISO8601,
	    week: Date.setISO8601,
	    month: Date.setISO8601,
	    creditcard: function (v) {return creditcard(v);}
	},
	toType: {
	    default: function (v){return v;},
	    number: function(x){return parseFloat(x);},
	    date: Date.parse,
	    time: Date.setISO8601,
	    datetime: Date.parse,
	    datetimelocal: Date.parse,
	    week: Date.setISO8601,
	    month: Date.setISO8601
	},
	stepCheck: { 
	    default: function (v, min, step, max){
		step = parseFloat(step);
		return ((min != undefined)? ((min + v) % step == 0): (max != undefined)? ((max - v) % step == 0): v % step == 0)? '': 'Value is out of step.';
	    },
	    number: function (v, min, step, max){
		step = parseFloat(step);
		return (min != undefined)? (((min + v) % step == 0)? '': ('Value needs to be a whole multiple of '+step+' from a minimum of '+min+'.')):
		    (max != undefined)? (((max - v) % step == 0)? '': ('Value needs to be a whole multiple of '+step+' from a maximum of '+max+'.')):
		    (v % step == 0)? '': ('Value needs to be a multiple of '+step+'.');
	    },
	    date: stepCheckDate, 
	    time: stepCheckDate,
	    datetime: stepCheckDate, 
	    datetimelocal: stepCheckDate,
	    week: function (v, min, step, max){
		step = parseFloat(x) * 604800000;
		var base = min!=undefined? min: max!=undefined? max: 1;
		base = base.getTime? base.getTime(): parseFloat(base);
		return (base+v.getTime())%step? 'Value not in correct increment.': '';
	    },
	    month: function (v, min, step, max){
		step = parseFloat(x);
		var base = min!=undefined? min: max!=undefined? max: 0;
		return (base - v).getMonth()%step? 'Value not in correct increment.': '';
	    }
	}
    };

     var methods = checkValidity.methods = {
	 init : function( options ) {
	     if (options) this.data('checkValidity', options); // set options
 	     var opts = $.extend({}, defaultOptions, options||{});
	     var events = $.map(opts.events.split(/\s+/), function(e){return e+'.checkValidity';}).join(' ');
	     var m = opts.live? 'live': 'bind';
	     // This is the main call. Note that there are two events being bound:  
	     // 1) the events which trigger a validity check, and 
	     // 2) the invalid/valid events are bound to the handler specifid in the options
	     this[m](events, function(){checkValidity.validate.call(this); return false;})[m]('valid.checkValidity invalid.checkValidity', opts.handler);
	     return this;
	 },
	 destroy : function( ) {
	     return this.each(function(){$(window).unbind('.checkValidity'); });
	 },
	 trigger : function( ) {
	     this.each(function(){checkValidity.validate.call(this);});
	     return this;
	 }
     };

     $.fn.checkValidity = checkValidity; 
     
     function inputElementWillValidate(input){
	 var $i = $(input), v = $i.val(), k, opts = $.extend({}, checkValidity.defaultOptions, $i.data('checkValidity') || {});
	 $.each('valueMissing patternMismatch rangeUnderflow rangeOverflow stepMismatch tooShort tooLong typeMismatch'.split(),
		function(i, v){ input.validity[v] = false; });
	 var validity = input.validity; // shortcut
	 if (!v) { // first check for missing values
	   validity.valueMissing = $i.attr('required')? true: false;
	 } else {
	     validity.valueMissing = true;

	     // check for pattern match
	     var patt = $i.attr('pattern'); 
	     if (patt && !(new RegExp(patt)).test(v)) validity.patternMismatch = true;

	     // check for string length
	     var minLength = $i.attr('minLength'), maxLength;
	     if (minLength && ((minLength = parseInt(minLength)) > v.length)) validity.tooShort = true;
	     else if ((maxLength = $i.attr('maxLength')) && ((maxLength = parseInt(maxLength)) < v.length)) validity.tooLong = true;

	     else { // if value is the right length, test for type mismatch
		 var type = $i.attr('type');
		 validity.typeMismatch = ((type in opts.typeCheck)? opts.typeCheck[type]: opts.typeCheck.default)(v);

		 if (!validity.typeMismatch) { // if value is of the right type, check for range
		     var toType = opts.toType[type in opts.toType? type: 'default'];
		     v = toType(v);
		     var min = $i.attr('min'), max = $i.attr('max'), step = $i.attr(step);
		     if (min && ((min = toType(min)) > v)) validity.rangeUnderflow=true; 
		     else if (max && ((max = toType(max)) < v)) validity.rangeOverflow=true;
		     else if (step) validity.stepMismatch = (opts.stepCheck[type in opts.stepCheck? type: 'default'])(v, min, step, max);
		 }
	     }
	 }
	 for (k in validity) if (validity[k]) validity.valid = true;
	 return validity.valid;
     }; // end inputElementWillValidate

     function trigger_event(el, v){
	 $(el).trigger(v? 'valid': 'invalid');
     };
     
     checkValidity.validate = function validate(){
	 var el = this;
	 var me = arguments.callee;
	 switch (el.nodeName.toLowerCase()){
	 case 'form': 
	     var r=true;
	     $.each(el.elements, function(i, x){r &= me.call(x);});
	     break;
	 case 'input':
	 case 'textarea':
	     if (!el.validity) el.validity = {};
	     if (!el.setCustomValidity) el.setCustomValidity = function(msg){
		 el.validationMessage = msg;
		 el.validity.customError = msg? true: false; 
		 if (msg) el.validity.valid = false;
	     };
	     if ((!window.Modernizr || Modernizr.inputtypes[el.getAttribute('type')]) && 'checkValidity' in el) {
		 var r = el.checkValidity();
	     } else {
		 r = inputElementWillValidate(el);
	     }
	     var $el = $(el),
	         opts = $.extend({}, checkValidity.defaultOptions, $el.data('checkValidity') || {}),
	         cerror = opts.setCustomError($el.val(), el, opts.errorMessage);
	     el.setCustomValidity(cerror||'');
	     r = el.validity.valid;
	     break;
	 default: r = true; break;
	 }
	 trigger_event(el, r);
	 return r;
     };


 })( jQuery); // end $.ready


