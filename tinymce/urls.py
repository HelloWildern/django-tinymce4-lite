from django.conf.urls import url
from .views import spell_check, filebrowser, css, spell_check_callback, tinymce_init

urlpatterns = [
    url(r'^spellchecker/$', spell_check, name='tinymce-spellchecker'),
    url(r'^filebrowser/$', filebrowser, name='tinymce-filebrowser'),
    url(r'^tinymce-init/$', tinymce_init, name='tinymce-init'),
    url(r'^tinymce4.css', css, name='tinymce-css'),
    url(r'^spellcheck-callback.js', spell_check_callback, name='tinymce-spellcheck-callback')
]
