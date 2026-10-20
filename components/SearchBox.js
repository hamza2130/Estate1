'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PROPERTY_TYPES, SOCIETIES } from '@/lib/format';

const BUDGETS = [
  ['', 'Any budget'],
  ['5000000', 'Up to 50 Lac'],
  ['10000000', 'Up to 1 Crore'],
  ['30000000', 'Up to 3 Crore'],
  ['50000000', 'Up to 5 Crore'],
  ['100000000', 'Up to 10 Crore'],
];

export default function SearchBox() {
  const router = useRouter();
  const [purpose, setPurpose] = useState('sale');

  function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams({ purpose });
    for (const key of ['society', 'type', 'maxPrice', 'q']) {
      const v = form.get(key);
      if (v) params.set(key, v);
    }
    router.push(`/properties?${params}`);
  }

  return (
    <div className="search-card">
      <div className="search-tabs" role="tablist">
        {[['sale', 'Buy'], ['rent', 'Rent']].map(([v, l]) => (
          <button key={v} type="button" role="tab" aria-selected={purpose === v} className={`search-tab ${purpose === v ? 'active' : ''}`} onClick={() => setPurpose(v)}>{l}</button>
        ))}
      </div>
      <form className="search-grid" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="s-q">Keyword</label>
          <input id="s-q" name="q" className="input" placeholder="e.g. Phase 2, corner" />
        </div>
        <div className="field">
          <label htmlFor="s-society">Location</label>
          <select id="s-society" name="society" className="select" defaultValue="">
            <option value="">All locations</option>
            {SOCIETIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="s-type">Property type</label>
          <select id="s-type" name="type" className="select" defaultValue="">
            <option value="">All types</option>
            {Object.entries(PROPERTY_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="s-budget">Budget</label>
          <select id="s-budget" name="maxPrice" className="select" defaultValue="">
            {BUDGETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <button className="btn btn-gold" type="submit">Search Properties</button>
      </form>
    </div>
  );
}
