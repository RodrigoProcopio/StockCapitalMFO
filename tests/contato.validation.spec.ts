// tests/contato.validation.spec.ts
import { test, expect } from '@playwright/test';

test('mostra aviso quando faltam campos obrigatórios', async ({ page }) => {
  // Mock da rota que o formulário chama de verdade
  await page.route('**/api/send-contact', route =>
    route.fulfill({
      status: 400,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        error: 'Campos obrigatórios ausentes.',
        missing: ['nome', 'email'],
      }),
    })
  );

  await page.goto('/#contato');

  // Preenche só a mensagem e aceita LGPD
  await page.locator('#contato-mensagem').scrollIntoViewIfNeeded();
  await page.fill('#contato-mensagem', 'Teste de validação');

  const lgpd = page.getByRole('checkbox', { name: /Autorizo o tratamento/i });
  await lgpd.scrollIntoViewIfNeeded();
  await lgpd.check();

  const enviar = page.getByRole('button', { name: 'Enviar' });
  await enviar.scrollIntoViewIfNeeded();

  // Clique + aguardar request
  await Promise.all([
    page.waitForRequest('**/api/send-contact'),
    enviar.click(),
  ]);

  // Confere o toast construído do payload mockado
  await expect(page.getByRole('alert')).toContainText('Preencha', {
    timeout: 10000,
  });
});
