import { DevAstroWithNetlifyCmsExecutorSchema } from './schema';
import executor from './executor';

const options: DevAstroWithNetlifyCmsExecutorSchema = {};

describe('DevAstroWithNetlifyCms Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
