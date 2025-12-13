'use client';

import React from 'react';
import { useDocumentInfo } from '@payloadcms/ui';

// Поле только для отображения картинки из RSS (feedImageUrl) в админке статей.

export const FeedImagePreviewField: React.FC<any> = () => {
  const { data } = useDocumentInfo();
  const url = (data as any)?.feedImageUrl as string | undefined;

  if (!url) {
    return (
      <div className="field-type">
        <div className="field-label">Изображение из RSS</div>
        <div className="field-description">Для этой статьи нет изображения из RSS.</div>
      </div>
    );
  }

  return (
    <div className="field-type">
      <div className="field-label">Изображение из RSS</div>
      <div className="field-control">
        <img
          src={url}
          alt="Изображение из RSS"
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.75rem' }}
          loading="lazy"
        />
      </div>
      <div className="field-description" style={{ marginTop: '0.5rem', wordBreak: 'break-all' }}>
        {url}
      </div>
    </div>
  );
};
