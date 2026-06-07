import React from 'react';

function formatDate(dateValue) {
  if (!dateValue) return 'Geen startdatum';
  return new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(dateValue),
  );
}

export default function ProjectList({ projects, onNew, onOpen }) {
  return (
    <section className="screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Keramieklogboek</p>
          <h1>Projecten</h1>
        </div>
        <button className="primary-button compact" type="button" onClick={onNew}>
          Nieuw project
        </button>
      </header>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h2>Nog geen projecten</h2>
          <p>Leg je eerste vorm, klei, glazuur en stook vast.</p>
          <button className="primary-button" type="button" onClick={onNew}>
            Nieuw project
          </button>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <button
              className="project-card"
              key={project.id}
              type="button"
              onClick={() => onOpen(project.id)}
            >
              <span className="status-pill">{project.status}</span>
              <h2>{project.name || 'Project zonder naam'}</h2>
              <dl>
                <div>
                  <dt>Object</dt>
                  <dd>{project.objectType}</dd>
                </div>
                <div>
                  <dt>Start</dt>
                  <dd>{formatDate(project.startDate)}</dd>
                </div>
                <div>
                  <dt>Klei</dt>
                  <dd>{project.clayType || 'Niet ingevuld'}</dd>
                </div>
              </dl>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
