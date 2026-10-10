export const REPO_URL = 'https://github.com/soolame/awaaz'

export const ADD_POST_URL = `${REPO_URL}/issues/new?template=add-post.yml`
export const CORRECTION_URL = `${REPO_URL}/issues/new?template=correction.md`

export function addPostUrlFor(creatorName: string): string {
  return `${ADD_POST_URL}&title=${encodeURIComponent(`Post from ${creatorName}`)}`
}
