// testing for checkValidity
$(document).ready(function testCheckValidity($){

  $('textarea.eg').each(function codeMirrorize(i, el){
    var html_id = 'html'+i;
    $(el).after('<button class="'+html_id+'">Reload html</button><br/><iframe class="output" src="javascript:;" height="0px" id="'+html_id+'"></iframe>');
    var html_el = $('#'+html_id)[0];
    var editor = CodeMirror.fromTextArea(el, {
      parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
      path: "codemirror/js/",
      stylesheet: ["codemirror/css/xmlcolors.css", "codemirror/css/jscolors.css", "codemirror/css/csscolors.css"],
      height:"dynamic",
      onChange: function(){$('button.'+html_id).attr('disabled', false);},
      onLoad: function (ed) { 
	  editor = ed; // set the editor (the global editor variable is not set yet.)
	  update_html();
	  $('button.'+html_id).click(update_html);
	  },
      iframeClass: 'source',
      minHeight: '10'
    });
    function setHeight(){
      var height = $(html_el).contents().find('html').height();
      $(html_el).height(height); // set the height of the iframe dynamically.
    };
    function setContent(c){
	var w = html_el.contentWindow;
        w.document.open();
        w.document.write(c);
        w.document.close();
	setHeight();
    };
    function update_html(){
      setContent('<!doctype html><head><title>Empty</title></head><div></div>');
      setContent(editor.getCode());
      $('button.'+html_id).attr('disabled', true); // disable the update button because the iframe has already been updated.
    };

  });
});