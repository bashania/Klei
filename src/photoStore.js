const DATABASE_NAME = 'keramiek-logboek-media';
const DATABASE_VERSION = 1;
const STORE_NAME = 'photos';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('projectId', 'projectId');
        store.createIndex('createdAt', 'createdAt');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction(mode, callback) {
  return openDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = callback(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => reject(transaction.error);
      }),
  );
}

export async function loadPhotos() {
  try {
    const photos = await runTransaction('readonly', (store) => store.getAll());
    return photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.warn('Foto’s konden niet worden geladen uit IndexedDB.', error);
    return [];
  }
}

export async function savePhoto(photo) {
  const now = new Date().toISOString();
  const photoRecord = {
    ...photo,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  await runTransaction('readwrite', (store) => store.add(photoRecord));
  return photoRecord;
}

export async function deletePhoto(photoId) {
  await runTransaction('readwrite', (store) => store.delete(photoId));
}

export async function deletePhotosForProject(projectId) {
  const photos = await loadPhotos();
  await Promise.all(
    photos.filter((photo) => photo.projectId === projectId).map((photo) => deletePhoto(photo.id)),
  );
}

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
