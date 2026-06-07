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
      <header className="detail-header">
        <button className="text-button" type="button" onClick={onBack}>
          Terug
        </button>
        <span className="status-pill">{project.status}</span>
        <h1>{project.name || 'Project zonder naam'}</h1>
        <p>{project.objectType} · {project.technique}</p>
      </header>

      {detailSections.map((section) => (
        <section className="detail-section" key={section.title}>
          <h2>{section.title}</h2>
          <dl>
            {section.items.map(([label, key]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{project[key] || 'Niet ingevuld'}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <div className="sticky-actions">
        <button className="danger-button" type="button" onClick={onDelete}>
          Verwijderen
        </button>
        <button className="primary-button" type="button" onClick={onEdit}>
          Bewerken
        </button>
      </div>
    </section>
  );
}
