const core = require('@actions/core');
const github = require('@actions/github');

let octokit;

const extractInputs = () => {
	const pr = parseInt(core.getInput('pr'), 10);

	const token = core.getInput('github-token');
	octokit = github.getOctokit(token);

	return { pr };
};

const getPR = () => async (prNum) => {
	try {
		const payload = {
			owner: github.context.payload.repository.owner.name,
			repo: github.context.payload.repository.name,
			pull_number: prNum,

		};
		const [isMerged, prData] = await Promise.all([
			octokit.rest.pulls.checkIfMerged(payload),
			octokit.rest.pulls.get(payload),
		]);

		console.log(isMerged, prData.base, prData.head);
	} catch ({ message }) {
		throw new Error(`Failed to find PR: ${message}`);
	}
};

const run = async () => {
	const { pr } = extractInputs();
	const prData = await getPR(pr);
};
run().catch((err) => {
	core.setFailed(err.message);
});
