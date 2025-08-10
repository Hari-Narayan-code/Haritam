function setError(field, message) {
  const msgEl = field.parentElement?.querySelector('.field__error');
  if (msgEl) msgEl.textContent = message || '';
  if (message) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
}

function validateContact(form) {
  let ok = true;
  const name = form.querySelector('#c-name');
  const email = form.querySelector('#c-email');
  const message = form.querySelector('#c-message');
  if (name && name.value.trim().length < 2) { setError(name, 'Please enter your full name'); ok = false; } else setError(name, '');
  if (email && !/^\S+@\S+\.\S+$/.test(email.value)) { setError(email, 'Enter a valid email'); ok = false; } else setError(email, '');
  if (message && message.value.trim().length < 10) { setError(message, 'Message should be at least 10 characters'); ok = false; } else setError(message, '');
  return ok;
}

function isValidPhone(value) {
  return /[0-9]{7,}/.test(value.replace(/\D/g, ''));
}

function validateReservation(form) {
  let ok = true;
  const name = form.querySelector('#res-name');
  const contact = form.querySelector('#res-contact');
  const date = form.querySelector('#res-date');
  const time = form.querySelector('#res-time');
  const guests = form.querySelector('#res-guests');

  if (name && name.value.trim().length < 2) { setError(name, 'Please enter your full name'); ok = false; } else setError(name, '');
  if (contact) {
    const v = contact.value.trim();
    const valid = /^\S+@\S+\.\S+$/.test(v) || isValidPhone(v);
    if (!valid) { setError(contact, 'Enter a valid email or phone'); ok = false; } else setError(contact, '');
  }
  if (date) {
    const today = new Date(); today.setHours(0,0,0,0);
    const d = new Date(date.value);
    if (!date.value || d < today) { setError(date, 'Choose a future date'); ok = false; } else setError(date, '');
  }
  if (time) {
    if (!time.value) { setError(time, 'Select a time'); ok = false; }
    else {
      const [hh, mm] = time.value.split(':').map(Number);
      const mins = hh * 60 + mm;
      const opens = 11 * 60 + 30; // 11:30
      const closes = 22 * 60 + 30; // 22:30
      if (mins < opens || mins > closes) { setError(time, 'Time must be between 11:30 and 22:30'); ok = false; } else setError(time, '');
    }
  }
  if (guests) {
    const n = Number(guests.value);
    if (Number.isNaN(n) || n < 1 || n > 12) { setError(guests, 'Guests 1–12 only'); ok = false; } else setError(guests, '');
  }
  return ok;
}

export function initForms() {
  // default smart date/time
  document.querySelectorAll('#res-date').forEach((el) => {
    if (el instanceof HTMLInputElement && !el.value) {
      const dt = new Date(Date.now() + 2 * 60 * 60 * 1000); // +2h
      el.valueAsDate = dt;
      el.setAttribute('min', new Date().toISOString().split('T')[0]);
    }
  });

  const resForm = document.getElementById('reservation-form');
  if (resForm instanceof HTMLFormElement) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateReservation(resForm)) {
        const success = document.getElementById('reservation-success');
        if (success) success.hidden = false;
        resForm.reset();
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateContact(contactForm)) {
        const success = document.getElementById('contact-success');
        if (success) success.hidden = false;
        contactForm.reset();
      }
    });
  }
}