// tests/contato.happy.spec.ts
import { test, expect } from '@playwright/test';

test('envio de contato (happy path) mostra toast de sucesso', async ({ page }) => {
  // Mock da rota que o formulário chama de verdade
  await page.route('**/api/send-contact', route =>
    route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    })
  );

  await page.goto('/#contato');

  // Preenche campos
  await page.locator('#contato-nome').scrollIntoViewIfNeeded();
  await page.fill('#contato-nome', 'Fulano da Silva');

  await page.locator('#contato-telefone').scrollIntoViewIfNeeded();
  await page.fill('#contato-telefone', '+5511999999999');

  await page.locator('#contato-email').scrollIntoViewIfNeeded();
  await page.fill('#contato-email', 'fulano@example.com');

  await page.locator('#contato-mensagem').scrollIntoViewIfNeeded();
  await page.fill('#contato-mensagem', 'Gostaria de falar com a equipe.');

  const lgpd = page.getByRole('checkbox', { name: /Autorizo o tratamento/i });
  await lgpd.scrollIntoViewIfNeeded();
  await lgpd.check();

  const enviar = page.getByRole('button', { name: 'Enviar' });
  await enviar.scrollIntoViewIfNeeded();

  // Clique + esperar pela RESPONSE da rota mockada
  await Promise.all([
    page.waitForResponse(resp =>
      resp.url().includes('/api/send-contact') &&
      resp.request().method() === 'POST'
    ),
    enviar.click(),
  ]);

  // Validar o toast
  await expect(page.getByRole('alert')).toContainText('Mensagem enviada com sucesso!', {
    timeout: 10000,
  });
});
