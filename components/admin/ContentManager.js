import ConfirmButton from './ConfirmButton';
import { deleteContentAction, saveContentAction } from '@/app/admin/actions';

// Renders an "add new" form plus an editable card per row for a simple content table.
export default function ContentManager({ table, rows, fields, itemLabel }) {
  const renderFields = (row = {}) => (
    <div className="form-grid">
      {fields.map(([key, label, type]) => (
        <div className={`field ${type === 'textarea' ? 'full' : ''}`} key={key}>
          <label>{label}</label>
          {type === 'textarea'
            ? <textarea name={key} className="textarea" defaultValue={row[key] ?? ''} required={key !== 'bio'} />
            : <input name={key} type={type || 'text'} className="input" defaultValue={row[key] ?? (key === 'rating' ? 5 : '')} min={type === 'number' ? 0 : undefined} max={key === 'rating' ? 5 : undefined} />}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <form action={saveContentAction} className="admin-card">
        <h2>Add {itemLabel}</h2>
        <input type="hidden" name="table" value={table} />
        {renderFields()}
        <button className="btn btn-gold" style={{ marginTop: 14 }}>Add {itemLabel}</button>
      </form>
      {rows.map((row) => (
        <div className="admin-card" key={row.id}>
          <form action={saveContentAction}>
            <input type="hidden" name="table" value={table} />
            <input type="hidden" name="id" value={row.id} />
            {renderFields(row)}
            <div className="actions" style={{ marginTop: 14 }}>
              <button className="btn btn-navy btn-sm">Save</button>
            </div>
          </form>
          <form action={deleteContentAction} style={{ marginTop: 8 }}>
            <input type="hidden" name="table" value={table} />
            <input type="hidden" name="id" value={row.id} />
            <ConfirmButton message={`Delete this ${itemLabel.toLowerCase()}?`}>Delete</ConfirmButton>
          </form>
        </div>
      ))}
    </>
  );
}
