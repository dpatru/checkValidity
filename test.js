// testing for checkValidity
$(document).ready(function testCheckValidity($){

  $('textarea.eg').each(function codeMirrorize(i, el){
    var html_id = 'html'+i;
    $(el).after('<iframe src="javascript:;" id="'+html_id+'"></iframe>');
    var html_el = $('#'+html_id)[0];
    var editor = CodeMirror.fromTextArea(el, {
      parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
      path: "codemirror/js/",
      stylesheet: ["https://github.com/marijnh/CodeMirror/raw/master/css/xmlcolors.css", "https://github.com/marijnh/CodeMirror/raw/master/css/jscolors.css", "https://github.com/marijnh/CodeMirror/raw/master/css/csscolors.css"],
      height:"dynamic",
      onChange: update_html,
      onLoad: function(ed){alert(1); editor = ed; update_html();},
      iframeClass: 'source',
      minHeight: '10'
    });
    function update_html(ed){
	if (ed) editor = ed;
	window.alert('1');
      $('body', html_el.contentDocument).html(editor.getCode());
      var height = $(html_el).contents().find('html').height();
      $(html_el).height($(html_el).contents().find("html").height());
    };

  });
});