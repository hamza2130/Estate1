'use client';

import { useState } from 'react';

export default function Gallery({ images, title }) {
  const list = images.length ? images : [{ id: 0, src: '/demo/villa-1.svg' }];
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="gallery-main">
        <img src={list[active].src} alt={`${title} photo ${active + 1}`} />
      </div>
      {list.length > 1 && (
        <div className="gallery-thumbs">
          {list.map((img, i) => (
            <button key={img.id} className={i === active ? 'active' : ''} onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`}>
              <img src={img.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
