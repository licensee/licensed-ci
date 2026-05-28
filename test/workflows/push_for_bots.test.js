import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sinon from 'sinon';
import { core, exec } from '../../lib/actions.js';
import utils from '../../lib/utils.js';
import branch from '../../lib/workflows/branch.js';
import push from '../../lib/workflows/push.js';
import pushForBots from '../../lib/workflows/push_for_bots.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const processEnv = process.env;

describe('branch workflow', () => {
  const branchName = 'branch';

  beforeEach(() => {
    sinon.stub(core, 'info');
    sinon.stub(exec, 'exec').resolves(128);

    sinon.stub(utils, 'getBranch').returns(branchName);
    
    sinon.stub(push, 'run');
    sinon.stub(branch, 'run');
  });

  afterEach(() => {
    process.env = processEnv;
    sinon.restore();
  });

  it('runs the branch workflow if a licenses branch exists', async () => {
    exec.exec.resolves(0);
  
    await pushForBots.run();

    expect(branch.run.callCount).toEqual(1);
    expect(branch.run.getCall(0).args).toEqual([]);
    expect(push.run.callCount).toEqual(0);

    expect(core.info.callCount).toEqual(1);
    expect(core.info.getCall(0).args).toEqual(['Detected licenses branch, choosing branch workflow']);
  });

  it('runs the branch workflow when run from a licenses branch', async () => {
    utils.getBranch.returns(`${branch}-licenses`);

    await pushForBots.run();

    expect(branch.run.callCount).toEqual(1);
    expect(branch.run.getCall(0).args).toEqual([]);
    expect(push.run.callCount).toEqual(0);

    expect(core.info.callCount).toEqual(1);
    expect(core.info.getCall(0).args).toEqual(['Detected licenses branch, choosing branch workflow']);
  });

  it('runs the branch workflow if the account triggering the action is not a bot', async () => {
    process.env.GITHUB_EVENT_PATH = path.normalize(path.join(__dirname, '..', 'fixtures', 'push_for_bots_user_payload.json'));

    await pushForBots.run();

    expect(branch.run.callCount).toEqual(1);
    expect(branch.run.getCall(0).args).toEqual([]);
    expect(push.run.callCount).toEqual(0);

    expect(core.info.callCount).toEqual(1);
    expect(core.info.getCall(0).args).toEqual(['Detected user context, choosing branch workflow']);
  });

  it('runs the push workflow for bots triggering actions with no licenses branch', async () => {
    process.env.GITHUB_EVENT_PATH = path.normalize(path.join(__dirname, '..', 'fixtures', 'push_for_bots_bot_payload.json'));
    
    await pushForBots.run();

    expect(push.run.callCount).toEqual(1);
    expect(push.run.getCall(0).args).toEqual([]);
    expect(branch.run.callCount).toEqual(0);

    expect(core.info.callCount).toEqual(1);
    expect(core.info.getCall(0).args).toEqual(['Detected no licenses branch and Bot context, choosing push workflow']);
  });
});
