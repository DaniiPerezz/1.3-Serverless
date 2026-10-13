const API_URL = 'https://p0ou7rjifg.execute-api.us-east-1.amazonaws.com/dev/contact';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.ebook-download-form');
  if (!form) return;
  const status = form.querySelector('#form-status');
  const submitButton = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('ebook-form-name').value.trim();
    const email = document.getElementById('ebook-email').value.trim();
    const interest = document.getElementById('ebook-interest').value.trim();
    const payload = { name, email, interest };

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    status.textContent = 'Enviando solicitud...';
    status.dataset.state = 'pending';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error ?? `No se pudo enviar la solicitud (${response.status}).`);
      }

      status.textContent = result.message ?? 'Solicitud enviada correctamente.';
      status.dataset.state = 'success';
      form.reset();
    } catch (error) {
      status.textContent = error.message === 'Failed to fetch'
        ? 'No se pudo conectar. Comprueba la API y su configuración CORS.'
        : error.message;
      status.dataset.state = 'error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar solicitud';
    }
  });
});