import React, { useState } from 'react';
import { objectTypes, statuses, techniques } from '../projectModel';

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
    title: 'Glazuur',
    fields: [
      { name: 'glazeOne', label: 'Glazuur 1', type: 'text' },
      { name: 'glazeOneLayers', label: 'Aantal lagen glazuur 1', type: 'number', min: '0' },
      { name: 'glazeTwo', label: 'Glazuur 2', type: 'text' },
      { name: 'glazeTwoLayers', label: 'Aantal lagen glazuur 2', type: 'number', min: '0' },
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
  const [formValues, setFormValues] = useState(initialValues);

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(formValues);
  }

  return (
    <form className="screen form-screen" onSubmit={handleSubmit}>
      <header className="page-header">
        <div>
          <p className="eyebrow">Project</p>
          <h1>{title}</h1>
        </div>
      </header>

      {sections.map((section) => (
        <section className="form-section" key={section.title}>
          <h2>{section.title}</h2>
          {section.fields.map((field) => (
            <Field key={field.name} field={field} value={formValues[field.name] ?? ''} onChange={updateField} />
          ))}
        </section>
      ))}

      <div className="sticky-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Annuleren
        </button>
        <button className="primary-button" type="submit">
          Opslaan
        </button>
      </div>
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
  };

  return (
    <label className="field" htmlFor={field.name}>
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
        <input {...sharedProps} type={field.type} min={field.min} />
      )}
    </label>
  );
}
