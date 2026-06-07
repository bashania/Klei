import React, { useMemo, useState } from 'react';
import { statuses } from '../projectModel';

function formatDate(dateValue) {
  if (!dateValue) return 'Geen startdatum';
  return new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(dateValue),
  );
}

export default function ProjectList({ projects, onNew, onOpen }) {
  const [activeStatus, setActiveStatus] = useState('alle');
  const visibleProjects = useMemo(() => {
    if (activeStatus === 'alle') return projects;
    return projects.filter((project) => project.status === activeStatus);
  }, [activeStatus, projects]);

  return (
    <section className="screen list-screen">
      <nav className="navigation-bar" aria-label="Hoofdnavigatie">
        <span className="nav-title">Keramieklogboek</span>
        <button className="icon-button" type="button" onClick={onNew} aria-label="Nieuw project">
          +
        </button>
      </nav>

      <header className="large-title">
        <h1>Projecten</h1>
        <p>{projects.length === 1 ? '1 project' : `${projects.length} projecten`}</p>
      </header>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h2>Nog geen projecten</h2>
          <p>Leg vorm, klei, glazuur, stook en resultaat vast op het moment dat je ermee bezig bent.</p>
          <button className="ios-button filled" type="button" onClick={onNew}>
            Nieuw project
          </button>
        </div>
      ) : (
        <>
          <div className="status-filter" aria-label="Filter op status">
            {['alle', ...statuses].map((status) => (
              <button
                className={status === activeStatus ? 'active' : ''}
                key={status}
                type="button"
                onClick={() => setActiveStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="ios-list project-list">
            {visibleProjects.map((project) => (
            <button
              className="project-row"
              key={project.id}
              type="button"
              onClick={() => onOpen(project.id)}
            >
              <span className="project-row-main">
                <span className="project-row-title">{project.name || 'Project zonder naam'}</span>
                <span className="project-row-subtitle">
                  {project.objectType} · {project.clayType || 'Geen klei'} · {formatDate(project.startDate)}
                </span>
              </span>
              <span className="project-row-side">
                <span className="status-pill">{project.status}</span>
                <span className="chevron" aria-hidden="true">›</span>
              </span>
            </button>
          ))}

            {visibleProjects.length === 0 && (
              <p className="empty-filter">Geen projecten met deze status.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
