# sync-template-repository

## Usage

See [action.yml](action.yml)

Scheduled sync:

```yaml
name: Sync template repository

on:
  schedule:
    # Sync monthly
    - cron: '0 0 1 * *'
permissions:
  contents: write
  pull-requests: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: besna-institute/sync-template-repository@v1
        with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          target_repository: 'besna-institute/sync-template-repository'
          include_patterns: 'src/**'
          exclude_patterns: 'tests/** docs/**'
```

Manual sync:

```yaml
name: Sync template repository

on:
  workflow_dispatch:
    inputs:
      include_patterns:
        type: string
      exclude_patterns:
        type: string

permissions:
  contents: write
  pull-requests: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: besna-institute/sync-template-repository@v1
        with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          target_repository: 'besna-institute/sync-template-repository'
          include_patterns: ${{ inputs.include_patterns }}
          exclude_patterns: ${{ inputs.exclude_patterns }}
```
