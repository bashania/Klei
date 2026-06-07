export const objectTypes = ['mok', 'kom', 'vaas', 'bord', 'schaal', 'sculptuur', 'anders'];
export const statuses = ['idee', 'gemaakt', 'biscuit gebakken', 'geglazuurd', 'eindstook', 'klaar'];
export const techniques = ['draaien', 'handopbouw', 'gieten', 'anders'];

export const emptyProject = {
  name: '',
  objectType: 'mok',
  status: 'idee',
  startDate: '',
  clayType: '',
  clayWeight: '',
  technique: 'draaien',
  sizeBefore: '',
  sizeAfter: '',
  glazeLayers: [],
  biscuitTemperature: '',
  finalTemperature: '',
  firingProgram: '',
  resultNotes: '',
  wentWell: '',
  nextTime: '',
};

export function normalizeProject(project) {
  if (Array.isArray(project.glazeLayers)) return project;

  const glazeLayers = [
    { glaze: project.glazeOne || '', layers: project.glazeOneLayers || '' },
    { glaze: project.glazeTwo || '', layers: project.glazeTwoLayers || '' },
  ].filter((layer) => layer.glaze || layer.layers);

  return {
    ...project,
    glazeLayers,
  };
}

export function createProject(formValues) {
  const now = new Date().toISOString();

  return {
    ...formValues,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
}

export function updateProject(project, formValues) {
  return {
    ...project,
    ...formValues,
    updatedAt: new Date().toISOString(),
  };
}
