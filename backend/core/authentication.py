import json
import uuid
from functools import wraps
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

TOKENS = {}

def get_users():
    with open(settings.DATA_DIR / 'users.json') as f:
        return json.load(f)

@api_view(['POST'])
def login_view(request):
    u = request.data.get('username')
    p = request.data.get('password')
    for user in get_users():
        if user['username'] == u and user['password'] == p:
            token = uuid.uuid4().hex
            TOKENS[token] = {'username': user['username'], 'role': user['role']}
            return Response({'token': token, 'role': user['role'], 'username': user['username']})
    return Response({'error': 'Invalid credentials'}, status=401)

def auth_required(roles=None):
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            hdr = request.headers.get('Authorization', '')
            tok = hdr.replace('Bearer ', '').replace('Token ', '').strip()
            user = TOKENS.get(tok)
            if not user:
                return Response({'error': 'Unauthorized'}, status=401)
            if roles and user['role'] not in roles:
                return Response({'error': 'Forbidden'}, status=403)
            request.user = user
            return func(request, *args, **kwargs)
        return wrapper
    return decorator
