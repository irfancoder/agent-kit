import { expect, test, unique } from 'e2e';

test('a user adds an item and sees it in the list', async ({ app, agent, screen }) => {
  await app.open('/');
  await expect(screen.getByRole('heading', { name: 'Items' })).toBeVisible();

  const name = `Groceries ${Date.now()}`;
  // agent.act gets through the flow; the expect assertions below decide pass or fail.
  await agent.act('add an item named {name}', { params: { name: unique(name) } });

  await expect(screen.getByRole('list', { name: 'Items' })).toContainText(name);
  await expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
});
