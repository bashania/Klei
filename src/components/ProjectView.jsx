import React from 'react';
import { normalizeProject } from '../projectModel';

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
  const normalizedProject = normalizeProject(project);
  const glazeLayers = normalizedProject.glazeLayers || [];

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
        <span className="status-pill">{normalizedProject.status}</span>
        <h1>{normalizedProject.name || 'Project zonder naam'}</h1>
        <p>{normalizedProject.objectType} · {normalizedProject.technique} · {formatDetailDate(normalizedProject.startDate)}</p>
      </header>

      {detailSections.map((section) => (
        <section className="ios-section detail-section" key={section.title}>
          <h2>{section.title}</h2>
          <dl className="ios-list detail-list">
            {section.items.map(([label, key]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{normalizedProject[key] || 'Niet ingevuld'}</dd>
              </div>
            ))}
          </dl>
          {section.title === 'Klei' && <GlazeLayersDetail layers={glazeLayers} />}
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

function GlazeLayersDetail({ layers }) {
  return (
    <div className="nested-detail-section">
      <h2>Glazuur</h2>
      <dl className="ios-list detail-list">
        {layers.length === 0 ? (
          <div>
            <dt>Glazuurlagen</dt>
            <dd>Niet ingevuld</dd>
          </div>
        ) : (
          layers.map((layer, index) => (
            <div key={`${layer.glaze}-${index}`}>
              <dt>Laag {index + 1}</dt>
              <dd>
                {layer.glaze || 'Glazuur niet ingevuld'}
                {layer.layers ? ` · ${layer.layers} laag${layer.layers === '1' ? '' : 'en'}` : ''}
              </dd>
            </div>
          ))
        )}
      </dl>
    </div>
  );
}

function formatDetailDate(dateValue) {
  if (!dateValue) return 'geen startdatum';
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(dateValue),
  );
}
