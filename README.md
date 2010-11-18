****** checkValidity html5 ******
CheckValidity attempts to implement form validation using html5 markup. The aim
to allow html5_forms that validate even in browsers that don't yet support
html5.
CheckValidity defines a checkValidity method on jQuery.fn which, when called
with no arguments, installs two .live handlers.
The first .live handler catches changes and submit events on input and form
elements. The handler sets the validity property on the element. After setting
the validity property, the handler triggers an 'invalid' event if the element
is in an invalid state. If the element is in a valid state, the handler fires a
non-standard 'valid' event.
The second .live handler catches invalid and valid events on input and form
elements. The handler sets a valid/invalid class on the elements. If the event
is 'invalid', the handler also fills in the .error element in the label for the
element.
CheckValidity can also be called with arguments for additional functionality.
See the documentation.
