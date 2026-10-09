# System Verification Test
import urllib.request, json

BASE = 'http://127.0.0.1:8000'

def req(url, method='GET', data=None, token=None):
    headers = {'Content-Type': 'application/json'}
    if token: headers['Authorization'] = f'Bearer {token}'
    r = urllib.request.Request(url, data=json.dumps(data).encode() if data else None, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as res:
            b = res.read().decode()
            try: return res.getcode(), json.loads(b)
            except: return res.getcode(), b
    except urllib.error.HTTPError as e:
        b = e.read().decode()
        try: return e.code, json.loads(b)
        except: return e.code, b

print('--- SYSTEM TEST ---')
# 1. Frontend Web Files
c, h = req(f'{BASE}/'); assert c == 200 and 'Student Performance Tracker' in h
c, css = req(f'{BASE}/style.css'); assert c == 200 and 'box-sizing' in css
c, js = req(f'{BASE}/app.js'); assert c == 200 and 'API_BASE' in js
print('[PASS] Web assets served successfully')

# 2. Authentication
c, _ = req(f'{BASE}/api/login/', 'POST', {'username': 'wrong', 'password': '123'}); assert c == 401
c, u_res = req(f'{BASE}/api/login/', 'POST', {'username': 'user', 'password': 'user123'})
assert c == 200 and u_res['role'] == 'user'
u_tok = u_res['token']
print('[PASS] User login & token auth verified')

# 3. User Read & RBAC Protection
c, st = req(f'{BASE}/api/students/', 'GET', token=u_tok); assert c == 200 and isinstance(st, list)
c, stats = req(f'{BASE}/api/stats/', 'GET', token=u_tok); assert c == 200 and 'mean' in stats
c, csv_data = req(f'{BASE}/api/export/csv/', 'GET', token=u_tok); assert c == 200 and 'ID,Name,Address' in csv_data
c, _ = req(f'{BASE}/api/students/', 'POST', {'name': 'Test'}, token=u_tok); assert c == 403
print('[PASS] User read access and RBAC 403 enforcement verified')

# 4. Admin CRUD
c, a_res = req(f'{BASE}/api/login/', 'POST', {'username': 'admin', 'password': 'admin123'})
assert c == 200 and a_res['role'] == 'admin'
a_tok = a_res['token']

new_s = {'name': 'Test Student', 'subject': 'Math', 'address': '123 Test St', 'age': 20, 'marks': 95.0, 'grade': 'A'}
c, created = req(f'{BASE}/api/students/', 'POST', new_s, token=a_tok); assert c == 201
sid = created['id']
c, detail = req(f'{BASE}/api/students/{sid}/', 'GET', token=a_tok); assert c == 200
new_s['marks'] = 99.0
c, updated = req(f'{BASE}/api/students/{sid}/', 'PUT', new_s, token=a_tok); assert c == 200
c, del_res = req(f'{BASE}/api/students/{sid}/', 'DELETE', token=a_tok); assert c == 204 or c == 200
c, _ = req(f'{BASE}/api/students/{sid}/', 'GET', token=a_tok); assert c == 404
print('[PASS] Admin full CRUD operations verified')

print('ALL TESTS PASSED SUCCESSFULLY (15/15)!')
