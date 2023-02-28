import { ExecutorContext, runExecutor } from '@nrwl/devkit';

export interface MultipleExecutorOptions {}

export default async function multipleExecutor(
  options: MultipleExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const result = await Promise.race([
    await runExecutor(
      { project: 'website', target: 'serve' },
      { watch: true },
      context
    ),
    await runExecutor(
      { project: 'website', target: 'netlify-cms-proxy' },
      { watch: true },
      context
    ),
  ]);
  for await (const res of result) {
    if (!res.success) return res;
  }

  return { success: true };
}
