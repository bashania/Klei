import React from 'react';

const detailSections = [
  {
    title: 'Basis',
    items: [
      ['Projectnaam', 'name'],
      ['Type object', 'objectType'],
      ['Status', 'status'],
      ['Startdatum', 'startDate'],
    ],
  },
  {
    title: 'Klei',
    items: [
      ['Kleisoort', 'clayType'],
      ['Gewicht klei', 'clayWeight'],
      ['Techniek', 'technique'],
      ['Afmetingen vóór bakken', 'sizeBefore'],
      ['Afmetingen na bakken', 'sizeAfter'],
    ],
  },
  {
    title: 'Glazuur',
    items: [
      ['Glazuur 1', 'glazeOne'],
      ['Aantal lagen glazuur 1', 'glazeOneLayers'],
      ['Glazuur 2', 'glazeTwo'],
      ['Aantal lagen glazuur 2', 'glazeTwoLayers'],
    ],
  },
  {
    title: 'Stook',
    items: [
      ['Biscuit temperatuur', 'biscuitTemperature'],
      ['Eindstook temperatuur', 'finalTemperature'],
      ['Stookprogramma / cone', 'firingProgram'],
    ],
  },
  {
    title: 'Resultaat',
    items: [
      ['Resultaatnotities', 'resultNotes'],
      ['Wat ging goed?', 'wentWell'],
      ['Wat moet volgende keer anders?', 'nextTime'],
    ],
  },
];

export default function ProjectView({ project, onBack, onEdit, onDelete }) {
  return (
    <section className="screen detail-screen">
      <nav className="navigation-bar" aria-label="Projectnavigatie">
        <button className="nav-button back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">‹</span> Projecten
        </button>
        <button className="nav-button strong" type="button" onClick={onEdit}>
          Wijzig
        </button>
      </nav>

      <header className="large-title detail-title">
        <span className="status-pill">{project.status}</span>
        <h1>{project.name || 'Project zonder naam'}</h1>
        <p>{project.objectType} · {project.technique} · {formatDetailDate(project.startDate)}</p>
      </header>

      {detailSections.map((section) => (
        <section className="ios-section detail-section" key={section.title}>
          <h2>{section.title}</h2>
          <dl className="ios-list detail-list">
            {section.items.map(([label, key]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{project[key] || 'Niet ingevuld'}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="ios-section">
        <div className="ios-list">
          <button className="destructive-row" type="button" onClick={onDelete}>
          Verwijderen
        </button>
        </div>
      </section>
    </section>
  );
}

function formatDetailDate(dateValue) {
  if (!dateValue) return 'geen startdatum';
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateValue),
  );
}
