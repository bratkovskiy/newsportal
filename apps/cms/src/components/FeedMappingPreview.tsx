'use client';

import React, { useState } from 'react';
import { useDocumentInfo } from '@payloadcms/ui';

export const FeedMappingPreviewField: React.FC = () => {
  const { id } = useDocumentInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const fetchFeedPreview = async () => {
    if (!id) {
      setError('Сначала сохраните фид');
      return;
    }

    setIsLoading(true);
    setError('');
    setPreviewData(null);

    try {
      const response = await fetch(`/api/feeds/${id}/preview`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.errors?.[0]?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPreviewData(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки фида');
    } finally {
      setIsLoading(false);
    }
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return '(нет данных)';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
      <h3 style={{ marginTop: 0 }}>Предпросмотр данных фида</h3>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Загрузите первый элемент из фида, чтобы увидеть как будут применены настройки маппинга полей.
      </p>
      
      <button
        type="button"
        onClick={fetchFeedPreview}
        disabled={isLoading || !id}
        style={{
          padding: '0.5rem 1rem',
          background: isLoading || !id ? '#ccc' : '#0073e6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading || !id ? 'not-allowed' : 'pointer',
          marginBottom: '1rem',
        }}
      >
        {isLoading ? 'Загрузка...' : 'Загрузить предпросмотр'}
      </button>

      {!id && (
        <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '1rem' }}>
          Сначала сохраните фид, затем будет доступен предпросмотр.
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {previewData && (
        <div>
          <h4>Доступные поля в фиде:</h4>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', maxHeight: '300px', overflow: 'auto' }}>
            <pre style={{ fontSize: '0.85em', margin: 0 }}>
              {JSON.stringify(previewData.rawItem, null, 2)}
            </pre>
          </div>

          <h4>Результат маппинга:</h4>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold', width: '30%' }}>
                    Заголовок
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    {renderValue(previewData.mapped?.title)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Анонс/Описание
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    {renderValue(previewData.mapped?.excerpt)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Автор
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    {renderValue(previewData.mapped?.author)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Теги
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    {renderValue(previewData.mapped?.tags)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Категория
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    {renderValue(previewData.mapped?.category)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Изображение
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    {renderValue(previewData.mapped?.image)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                    Дата публикации
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                    {renderValue(previewData.mapped?.date)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', fontWeight: 'bold', verticalAlign: 'top' }}>
                    Контент (первые 200 символов)
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    {renderValue(previewData.mapped?.content?.substring(0, 200))}
                    {previewData.mapped?.content?.length > 200 && '...'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
