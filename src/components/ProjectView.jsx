import React, { useMemo, useRef, useState } from 'react';
import { normalizeProject, statuses } from '../projectModel';
import { readImageFile } from '../photoStore';

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

export default function ProjectView({ project, photos, onBack, onEdit, onDelete, onAddPhoto, onDeletePhoto }) {
  const normalizedProject = normalizeProject(project);
  const glazeLayers = normalizedProject.glazeLayers || [];
  const coverPhoto = photos[0];

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

      <header className={coverPhoto ? 'visual-title has-cover' : 'large-title detail-title'}>
        {coverPhoto && <img src={coverPhoto.imageData} alt="" />}
        <div>
          <span className="status-pill">{normalizedProject.status}</span>
          <h1>{normalizedProject.name || 'Project zonder naam'}</h1>
          <p>{normalizedProject.objectType} · {normalizedProject.technique} · {formatDetailDate(normalizedProject.startDate)}</p>
        </div>
      </header>

      <PhotoTimeline photos={photos} onAddPhoto={onAddPhoto} onDeletePhoto={onDeletePhoto} />

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

function PhotoTimeline({ photos, onAddPhoto, onDeletePhoto }) {
  const fileInputRef = useRef(null);
  const [stage, setStage] = useState('gemaakt');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const sortedPhotos = useMemo(
    () => [...photos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [photos],
  );

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const imageData = await readImageFile(file);
      await onAddPhoto({
        imageData,
        stage,
        note: note.trim(),
        takenAt: new Date().toISOString(),
      });
      setNote('');
      event.target.value = '';
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="ios-section photo-section">
      <div className="section-heading-row">
        <h2>Foto’s</h2>
        <button
          className="add-row-button"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Foto toevoegen"
          disabled={isSaving}
        >
          +
        </button>
      </div>

      <div className="ios-list photo-capture-panel">
        <label className="field" htmlFor="photo-stage">
          <span>Fase</span>
          <select id="photo-stage" value={stage} onChange={(event) => setStage(event.target.value)}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="field" htmlFor="photo-note">
          <span>Notitie</span>
          <input
            id="photo-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Bijv. na glazuurlaag 2"
            autoComplete="off"
          />
        </label>
        <button className="photo-add-button" type="button" onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
          {isSaving ? 'Foto opslaan…' : '+ Foto toevoegen'}
        </button>
        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
      </div>

      {sortedPhotos.length === 0 ? (
        <div className="photo-empty-state">
          <h3>Nog geen foto’s</h3>
          <p>Maak per fase een foto zodat je vorm, krimp, glazuur en eindresultaat visueel kunt vergelijken.</p>
        </div>
      ) : (
        <div className="photo-grid">
          {sortedPhotos.map((photo) => (
            <article className="photo-card" key={photo.id}>
              <img src={photo.imageData} alt={`Foto van fase ${photo.stage}`} />
              <div>
                <span className="status-pill">{photo.stage}</span>
                <p>{photo.note || formatDetailDate(photo.takenAt || photo.createdAt)}</p>
                <button type="button" onClick={() => onDeletePhoto(photo.id)}>
                  Verwijder
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
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
