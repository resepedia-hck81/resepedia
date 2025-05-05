'use server';

export async function uploadToCatbox(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file) {
    throw new Error('No file uploaded');
  }

  const catboxForm = new FormData();
  catboxForm.append('reqtype', 'fileupload');
  catboxForm.append('userhash', process.env.CATBOX_USER_HASH!);
  catboxForm.append('fileToUpload', file);
  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: catboxForm,
  });

  const url = await response.text();
  if (!url.startsWith('https://')) {
    throw new Error(`Upload failed: ${url}`);
  }
  return { url };
}
