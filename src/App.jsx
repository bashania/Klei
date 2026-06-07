import React, { useEffect, useMemo, useState } from 'react';
import { createProject, emptyProject, updateProject } from './projectModel';
import { deletePhoto, deletePhotosForProject, loadPhotos, savePhoto } from './photoStore';
import { loadProjects, saveProjects } from './storage';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectView from './components/ProjectView';

const screens = {
  list: 'list',
  new: 'new',
  view: 'view',
  edit: 'edit',
};

export default function App() {
  const [projects, setProjects] = useState(() => loadProjects());
  const [screen, setScreen] = useState(screens.list);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    loadPhotos().then(setPhotos);
  }, []);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId),
    [projects, activeProjectId],
  );
  const pendingDeleteProject = useMemo(
    () => projects.find((project) => project.id === pendingDeleteId),
    [projects, pendingDeleteId],
  );
  const activeProjectPhotos = useMemo(
    () => photos.filter((photo) => photo.projectId === activeProjectId),
    [photos, activeProjectId],
  );
  const coverPhotosByProject = useMemo(() => {
    return photos.reduce((covers, photo) => {
      if (!covers[photo.projectId]) covers[photo.projectId] = photo;
      return covers;
    }, {});
  }, [photos]);

  function openNewProject() {
    setActiveProjectId(null);
    setScreen(screens.new);
  }

  function openProject(projectId) {
    setActiveProjectId(projectId);
    setScreen(screens.view);
  }

  function saveNewProject(formValues) {
    const project = createProject(formValues);
    setProjects((currentProjects) => [project, ...currentProjects]);
    setActiveProjectId(project.id);
    setScreen(screens.view);
  }

  function saveExistingProject(formValues) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProjectId ? updateProject(project, formValues) : project,
      ),
    );
    setScreen(screens.view);
  }

  async function deleteProject(projectId) {
    await deletePhotosForProject(projectId);
    setPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.projectId !== projectId));
    setProjects((currentProjects) => currentProjects.filter((item) => item.id !== projectId));
    setActiveProjectId(null);
    setPendingDeleteId(null);
    setScreen(screens.list);
  }

  async function addProjectPhoto(photoInput) {
    const photo = await savePhoto({ ...photoInput, projectId: activeProjectId });
    setPhotos((currentPhotos) => [photo, ...currentPhotos]);
  }

  async function removeProjectPhoto(photoId) {
    await deletePhoto(photoId);
    setPhotos((currentPhotos) => currentPhotos.filter((photo) => photo.id !== photoId));
  }

  return (
    <main className="app-shell">
      {screen === screens.list && (
        <ProjectList
          projects={projects}
          coverPhotosByProject={coverPhotosByProject}
          onNew={openNewProject}
          onOpen={openProject}
        />
      )}

      {screen === screens.new && (
        <ProjectForm
          title="Nieuw project"
          initialValues={emptyProject}
          onCancel={() => setScreen(screens.list)}
          onSave={saveNewProject}
        />
      )}

      {screen === screens.view && activeProject && (
        <ProjectView
          project={activeProject}
          photos={activeProjectPhotos}
          onBack={() => setScreen(screens.list)}
          onEdit={() => setScreen(screens.edit)}
          onDelete={() => setPendingDeleteId(activeProject.id)}
          onAddPhoto={addProjectPhoto}
          onDeletePhoto={removeProjectPhoto}
        />
      )}

      {screen === screens.edit && activeProject && (
        <ProjectForm
          title="Project bewerken"
          initialValues={activeProject}
          onCancel={() => setScreen(screens.view)}
          onSave={saveExistingProject}
        />
      )}

      {pendingDeleteId && (
        <div className="modal-backdrop" role="presentation" onClick={() => setPendingDeleteId(null)}>
          <section
            className="confirm-panel"
            aria-labelledby="delete-title"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-title">Project verwijderen?</h2>
            <p>
              {pendingDeleteProject?.name || 'Dit project'} wordt alleen uit dit apparaat verwijderd.
            </p>
            <div className="confirm-actions">
              <button className="ios-button secondary" type="button" onClick={() => setPendingDeleteId(null)}>
                Annuleren
              </button>
              <button className="ios-button destructive filled" type="button" onClick={() => deleteProject(pendingDeleteId)}>
                Verwijderen
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
