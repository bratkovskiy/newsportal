'use client';

import React, { useState } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';

// Кнопка в админке на странице конкретного фида.
// Дёргает /api/feeds/:id/import и показывает краткий лог результата.

export const FeedImportField: React.FC<any> = () => {
  const { id } = useDocumentInfo();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const disabled = !id || loading;

  const handleClick = async () => {
    if (!id || loading) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/feeds/${id}/import`, {
        method: 'POST',
        credentials: 'include',
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok || !json?.ok) {
        const errMsg =
          json?.errors?.[0]?.message || `HTTP ${res.status} ${res.statusText}`;
        setMessage(`Ошибка импорта: ${errMsg}`);
        return;
      }

      const created = json.created ?? json.feeds?.[0]?.created ?? 0;
      const skipped = json.skipped ?? json.feeds?.[0]?.skipped ?? 0;

      setMessage(`Импорт завершён: создано ${created}, пропущено ${skipped}`);

      // Обновить поля lastImportedAt / lastImportStatus после ответа
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch (e: any) {
      setMessage(`Ошибка импорта: ${e?.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="field-type">
      <div className="field-label">Импорт статей из этого фида</div>
      <div className="field-control">
        <button
          type="button"
          className="btn btn--primary"
          disabled={disabled}
          onClick={handleClick}
        >
          {loading ? 'Импорт…' : 'Импортировать сейчас'}
        </button>
      </div>
      {!id && (
        <div className="field-description">
          Сначала сохраните фид, затем будет доступен импорт.
        </div>
      )}
      {message && (
        <div className="field-description" style={{ marginTop: '0.5rem' }}>
          {message}
        </div>
      )}
    </div>
  );
};
