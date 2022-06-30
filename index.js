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

	if (merged && prData.data.base.ref === 'staging') {
		const match = prData.data.head.ref.match(/ISSUE_(\d+)/i);
		if (match.length > 1) {
			const issueNum = match[1];
			core.setOutput('issue-number', issueNum);
		} else {
			console.log(`could not extract issue number from ${prData.data.head.ref}`);
		}
	} else {
		console.log(`${merged ? 'PR not merged' : 'base is not staging'}. No action needed`);
	}
};
run().catch((err) => {
	core.setFailed(err.message);
});
