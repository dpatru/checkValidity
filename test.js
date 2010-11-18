// testing for checkValidity
$(document).ready(function testCheckValidity($){

  $('textarea.eg').each(function codeMirrorize(i, el){
    var html_id = 'html'+i;
    $(el).after('<button class="'+html_id+'">Update</button><br/><iframe src="javascript:;" id="'+html_id+'"></iframe>');
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
    function update_html(ed){
      alert(editor.getCode());
      $('body', html_el.contentDocument).html(editor.getCode()); // set the content of the iframe
      $(html_el).height($(html_el).contents().find("html").height()); // set the height of the iframe dynamically.
      $('button.'+html_id).attr('disabled', true); // disable the update button because the iframe has already been updated.
    };

  });
});