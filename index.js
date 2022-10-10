const core = require('@actions/core');
const github = require('@actions/github');

let octokit;
const initOcto = () => {
	const token = core.getInput('github-token');
	octokit = github.getOctokit(token);
}

const extractInputs = () => {
	const issueNum = parseInt(core.getInput('issue-number'), 10);
	return { issueNum };
};

const getIssue = async (issueNum) => {
	try {
		const { owner } = github.context.payload.repository;
		const payload = {
			owner: owner.name ?? owner.login,
			repo: github.context.payload.repository.name,
			issue_number: issueNum,
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

	const { issueNum } = extractInputs();
	
	if (!issueNum) {
		throw new Error('Issue number not provided');
	}

	const [issueData] = await getIssue(issueNum);

	if ( issueData.node_id ) {
		core.setOutput('content-id', issueData.node_id );
	} else {
		console.log(`${!issueData.node_id ? '' : `base is not ${base}`}. No action needed`);
	}
};
run().catch((err) => {
	core.setFailed(err.message);
});
