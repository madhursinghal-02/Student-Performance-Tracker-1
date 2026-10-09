# Root URL configuration
from pathlib import Path
from django.urls import path, include, re_path
from django.http import HttpResponse, FileResponse

JQUERY_DIR = Path(__file__).resolve().parent.parent.parent / 'frontend_jquery'

def serve_frontend(request, filename='index.html'):
    target = (JQUERY_DIR / (filename or 'index.html')).resolve()
    if target.exists() and target.is_file():
        content_type = 'text/html'
        if target.suffix == '.css':
            content_type = 'text/css'
        elif target.suffix == '.js':
            content_type = 'application/javascript'
        return FileResponse(open(target, 'rb'), content_type=content_type)
    return HttpResponse('Not found', status=404)

urlpatterns = [
    path('api/', include('core.urls')),
    path('', lambda r: serve_frontend(r, 'index.html'), name='home'),
    re_path(r'^(?P<filename>[^/]+\.(?:html|css|js))$', serve_frontend, name='static_files'),
]
