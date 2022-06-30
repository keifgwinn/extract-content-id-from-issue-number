const core = require('@actions/core');
const github = require('@actions/github');

let octokit;

const extractInputs = () => {
	const pr = 15; // parseInt(core.getInput('pr'), 10);

	const token = core.getInput('github-token');
	octokit = github.getOctokit(token);

	return { pr };
};

const getPR = async (prNum) => {
	try {
		const { owner } = github.context.payload.repository;
		const payload = {
			owner: owner.name ?? owner.login,
			repo: github.context.payload.repository.name,
			pull_number: prNum,

		};

		const content = await Promise.all([
			octokit.rest.pulls.checkIfMerged(payload).then(() => true).catch(() => false),
			octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}?state=all', payload),
		]);
		return content;
	} catch ({ message }) {
		throw new Error(`Failed to find PR: ${message}`);
	}
};

const run = async () => {
	const { pr } = extractInputs();
	if (!pr) {
		throw new Error('PR number not provided');
	}

	const [merged, prData] = await getPR(pr);

	console.log(prData.data.head, prData.data.base);
};
run().catch((err) => {
	core.setFailed(err.message);
});
