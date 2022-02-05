# Extract Issue number from PR merge commit
A composition action to extract issue number from the branch name on a merge commit.

This assumes branch is named in the format `ISSUE_<issue number>`

so a a merge commit to merge ISSUE_123, `issue-number` will be 123.

## Outputs

### `issue-number`

Issue number extracted


### Example Workflow
```
on:
  push:
    branches:
      - master

jobs:
  getIssueNumber:
    runs-on: ubuntu-latest
    steps:
      - name: Parse commit message for issue number
        uses: carmenfan/extract-issue-number-from-PR-merge@v1.0
        with:
          commit-message: ${{ github.event.commits[0].message }}

```
