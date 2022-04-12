const core = require('@actions/core');
const github = require('@actions/github');

let octokit;

const run = async () => {
	const { pr } = extractInputs();
	console.log(pr);
};
run().catch((err) => {
	core.setFailed(err.message);
});
