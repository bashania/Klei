const STORAGE_KEY = 'keramiek-logboek-projecten-v1';

export function loadProjects() {
  try {
    const rawProjects = localStorage.getItem(STORAGE_KEY);
    return rawProjects ? JSON.parse(rawProjects) : [];
  } catch (error) {
    console.warn('Projecten konden niet worden geladen uit localStorage.', error);
    return [];
  }
}

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
