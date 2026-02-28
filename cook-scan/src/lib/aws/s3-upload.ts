type PresignFile = { key: string; presignedUrl: string }

type PresignResponse =
  | { success: true; result: { jobId: string; files: PresignFile[] } }
  | { success: false; error: string }

type UploadResult =
  | { success: true; jobId: string; keys: string[] }
  | { success: false; error: string }

const MAX_FILES = 5

/**
 * Presigned URLを一括取得し、複数ファイルをS3にアップロードする（1〜5ファイル）
 * キー形式: uploads/{userId}/{jobId}/{index}
 *
 * @example
 * ```ts
 * const result = await uploadFilesToS3([file1, file2])
 * if (result.success) {
 *   console.log('jobId:', result.jobId, 'keys:', result.keys)
 * }
 * ```
 */
export async function uploadFilesToS3(files: File[]): Promise<UploadResult> {
  if (files.length === 0) {
    return { success: false, error: 'ファイルを1つ以上選択してください' }
  }
  if (files.length > MAX_FILES) {
    return { success: false, error: `アップロードできるファイルは最大${MAX_FILES}枚です` }
  }

  // 1. Presigned URLを一括取得
  const presignRes = await fetch('/api/recipes/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileCount: files.length }),
  })
  const presignData: PresignResponse = await presignRes.json()

  if (!presignRes.ok || !presignData.success) {
    return {
      success: false,
      error: presignData.success === false ? presignData.error : 'Presigned URLの取得に失敗しました',
    }
  }

  const { jobId, files: presignFiles } = presignData.result

  // 2. S3に並列アップロード
  const results = await Promise.all(
    files.map(async (file, i) => {
      const res = await fetch(presignFiles[i].presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      return { ok: res.ok, key: presignFiles[i].key }
    }),
  )

  const failed = results.find((r) => !r.ok)
  if (failed) {
    return { success: false, error: 'S3へのアップロードに失敗しました' }
  }

  return { success: true, jobId, keys: results.map((r) => r.key) }
}
