import branchWorkflow from './branch.js';
import pushWorkflow from './push.js';
import pushForBotsWorkflow from './push_for_bots.js';

const workflows = {
  branch: branchWorkflow.run,
  push: pushWorkflow.run,
  push_for_bots: pushForBotsWorkflow.run
};

export default workflows;
