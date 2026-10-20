'use client';

import { useState } from 'react';
import { useFormAction } from '@/components/useFormAction';
import { savePropertyAction } from '@/app/admin/actions';
import { AREA_UNITS, CITIES, PROPERTY_TYPES, SOCIETIES, formatPrice } from '@/lib/format';

export default function PropertyForm({ property }) {
  const [state, action, pending] = useFormAction(savePropertyAction);
  const [price, setPrice] = useState(property?.price ?? '');
  const [previews, setPreviews] = useState([]);
  const p = property || {};
  const err = state?.errors || {};
  const firstImage = p.images?.[0]?.id;

  return (
    <form onSubmit={action}>
      {state?.error && <div className="alert alert-error">{state.error}</div>}
      {p.id && <input type="hidden" name="id" value={p.id} />}

      <div className="admin-card">
        <h2>Basic information</h2>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" className="input" defaultValue={p.title} placeholder="e.g. 1 Kanal Designer House in DHA Phase 2" required />
            {err.title && <span className="form-error">{err.title}</span>}
          </div>
          <div className="field">
            <label htmlFor="purpose">Purpose</label>
            <select id="purpose" name="purpose" className="select" defaultValue={p.purpose || 'sale'}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="property_type">Property type</label>
            <select id="property_type" name="property_type" className="select" defaultValue={p.property_type || 'house'}>
              {Object.entries(PROPERTY_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="price">Price (PKR{'; monthly rent for rentals'})</label>
            <input id="price" name="price" type="number" min="1" className="input" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <span className="hint">{price ? formatPrice(price) : 'Enter the full amount, e.g. 45000000'}</span>
            {err.price && <span className="form-error">{err.price}</span>}
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" className="select" defaultValue={p.status || 'available'}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Location & size</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="city">City</label>
            <select id="city" name="city" className="select" defaultValue={p.city || 'Islamabad'}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="society">Society / area</label>
            <input id="society" name="society" className="input" list="societies" defaultValue={p.society} required />
            <datalist id="societies">{SOCIETIES.map((s) => <option key={s} value={s} />)}</datalist>
            {err.society && <span className="form-error">{err.society}</span>}
          </div>
          <div className="field full">
            <label htmlFor="location">Full location</label>
            <input id="location" name="location" className="input" defaultValue={p.location} placeholder="Sector, phase, street" />
          </div>
          <div className="field">
            <label htmlFor="area_value">Area</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input id="area_value" name="area_value" type="number" step="0.01" min="0" className="input" defaultValue={p.area_value} required />
              <select name="area_unit" className="select" defaultValue={p.area_unit || 'marla'} style={{ width: 130 }}>
                {Object.entries(AREA_UNITS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            {err.area_value && <span className="form-error">{err.area_value}</span>}
          </div>
          <div className="field">
            <label>Bedrooms / Bathrooms</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input name="bedrooms" type="number" min="0" className="input" defaultValue={p.bedrooms ?? 0} aria-label="Bedrooms" />
              <input name="bathrooms" type="number" min="0" className="input" defaultValue={p.bathrooms ?? 0} aria-label="Bathrooms" />
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Description & features</h2>
        <div className="form-grid">
          <div className="field full">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" className="textarea" rows={6} defaultValue={p.description} />
          </div>
          <div className="field full">
            <label htmlFor="features">Features (one per line)</label>
            <textarea id="features" name="features" className="textarea" defaultValue={(p.features || []).join('\n')} placeholder={'Corner plot\nSolar installed'} />
          </div>
          <div className="field full">
            <label htmlFor="video_url">YouTube video tour (optional)</label>
            <input id="video_url" name="video_url" className="input" defaultValue={p.video_url} placeholder="https://youtu.be/..." />
          </div>
          <label className="checkbox"><input type="checkbox" name="featured" defaultChecked={p.featured} /> Feature on homepage</label>
          <label className="checkbox"><input type="checkbox" name="verified" defaultChecked={p.verified ?? true} /> Legally verified badge</label>
        </div>
      </div>

      <div className="admin-card">
        <h2>Photos</h2>
        {p.images?.length > 0 && (
          <>
            <p className="hint">Tick photos to remove them, or pick the cover photo shown on listing cards.</p>
            <div className="image-manager" style={{ marginBottom: 18 }}>
              {p.images.map((img) => (
                <div key={img.id} className="image-tile">
                  <img src={img.src} alt="" />
                  <label style={{ top: 0, bottom: 'auto', background: 'rgba(255,255,255,0.9)', color: 'var(--navy)' }}>
                    <input type="radio" name="cover_image_id" value={img.id} defaultChecked={img.id === firstImage} /> Cover
                  </label>
                  <label><input type="checkbox" name="remove_image_ids" value={img.id} /> Remove</label>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor="images">Upload photos</label>
          <input
            id="images" name="images" type="file" accept="image/*" multiple className="input"
            onChange={(e) => setPreviews([...e.target.files].map((f) => URL.createObjectURL(f)))}
          />
          <span className="hint">JPG, PNG or WebP. Up to about 10 MB in total per save.</span>
        </div>
        {previews.length > 0 && (
          <div className="image-manager" style={{ marginTop: 14 }}>
            {previews.map((src) => <div key={src} className="image-tile"><img src={src} alt="" /></div>)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-gold" disabled={pending}>{pending ? 'Saving...' : p.id ? 'Save Changes' : 'Publish Property'}</button>
        <a href="/admin/properties" className="btn btn-outline">Cancel</a>
      </div>
    </form>
  );
}
