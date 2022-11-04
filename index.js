const core = require('@actions/core');
const github = require('@actions/github');

let octokit;
const initOcto = () => {
	const token = core.getInput('github-token');
	octokit = github.getOctokit(token);
};

const extractInputs = () => {
	const issueNumber = parseInt(core.getInput('issue-number'), 10);
	return { issueNumber };
};

const getIssue = async (issueNumber) => {
	try {
		const { owner } = github.context.payload.repository;
		const payload = {
			owner: owner.name ?? owner.login,
			repo: github.context.payload.repository.name,
			issue_number: issueNumber,
		};

		const content = await Promise.all([
			octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', payload),
		]);
		return content;
	} catch ({ message }) {
		throw new Error(`Failed to find Issue: ${message}`);
	}
};

const run = async () => {
	initOcto();

	const { issueNumber } = extractInputs();

	if (!issueNumber) {
		throw new Error('Issue number not provided');
	}

	const [issueData] = await getIssue(issueNumber);
	console.log('"debugging issue data"')
	console.log(issueData)
	if (issueData.data.node_id) {
		core.setOutput('content-id', issueData.data.node_id);
	} else {
		console.log(`${!issueData.node_id ? '' : 'help?'}. No action needed`);
	}
};
run().catch((err) => {
	core.setFailed(err.message);
});
