import { exec } from '@actions/exec'

interface SyncTemplateOptions {
  includePatterns: string[]
  excludePatterns: string[]
  baseBranch: string
  branchName: string
  targetRepository: string
  targetBranch: string
}
interface SyncTemplateResult {
  isNothingToCommit: boolean
}

export const syncTemplate = async ({
  includePatterns,
  excludePatterns,
  baseBranch,
  branchName,
  targetRepository,
  targetBranch
}: SyncTemplateOptions): Promise<SyncTemplateResult> => {
  await exec('git', ['fetch', '--all'])
  await exec('git', [
    'checkout',
    '-t',
    '-b',
    baseBranch,
    `origin/${baseBranch}`
  ])
  await exec('git', ['checkout', '-b', branchName])
  await exec('git', [
    'remote',
    'add',
    'template',
    `https://github.com/${targetRepository}.git`
  ])
  await exec('git', ['fetch', '--no-tags', 'template'])
  await exec('git', [
    'diff',
    '--output=update.patch',
    '--full-index',
    branchName,
    `template/${targetBranch}`
  ])
  await exec('git', ['apply', 'update.patch'])
  await exec('rm', ['update.patch'])
  await exec('git', ['config', 'user.name', 'github-actions'])
  await exec('git', ['config', 'user.email', 'github-actions@github.com'])
  await exec('git', [
    'add',
    ...includePatterns.map(pattern => `:(glob)${pattern}`),
    ...excludePatterns.map(pattern => `:(glob,exclude)${pattern}`),
    ':(glob,exclude).github/workflows'
  ])
  try {
    await exec('git', [
      'commit',
      '-m',
      `Sync code with https://github.com/${targetRepository}/tree/${targetBranch}`
    ])
  } catch {
    return {
      isNothingToCommit: true
    }
  }
  await exec('git', ['push', '-f', '--set-upstream', 'origin', branchName])
  await exec('git', ['checkout', '.'])

  return {
    isNothingToCommit: false
  }
}
