import * as core from '@actions/core'
import { syncTemplate } from './sync-template'
import { createPullRequest } from './create-pull-request'

export const splitPattern = (pattern: string): string[] => {
  return pattern
    .split(/(?<!\s"\w*)\s(?!\w*"\s)/)
    .map(item => item.replaceAll(/^"|"$/g, ''))
    .filter(item => item !== '')
}

async function run(): Promise<void> {
  try {
    const token = core.getInput('repo_token')
    const targetRepository = core.getInput('target_repository')
    const targetBranch: string = core.getInput('target_branch') || 'main'
    const branchName: string =
      core.getInput('branch_name') || 'sync-template-repository'
    const baseBranch: string = core.getInput('base_branch') || 'main'
    const includePatterns: string[] = splitPattern(
      core.getInput('include_patterns')
    ).filter(pattern => pattern !== '') || ['**/*']
    const excludePatterns: string[] =
      splitPattern(core.getInput('exclude_patterns')).filter(
        pattern => pattern !== ''
      ) || []

    const result = await syncTemplate({
      includePatterns,
      excludePatterns,
      baseBranch,
      branchName,
      targetRepository,
      targetBranch
    })
    if (result.isNothingToCommit) {
      return
    }
    await createPullRequest({
      token,
      branchName,
      baseBranch,
      targetRepository,
      targetBranch
    })
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
