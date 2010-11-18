// testing for checkValidity
$(document).ready(function testCheckValidity($){

  $('textarea.eg').each(function codeMirrorize(i, el){
    var html_id = 'html'+i;
    $(el).after('<iframe src="javascript:;" id="'+html_id+'"></iframe>');
    var html_el = $('#'+html_id)[0];
    var editor = CodeMirror.fromTextArea(el, {
      parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
      path: "codemirror/js/",
      stylesheet: ["codemirror/css/xmlcolors.css", "codemirror/css/jscolors.css", "codemirror/css/csscolors.css"],
      height:"dynamic",
      onChange: update_html,
      onLoad: update_html,
      iframeClass: 'source',
      minHeight: '10'
    });
    function update_html(ed){
	if (ed) editor = ed;
      $('body', html_el.contentDocument).html(editor.getCode());
      var height = $(html_el).contents().find('html').height();
      $(html_el).height($(html_el).contents().find("html").height());
    };

  });
});