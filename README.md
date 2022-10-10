# Extract content ID from issue number
An action to extract the content_id for github projects from an issue number

## Outputs

### `content-id`

node_id extracted


### Example Workflow
```
on:
  push:
    branches:
      - master

jobs:
  getContentID:
    runs-on: ubuntu-latest
    steps:
      - name: Parse commit message for issue number
        uses: keifgwinn/extract-content-id-from-issue-number@v1.0
        with:
          issue-number: ${{ github.event.number }}

```
