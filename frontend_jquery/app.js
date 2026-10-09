// Student Performance Tracker - jQuery client
const API_BASE = 'http://127.0.0.1:8000/api';
let user = JSON.parse(localStorage.getItem('user') || 'null');
let students = [];

const headers = () => user ? { 'Authorization': 'Bearer ' + user.token } : {};

function notify(msg, type = 'success') {
  $('#alert-box').html(`<div class="alert alert-${type} py-1 px-3 mb-2 small">${msg}</div>`).removeClass('d-none');
  setTimeout(() => $('#alert-box').addClass('d-none'), 3000);
}

function checkAuth() {
  if (user) {
    $('#login-section').addClass('d-none');
    $('#dashboard-section, #nav-user').removeClass('d-none');
    $('#user-display').text(user.username);
    $('#role-display').text(user.role.toUpperCase());
    user.role === 'admin' ? $('#form-card, #th-actions').removeClass('d-none') : $('#form-card, #th-actions').addClass('d-none');
    loadStats();
    loadStudents();
  } else {
    $('#login-section').removeClass('d-none');
    $('#dashboard-section, #nav-user').addClass('d-none');
  }
}

function loadStats() {
  $.get({ url: API_BASE + '/stats/', headers: headers(), success: d => {
    $('#stat-mean').text(d.mean); $('#stat-max').text(d.max); $('#stat-min').text(d.min);
    $('#stat-pass').text(d.pass_pct + '%'); $('#total-count').text(d.total);
    $('#grade-summary').html(Object.entries(d.grades || {}).map(([g, c]) => `<span class="badge bg-light text-dark border me-1">${g}: ${c}</span>`).join(''));
  }});
}

function loadStudents() {
  $.get({ url: API_BASE + '/students/', headers: headers(), success: data => { students = data; renderTable(); }});
}

function renderTable() {
  const q = ($('#search-input').val() || '').toLowerCase();
  const g = $('#filter-grade').val();
  const list = students.filter(s => (s.name.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q)) && (!g || s.grade === g));
  const tbody = $('#student-tbody').empty();
  if (!list.length) return tbody.append(`<tr><td colspan="8" class="text-center text-muted py-3">No records found.</td></tr>`);

  list.forEach(s => {
    const act = user && user.role === 'admin' ? `<td class="text-end"><button class="btn btn-outline-primary btn-sm py-0 edit-btn" data-id="${s.id}">Edit</button><button class="btn btn-outline-danger btn-sm py-0 ms-1 delete-btn" data-id="${s.id}">Delete</button></td>` : '';
    tbody.append(`<tr data-student='${JSON.stringify(s)}'><td>${s.id}</td><td class="fw-bold">${s.name}</td><td>${s.subject}</td><td>${s.age}</td><td>${s.marks}</td><td class="fw-bold text-dark">${s.grade}</td><td>${s.address}</td>${act}</tr>`);
  });
}

$(document).ready(function() {
  checkAuth();

  $('#login-form').submit(function(e) {
    e.preventDefault();
    $.ajax({ url: API_BASE + '/login/', type: 'POST', contentType: 'application/json',
      data: JSON.stringify({ username: $('#username').val(), password: $('#password').val() }),
      success: res => { user = res; localStorage.setItem('user', JSON.stringify(res)); checkAuth(); notify('Logged in!'); },
      error: () => notify('Invalid credentials', 'danger')
    });
  });

  $('#logout-btn').click(() => { user = null; localStorage.removeItem('user'); checkAuth(); notify('Logged out', 'info'); });
  $('#search-input, #filter-grade').on('input change', renderTable);

  $('#student-form').submit(function(e) {
    e.preventDefault();
    const id = $('#student-id').val();
    const data = { name: $('#name').val(), subject: $('#subject').val(), address: $('#address').val(), age: parseInt($('#age').val()), marks: parseFloat($('#marks').val()), grade: $('#grade').val() };
    $.ajax({ url: id ? `${API_BASE}/students/${id}/` : `${API_BASE}/students/`, type: id ? 'PUT' : 'POST', contentType: 'application/json', headers: headers(), data: JSON.stringify(data),
      success: () => { this.reset(); $('#student-id').val(''); $('#form-heading').text('Add Student'); $('#cancel-btn').addClass('d-none'); notify('Saved!'); loadStudents(); loadStats(); },
      error: xhr => notify(xhr.responseJSON?.error || 'Save error', 'danger')
    });
  });

  $(document).on('click', '.edit-btn', function() {
    const s = JSON.parse($(this).closest('tr').attr('data-student'));
    $('#student-id').val(s.id); $('#name').val(s.name); $('#subject').val(s.subject); $('#address').val(s.address); $('#age').val(s.age); $('#marks').val(s.marks); $('#grade').val(s.grade);
    $('#form-heading').text(`Edit Student #${s.id}`); $('#cancel-btn').removeClass('d-none');
  });

  $('#cancel-btn').click(function() { $('#student-form')[0].reset(); $('#student-id').val(''); $('#form-heading').text('Add Student'); $(this).addClass('d-none'); });

  $(document).on('click', '.delete-btn', function() {
    const id = $(this).data('id');
    if (confirm(`Delete #${id}?`)) $.ajax({ url: `${API_BASE}/students/${id}/`, type: 'DELETE', headers: headers(), success: () => { notify('Deleted!'); loadStudents(); loadStats(); } });
  });
});
