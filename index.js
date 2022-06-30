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
		const payload = {
			owner: 'carmenfan', // github.context.payload.repository.owner.name,
			repo: 'TowerDefence', // github.context.payload.repository.name,
			pull_number: prNum,

		};

		console.log('what is going on?!');

		console.log('!!!PR num is ', prNum);
		const content = await Promise.all([
			//			octokit.rest.pulls.checkIfMerged(payload),
			//			octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}?state=all', payload),
			octokit.rest.pulls.list(payload),
		]);
		console.log('returning', content);
		return content;
	} catch ({ message }) {
		throw new Error(`Failed to find PR: ${message}`);
	}
};

const run = async () => {
	console.log('Extracting inputs?');
	const { pr } = extractInputs();
	console.log('Get PR');
	const res = await getPR(pr);
	console.log('got PR', res);
};
run().catch((err) => {
	core.setFailed(err.message);
});
