import json
import csv
import numpy as np
import pandas as pd
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .authentication import auth_required

FILE = settings.DATA_DIR / 'student_data.json'

def read_students():
    with open(FILE, 'r') as f:
        return json.load(f)

def write_students(data):
    with open(FILE, 'w') as f:
        json.dump(data, f, indent=2)

@api_view(['GET', 'POST'])
@auth_required()
def student_list_create(request):
    if request.method == 'GET':
        return Response(read_students())
    if request.user['role'] != 'admin':
        return Response({'error': 'Admin access required'}, status=403)
    d = request.data
    if not d.get('name') or not d.get('subject'):
        return Response({'error': 'Name and Subject are required'}, status=400)
    students = read_students()
    new_id = max([s['id'] for s in students], default=0) + 1
    student = {
        'id': new_id,
        'name': str(d.get('name')).strip(),
        'subject': str(d.get('subject')).strip(),
        'address': str(d.get('address', '')).strip(),
        'age': int(d.get('age', 0)),
        'marks': round(float(d.get('marks', 0)), 2),
        'grade': str(d.get('grade', 'C'))
    }
    students.append(student)
    write_students(students)
    return Response(student, status=201)

@api_view(['GET', 'PUT', 'DELETE'])
@auth_required()
def student_detail(request, pk):
    students = read_students()
    student = next((s for s in students if s['id'] == pk), None)
    if not student:
        return Response({'error': 'Student not found'}, status=404)
    if request.method == 'GET':
        return Response(student)
    if request.user['role'] != 'admin':
        return Response({'error': 'Admin access required'}, status=403)
    if request.method == 'PUT':
        d = request.data
        student['name'] = str(d.get('name', student['name'])).strip()
        student['subject'] = str(d.get('subject', student['subject'])).strip()
        student['address'] = str(d.get('address', student['address'])).strip()
        student['age'] = int(d.get('age', student['age']))
        student['marks'] = round(float(d.get('marks', student['marks'])), 2)
        student['grade'] = str(d.get('grade', student['grade']))
        write_students(students)
        return Response(student)
    if request.method == 'DELETE':
        students = [s for s in students if s['id'] != pk]
        write_students(students)
        return Response(status=204)

@api_view(['GET'])
@auth_required()
def stats_view(request):
    students = read_students()
    if not students:
        return Response({'total': 0, 'mean': 0, 'max': 0, 'min': 0, 'pass_pct': 0, 'grades': {}})
    df = pd.DataFrame(students)
    marks = df['marks'].to_numpy(dtype=float)
    top_idx = int(np.argmax(marks))
    return Response({
        'total': len(df),
        'mean': round(float(np.mean(marks)), 2),
        'max': round(float(np.max(marks)), 2),
        'min': round(float(np.min(marks)), 2),
        'pass_pct': round(float(np.mean(marks >= 40) * 100), 2),
        'top_student': f"{df.iloc[top_idx]['name']} ({marks[top_idx]})",
        'grades': df['grade'].value_counts().to_dict(),
        'subject_avg': df.groupby('subject')['marks'].mean().round(2).to_dict()
    })

@api_view(['GET'])
@auth_required()
def export_csv_view(request):
    res = HttpResponse(content_type='text/csv')
    res['Content-Disposition'] = 'attachment; filename="students.csv"'
    w = csv.writer(res)
    w.writerow(['ID', 'Name', 'Address', 'Age', 'Marks', 'Grade', 'Subject'])
    for s in read_students():
        w.writerow([s['id'], s['name'], s['address'], s['age'], s['marks'], s['grade'], s['subject']])
    return res
