(function($) {
  function tinymce4_init(selector) {
    console.log(selector);
    var el = document.querySelector(selector);
    console.log(el);
    var mce_conf = JSON.parse(el.dataset.mceConf);

    // There is no way to pass a JavaScript function as an option
    // because all options are serialized as JSON.
    const fns = [
      'color_picker_callback',
      'file_browser_callback',
      'file_picker_callback',
      'images_dataimg_filter',
      'images_upload_handler',
      'paste_postprocess',
      'paste_preprocess',
      'setup',
      'urlconverter_callback',
    ];
    fns.forEach((fn_name) => {
      if (typeof mce_conf[fn_name] != 'undefined') {
        if (mce_conf[fn_name].includes('(')) {
          mce_conf[fn_name] = eval('(' + mce_conf[fn_name] + ')');
        }
        else {
          mce_conf[fn_name] = window[mce_conf[fn_name]];
        }
      }
    });
    
    mce_conf['setup'] = function (editor) {
        editor.on('change', function () {
          editor.save();
        });
    }
    if (typeof selector != 'undefined') {
      mce_conf['selector'] = selector;
    }

    tinymce.init(tinymce_conf);
  } // End tinymce4_init

  $(function() {
    // initialize all tinymce editors on click instead of on load
    $('.tinymce4-editor').on('click', function(elem){
      tinymce4_init(elem.tagName + '#' + elem.id)
    })

    // Add TinyMCE 4 widgets to textaras inside a node
    function add_editors(node) {
      $(node).find('.tinymce4-editor').each(function(i, elem) {
        if ($(elem).css('display') != 'none' && elem.id.indexOf('__prefix__') == -1) {
          $(elem).on('click', function(){
            tinymce4_init(this.tagName + '#' + this.id);
          });
        }
      });
    }

    // Remove TinyMCE 4 widgets from textareas inside a node
    function remove_editors(node) {
      $(node).find('.tinymce4-editor').each(function(i, elem) {
        $(tinymce.EditorManager.editors).each(function(i, editor) {
          if (editor.id == elem.id) {
            editor.remove();
          }
        });
      });
    }

    // Restore consistency of TinyMCE 4 widgets
    function refresh_editors() {
      $(tinymce.EditorManager.editors).each(function(i, editor) {
        var elem = editor.getElement();
        if (editor.id != elem.id) {
          editor.remove();
          tinymce4_init(elem.tagName + '#' + elem.id);
        }
      });
    }

    // Use MutationObserver to track adding or removing Django admin inline formsets
    // to add adn remove TinyMCE editor widgets.
    var observer = new MutationObserver(function(mutations) {
      $(mutations).each(function(i, mutation) {
        $(mutation.addedNodes).each(function(i, node) {
          // Add TinyMCE widgets to new textareas.
          add_editors(node);
        }); // End addedNodes
        $(mutation.removedNodes).each(function(i, node) {
          // Remove TinyMCE widgets from textareas inside removed nodes.
          remove_editors(node);
          // Refresh remaining TinyMCE widgets to return them to consistent state
          // After removing an inline formset, Django admin scripts
          // change IDs of remaining textareas,
          // so textarea ID != ID of the TinyMCE instance attached to it.
          refresh_editors();
        }); // End removedNodes
      }); // End mutations
    }); // End MutationObserver

    $('div.inline-group').each(function (index, node) {
        observer.observe(node, { childList: true, subtree: true })
    });
  }); // End document.ready
})(django.jQuery);
