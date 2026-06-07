import React, { useState } from 'react';
import { normalizeProject, objectTypes, statuses, techniques } from '../projectModel';

const sections = [
  {
    title: 'Basis',
    fields: [
      { name: 'name', label: 'Projectnaam', type: 'text', required: true },
      { name: 'objectType', label: 'Type object', type: 'select', options: objectTypes },
      { name: 'status', label: 'Status', type: 'select', options: statuses },
      { name: 'startDate', label: 'Startdatum', type: 'date' },
    ],
  },
  {
    title: 'Klei',
    fields: [
      { name: 'clayType', label: 'Kleisoort', type: 'text' },
      { name: 'clayWeight', label: 'Gewicht klei', type: 'text', placeholder: 'Bijv. 650 g' },
      { name: 'technique', label: 'Techniek', type: 'select', options: techniques },
      { name: 'sizeBefore', label: 'Afmetingen vóór bakken', type: 'text', placeholder: 'Bijv. 9 x 11 cm' },
      { name: 'sizeAfter', label: 'Afmetingen na bakken', type: 'text', placeholder: 'Bijv. 8,4 x 10,2 cm' },
    ],
  },
  {
    title: 'Stook',
    fields: [
      { name: 'biscuitTemperature', label: 'Biscuit temperatuur', type: 'text', placeholder: 'Bijv. 950 °C' },
      { name: 'finalTemperature', label: 'Eindstook temperatuur', type: 'text', placeholder: 'Bijv. 1240 °C' },
      { name: 'firingProgram', label: 'Stookprogramma / cone', type: 'text' },
    ],
  },
  {
    title: 'Resultaat',
    fields: [
      { name: 'resultNotes', label: 'Resultaatnotities', type: 'textarea' },
      { name: 'wentWell', label: 'Wat ging goed?', type: 'textarea' },
      { name: 'nextTime', label: 'Wat moet volgende keer anders?', type: 'textarea' },
    ],
  },
];

export default function ProjectForm({ title, initialValues, onCancel, onSave }) {
  const [formValues, setFormValues] = useState(() => normalizeProject(initialValues));
  const canSave = formValues.name.trim().length > 0;

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(formValues);
  }

  function addGlazeLayer() {
    setFormValues((currentValues) => ({
      ...currentValues,
      glazeLayers: [...(currentValues.glazeLayers || []), { glaze: '', layers: '' }],
    }));
  }

  function updateGlazeLayer(index, field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      glazeLayers: (currentValues.glazeLayers || []).map((layer, layerIndex) =>
        layerIndex === index ? { ...layer, [field]: value } : layer,
      ),
    }));
  }

  function removeGlazeLayer(index) {
    setFormValues((currentValues) => ({
      ...currentValues,
      glazeLayers: (currentValues.glazeLayers || []).filter((_, layerIndex) => layerIndex !== index),
    }));
  }

  return (
    <form className="screen form-screen" onSubmit={handleSubmit}>
      <nav className="navigation-bar" aria-label="Projectformulier">
        <button className="nav-button" type="button" onClick={onCancel}>
          Annuleer
        </button>
        <span className="nav-title">{title}</span>
        <button className="nav-button strong" type="submit" disabled={!canSave}>
          Opslaan
        </button>
      </nav>

      <header className="large-title form-title">
        <h1>{title}</h1>
        <p>Vul alleen in wat je nu weet. Je kunt later altijd aanvullen.</p>
      </header>

      {sections.map((section) => (
        <section className="ios-section" key={section.title}>
          <h2>{section.title}</h2>
          <div className="ios-list form-list">
            {section.fields.map((field) => (
              <Field key={field.name} field={field} value={formValues[field.name] ?? ''} onChange={updateField} />
            ))}
          </div>
          {section.title === 'Klei' && (
            <GlazeLayersSection
              layers={formValues.glazeLayers || []}
              onAdd={addGlazeLayer}
              onRemove={removeGlazeLayer}
              onUpdate={updateGlazeLayer}
            />
          )}
        </section>
      ))}
    </form>
  );
}

function Field({ field, value, onChange }) {
  const sharedProps = {
    id: field.name,
    name: field.name,
    value,
    onChange,
    required: field.required,
    placeholder: field.placeholder,
    autoComplete: 'off',
  };

  return (
    <label className={`field ${field.type === 'textarea' ? 'textarea-field' : ''}`} htmlFor={field.name}>
      <span>{field.label}</span>
      {field.type === 'select' && (
        <select {...sharedProps}>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {field.type === 'textarea' && <textarea {...sharedProps} rows="4" />}
      {field.type !== 'select' && field.type !== 'textarea' && (
        <input {...sharedProps} type={field.type} min={field.min} inputMode={field.type === 'number' ? 'numeric' : undefined} />
      )}
    </label>
  );
}

function GlazeLayersSection({ layers, onAdd, onRemove, onUpdate }) {
  return (
    <section className="ios-section glaze-section">
      <div className="section-heading-row">
        <h2>Glazuur</h2>
        <button className="add-row-button" type="button" onClick={onAdd} aria-label="Glazuurlaag toevoegen">
          +
        </button>
      </div>

      {layers.length === 0 ? (
        <button className="empty-add-row" type="button" onClick={onAdd}>
          <span aria-hidden="true">+</span>
          Glazuurlaag toevoegen
        </button>
      ) : (
        <div className="ios-list glaze-list">
          {layers.map((layer, index) => (
            <div className="glaze-layer" key={index}>
              <div className="glaze-layer-title">
                <span>Laag {index + 1}</span>
                <button type="button" onClick={() => onRemove(index)} aria-label={`Glazuurlaag ${index + 1} verwijderen`}>
                  Verwijder
                </button>
              </div>
              <label className="field" htmlFor={`glaze-${index}`}>
                <span>Glazuur</span>
                <input
                  id={`glaze-${index}`}
                  value={layer.glaze}
                  onChange={(event) => onUpdate(index, 'glaze', event.target.value)}
                  placeholder="Bijv. Celadon groen"
                  autoComplete="off"
                />
              </label>
              <label className="field" htmlFor={`glaze-layers-${index}`}>
                <span>Aantal lagen</span>
                <input
                  id={`glaze-layers-${index}`}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={layer.layers}
                  onChange={(event) => onUpdate(index, 'layers', event.target.value)}
                  placeholder="Bijv. 3"
                  autoComplete="off"
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
