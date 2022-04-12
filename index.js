const core = require('@actions/core');
const github = require('@actions/github');

// let octokit;

const extractInputs = () => {
	const pr = parseInt(core.getInput('pr'), 10);

	/* const token = core.getInput('github-token');
	octokit = github.getOctokit(token);
	*/
	return { pr };
};

const run = async () => {
	const { pr } = extractInputs();
	console.log(pr);
};
run().catch((err) => {
	core.setFailed(err.message);
});
