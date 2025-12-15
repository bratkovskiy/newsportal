import { buildConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { sql } from 'drizzle-orm';
import { revalidateArticle } from './hooks/revalidate';
import { importAllFeedsFromCMS, importFeedByIdFromCMS } from './rssImport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Import your collections here
// e.g., import Users from './collections/Users';
// For now, we will define them inline for simplicity.

import type { CollectionConfig, GlobalConfig } from 'payload';

const isJobsRequest = (req: any): boolean => {
  try {
    const headers = req?.headers;
    if (!headers) return false;

    let header: any;

    // Express / Node-style: headers as plain object
    if (typeof headers === 'object' && !('get' in headers)) {
      header = (headers as any)['x-jobs-key'] ?? (headers as any)['X-Jobs-Key'];
    }

    // Fetch / Next-style: headers as Headers instance
    if (!header && typeof (headers as any).get === 'function') {
      header = (headers as any).get('x-jobs-key') ?? (headers as any).get('X-Jobs-Key');
    }

    if (!header) return false;

    return String(header) === String(process.env.JOBS_API_KEY || '');
  } catch {
    return false;
  }
};

const cyrillicToLatinMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

function transliterate(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((char) => cyrillicToLatinMap[char] ?? char)
    .join('');
}

function slugify(input: string): string {
  const base = transliterate(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'article';
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor', 'author', 'viewer'],
      defaultValue: 'author',
      required: true,
    },
  ],
};

const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    update: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    delete: ({ req }) => Boolean(req.user) || isJobsRequest(req),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    // Assuming photo is managed in Media collection and linked
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
};

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    update: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    delete: ({ req }) => Boolean(req.user) || isJobsRequest(req),
  },
  fields: [
    { 
      name: 'name', 
      type: 'text', 
      required: true, 
      unique: true 
    },
    {
      name: 'showOnHome',
      label: 'Показывать категорию в блоках на главной странице',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'slug',
      label: 'URL (алиас)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Автоматически генерируется из названия. Используется в URL: /categories/slug',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (operation === 'create' || !value) {
              // Генерируем slug из name
              const name = data?.name || '';
              return name
                .toLowerCase()
                .replace(/[^a-zа-яё0-9\s-]/gi, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'metaTitle',
      label: 'Meta Title (SEO)',
      type: 'text',
      admin: {
        description: 'Автоматически генерируется: "НАЗВАНИЕ КАТЕГОРИИ - LADY.NEWS". Можно изменить вручную.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (operation === 'create' || !value) {
              const name = data?.name || '';
              return name ? `${name} - LADY.NEWS` : '';
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'metaDescription',
      label: 'Meta Description (SEO)',
      type: 'textarea',
      admin: {
        description: 'Автоматически генерируется: "Все материалы из категории НАЗВАНИЕ". Можно изменить вручную.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (operation === 'create' || !value) {
              const name = data?.name || '';
              return name ? `Все материалы из категории ${name}` : '';
            }
            return value;
          },
        ],
      },
    },
  ],
};

const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    update: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    delete: ({ req }) => Boolean(req.user) || isJobsRequest(req),
  },
  fields: [
    { 
      name: 'name', 
      type: 'text', 
      required: true, 
      unique: true 
    },
    {
      name: 'slug',
      label: 'URL (алиас)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Автоматически генерируется латиницей из названия. Используется в URL: /tags/slug',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (operation === 'create' || !value) {
              // Генерируем slug из name используя transliterate
              const name = data?.name || '';
              return slugify(name);
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'metaTitle',
      label: 'Meta Title (SEO)',
      type: 'text',
      admin: {
        description: 'Автоматически генерируется: "НАЗВАНИЕ ТЕГА - LADY.NEWS". Можно изменить вручную.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (operation === 'create' || !value) {
              const name = data?.name || '';
              return name ? `${name} - LADY.NEWS` : '';
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'metaDescription',
      label: 'Meta Description (SEO)',
      type: 'textarea',
      admin: {
        description: 'Автоматически генерируется: "Все материалы по тегу НАЗВАНИЕ". Можно изменить вручную.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (operation === 'create' || !value) {
              const name = data?.name || '';
              return name ? `Все материалы по тегу ${name}` : '';
            }
            return value;
          },
        ],
      },
    },
  ],
};

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: path.resolve(__dirname, './media'),
    imageSizes: [
      { 
        name: 'thumbnail', 
        width: 400, 
        height: 300, 
        position: 'centre',
        formatOptions: {
          format: 'jpeg',
          options: {
            quality: 80,
          },
        },
      },
      { 
        name: 'card', 
        width: 768, 
        height: 1024, 
        position: 'centre',
        formatOptions: {
          format: 'jpeg',
          options: {
            quality: 85,
          },
        },
      },
      { 
        name: 'tablet', 
        width: 1024, 
        position: 'centre',
        formatOptions: {
          format: 'jpeg',
          options: {
            quality: 85,
          },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
  endpoints: [
    {
      path: '/file/:filename',
      method: 'get',
      handler: async (req) => {
        const filenameParam =
          (req as any).routeParams?.filename ?? (req as any).params?.filename;
        const filename = String(filenameParam || '').trim();

        if (!filename) {
          return Response.json(
            { errors: [{ message: 'Filename is required' }] },
            { status: 400 },
          );
        }

        const mediaRes = await req.payload.find({
          collection: 'media',
          where: {
            filename: {
              equals: filename,
            },
          },
          limit: 1,
        });

        const doc: any = mediaRes.docs[0];

        if (!doc || !doc.url) {
          // Fallback для placeholder-1.jpg - отдаём файл напрямую из FS
          if (filename === 'placeholder-1.jpg') {
            try {
              const fs = await import('fs');
              const placeholderPath = path.resolve(__dirname, './media/placeholder-1.jpg');
              
              if (fs.existsSync(placeholderPath)) {
                const fileBuffer = fs.readFileSync(placeholderPath);
                return new Response(fileBuffer, {
                  status: 200,
                  headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000',
                  },
                });
              }
            } catch (err) {
              console.error('Error reading placeholder file:', err);
            }
          }
          return new Response('File not found', { status: 404 });
        }

        const url: string = doc.url;
        const isAbsolute = /^https?:\/\//i.test(url);

        if (isAbsolute) {
          return Response.redirect(url, 302);
        }

        const base =
          (req as any).payload?.config?.serverURL ||
          process.env.PAYLOAD_PUBLIC_SERVER_URL ||
          process.env.NEXT_PUBLIC_SERVER_URL ||
          'http://localhost:3000';

        const target = new URL(url, base).toString();
        return Response.redirect(target, 302);
      },
    },
  ],
};

const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedDate', 'viewCount'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    update: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    delete: ({ req }) => Boolean(req.user) || isJobsRequest(req),
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data;
        if (!data.slug) {
          const title = data.title || originalDoc?.title;
          if (title) {
            data.slug = slugify(title);
          }
        }
        return data;
      },
      ({ data, originalDoc }) => {
        const source = originalDoc || {};
        const draft: any = data ? { ...source, ...data } : source;

        const flags: Array<keyof typeof draft> = ['homeMainBlock', 'homeTop', 'homeMustRead'];
        let trueCount = 0;

        for (const key of flags) {
          const value = typeof draft[key] === 'boolean' ? draft[key] : false;
          if (value) trueCount++;
        }

        if (trueCount > 1) {
          throw new Error('У материала может быть установлен только один флаг блока на главной странице');
        }

        return data;
      },
    ],
    afterChange: [revalidateArticle],
  },
  endpoints: [
    {
      path: '/:id/increment-view',
      method: 'post',
      handler: async (req) => {
        try {
          const id = req.routeParams?.id;
          if (!id) {
            return Response.json({ error: 'Article ID required' }, { status: 400 });
          }

          const articleId = Number(id);

          // Получаем текущую статью
          const article = await req.payload.findByID({
            collection: 'articles',
            id: articleId,
          });

          if (!article) {
            return Response.json({ error: 'Article not found' }, { status: 404 });
          }

          // Инкрементируем счетчик
          const newViewCount = (article.viewCount || 0) + 1;
          
          await req.payload.update({
            collection: 'articles',
            id: articleId,
            data: {
              viewCount: newViewCount,
            },
          });

          return Response.json({ success: true, viewCount: newViewCount });
        } catch (err: any) {
          console.error('Error incrementing view count:', err);
          return Response.json({ error: err?.message || 'Failed to increment view count' }, { status: 500 });
        }
      },
    },
  ],
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true, admin: { position: 'sidebar' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'homeMainBlock',
      label: 'Главный блок (большой квадрат на главной)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'homeTop',
      label: 'В главное',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'homeMustRead',
      label: 'В Must-Read Stories',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'feedImageUrl',
      label: 'URL изображения из RSS',
      type: 'text',
      required: false,
      admin: {
        description: 'Если статья импортирована из фида, здесь хранится ссылка на исходное изображение.',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'feedImagePreview',
      label: 'Предпросмотр изображения из RSS',
      type: 'ui',
      admin: {
        components: {
          Field: '/src/components/FeedImagePreview#FeedImagePreviewField',
        },
        disableListColumn: true,
      },
    },
    {
      name: 'content',
      label: 'Текст статьи',
      type: 'richText',
      editor: lexicalEditor(),
      required: false,
    },
    {
      name: 'contentHtml',
      label: 'Текст статьи (HTML)',
      type: 'textarea',
      required: false,
    },
    { name: 'excerpt', type: 'textarea', minLength: 20, maxLength: 200 },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'canonicalURL', type: 'text' },
      ],
    },
    {
      name: 'noindex',
      label: 'Не индексировать (noindex)',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Если включено, статья не попадает в sitemap и может быть закрыта от индексации метатегами.',
      },
    },
    {
      name: 'viewCount',
      label: 'Просмотры',
      type: 'number',
      defaultValue: 0,
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Количество просмотров статьи',
        disableListFilter: false,
      },
    },
  ],
};

const Feeds: CollectionConfig = {
    slug: 'feeds',
    admin: {
        useAsTitle: 'name',
    },
    access: {
      read: ({ req }) => Boolean(req.user) || isJobsRequest(req),
      create: ({ req }) => Boolean(req.user) || isJobsRequest(req),
      update: ({ req }) => Boolean(req.user) || isJobsRequest(req),
      delete: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    },
    fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text', required: true, unique: true },
        { name: 'type', type: 'select', options: ['rss', 'json'], defaultValue: 'rss' },
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        {
          name: 'cron',
          label: 'Cron schedule',
          type: 'text',
          required: false,
          admin: {
            description:
              'Человеческая заметка о расписании (например, */30 * * * *). Фактический интервал задаётся в FEEDS_IMPORT_INTERVAL_MINUTES.',
          },
        },
        {
          name: 'fieldMapping',
          label: 'Маппинг полей',
          type: 'group',
          admin: {
            description: 'Настройка соответствия полей фида полям статей',
          },
          fields: [
            {
              name: 'titleField',
              label: 'Поле заголовка',
              type: 'text',
              defaultValue: 'title',
              admin: {
                description: 'Имя поля в фиде для заголовка статьи (по умолчанию: title)',
              },
            },
            {
              name: 'contentField',
              label: 'Поле контента',
              type: 'text',
              defaultValue: 'content:encoded',
              admin: {
                description: 'Имя поля в фиде для контента статьи (по умолчанию: content:encoded)',
              },
            },
            {
              name: 'excerptField',
              label: 'Поле описания/анонса',
              type: 'text',
              defaultValue: 'custom:secondTitle',
              admin: {
                description: 'Имя поля в фиде для анонса статьи (по умолчанию: custom:secondTitle)',
              },
            },
            {
              name: 'authorField',
              label: 'Поле автора',
              type: 'text',
              defaultValue: 'dc:creator',
              admin: {
                description: 'Имя поля в фиде для автора статьи (по умолчанию: dc:creator или author)',
              },
            },
            {
              name: 'authorSource',
              label: 'Откуда брать автора',
              type: 'select',
              defaultValue: 'from_feed',
              options: [
                { label: 'Из фида (поле выше)', value: 'from_feed' },
                { label: 'Существующий автор', value: 'existing' },
                { label: 'Создать нового автора', value: 'create_new' },
              ],
              admin: {
                description: 'Выберите источник автора для статей из этого фида',
              },
            },
            {
              name: 'existingAuthor',
              label: 'Выберите автора',
              type: 'relationship',
              relationTo: 'authors',
              required: false,
              admin: {
                description: 'Автор, который будет назначен всем статьям из этого фида',
                condition: (data: any) => data?.fieldMapping?.authorSource === 'existing',
              },
            },
            {
              name: 'newAuthorName',
              label: 'Имя нового автора',
              type: 'text',
              required: false,
              admin: {
                description: 'Укажите имя, новый автор будет создан при первом импорте',
                condition: (data: any) => data?.fieldMapping?.authorSource === 'create_new',
              },
            },
            {
              name: 'categoryField',
              label: 'Поле категории',
              type: 'text',
              defaultValue: 'custom:category',
              admin: {
                description: 'Имя поля в фиде для категории статьи. Если не указано или не найдено, будет использована категория с ID 64',
              },
            },
            {
              name: 'tagsField',
              label: 'Поле тегов',
              type: 'text',
              defaultValue: 'category',
              admin: {
                description: 'Имя поля в фиде для тегов статьи (по умолчанию: category)',
              },
            },
            {
              name: 'imageField',
              label: 'Поле изображения',
              type: 'text',
              defaultValue: 'custom:image',
              admin: {
                description: 'Имя поля в фиде для изображения статьи (по умолчанию: custom:image). Поддерживаются вложенные пути через точку, например: media:content.@_url',
              },
            },
            {
              name: 'dateField',
              label: 'Поле даты публикации',
              type: 'text',
              defaultValue: 'pubDate',
              admin: {
                description: 'Имя поля в фиде для даты публикации (по умолчанию: pubDate)',
              },
            },
            {
              name: 'defaultCategoryId',
              label: 'Категория по умолчанию (ID)',
              type: 'number',
              defaultValue: 64,
              admin: {
                description: 'ID категории, которая будет использоваться, если категория не указана в фиде',
              },
            },
          ],
        },
        {
          name: 'lastImportedAt',
          label: 'Last import at',
          type: 'date',
          admin: {
            readOnly: true,
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd.MM.yyyy HH:mm',
            },
          },
        },
        {
          name: 'lastImportStatus',
          label: 'Last import status',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'mappingPreview',
          label: 'Предпросмотр маппинга',
          type: 'ui',
          admin: {
            components: {
              Field: '/src/components/FeedMappingPreview#FeedMappingPreviewField',
            },
            disableListColumn: true,
          },
        },
        {
          name: 'importControl',
          label: 'Импорт статей',
          type: 'ui',
          admin: {
            components: {
              Field: '/src/components/FeedImportButton#FeedImportField',
            },
            disableListColumn: true,
          },
        },
    ],
    endpoints: [
      {
        path: '/:id/preview',
        method: 'post',
        handler: async (req) => {
          try {
            if (!req.user) {
              return Response.json({ errors: [{ message: 'Unauthorized' }] }, { status: 401 });
            }

            const idParam = (req as any).routeParams?.id ?? (req as any).params?.id;
            const id = Number(idParam);
            if (!id || Number.isNaN(id)) {
              return Response.json({ errors: [{ message: 'Invalid feed id' }] }, { status: 400 });
            }

            const feedDoc = (await req.payload.findByID({
              collection: 'feeds',
              id,
            })) as any;

            if (!feedDoc?.url) {
              return Response.json({ errors: [{ message: 'Feed not found or missing URL' }] }, { status: 404 });
            }

            // Загружаем фид
            const response = await fetch(feedDoc.url);
            if (!response.ok) {
              return Response.json({ errors: [{ message: `Failed to fetch feed: ${response.status}` }] }, { status: 500 });
            }

            const xml = await response.text();
            const { XMLParser } = await import('fast-xml-parser');
            const parser = new XMLParser({
              ignoreAttributes: false,
              attributeNamePrefix: '@_',
            });

            const json = parser.parse(xml);
            const channel = (json as any)?.rss?.channel || (json as any)?.channel;
            if (!channel) {
              return Response.json({ errors: [{ message: 'Invalid RSS feed format' }] }, { status: 400 });
            }

            const items = (channel as any).item ?? [];
            const firstItem = Array.isArray(items) ? items[0] : items;

            if (!firstItem) {
              return Response.json({ errors: [{ message: 'No items in feed' }] }, { status: 400 });
            }

            // Применяем маппинг
            const mapping = feedDoc.fieldMapping || {};
            const titleField = mapping.titleField || 'title';
            const contentField = mapping.contentField || 'content:encoded';
            const excerptField = mapping.excerptField || 'custom:secondTitle';
            const authorField = mapping.authorField || 'dc:creator';
            const categoryField = mapping.categoryField; // Не используем дефолтное значение!
            const tagsField = mapping.tagsField || 'category';
            const imageField = mapping.imageField || 'custom:image';
            const dateField = mapping.dateField || 'pubDate';
            const defaultCategoryId = mapping.defaultCategoryId || 64;

            // Категория: только если categoryField указано и не пустое
            const categoryValue = (categoryField && categoryField.trim()) ? firstItem[categoryField] : undefined;

            const mapped = {
              title: firstItem[titleField],
              content: firstItem[contentField] || firstItem['content:encoded'] || firstItem.content,
              excerpt: firstItem[excerptField],
              author: firstItem[authorField] || firstItem.author || firstItem['dc:creator'],
              category: categoryValue || `Дефолтная (ID ${defaultCategoryId})`,
              tags: Array.isArray(firstItem[tagsField]) ? firstItem[tagsField] : firstItem[tagsField] ? [firstItem[tagsField]] : [],
              image: firstItem[imageField],
              date: firstItem[dateField],
            };

            return Response.json({
              ok: true,
              rawItem: firstItem,
              mapped,
            });
          } catch (err: any) {
            console.error('Error in /api/feeds/:id/preview', err);
            const msg = err?.message || 'Preview failed';
            return Response.json({ errors: [{ message: msg }] }, { status: 500 });
          }
        },
      },
      {
        path: '/import-all',
        method: 'post',
        handler: async (req) => {
          try {
            if (!req.user && !isJobsRequest(req)) {
              return Response.json({ errors: [{ message: 'Unauthorized' }] }, { status: 401 });
            }

            const result = await importAllFeedsFromCMS(req as any);
            return Response.json({ ok: true, ...result });
          } catch (err: any) {
            console.error('Error in /api/feeds/import-all', err);
            const msg = err?.message || 'Import failed';
            return Response.json({ errors: [{ message: msg }] }, { status: 500 });
          }
        },
      },
      {
        path: '/:id/import',
        method: 'post',
        handler: async (req) => {
          try {
            if (!req.user && !isJobsRequest(req)) {
              return Response.json({ errors: [{ message: 'Unauthorized' }] }, { status: 401 });
            }

            const idParam = (req as any).routeParams?.id ?? (req as any).params?.id;
            const id = Number(idParam);
            if (!id || Number.isNaN(id)) {
              return Response.json({ errors: [{ message: 'Invalid feed id' }] }, { status: 400 });
            }

            const result = await importFeedByIdFromCMS(req as any, id);
            return Response.json({ ok: true, ...result });
          } catch (err: any) {
            console.error('Error in /api/feeds/:id/import', err);
            const msg = err?.message || 'Import failed';
            return Response.json({ errors: [{ message: msg }] }, { status: 500 });
          }
        },
      },
    ],
};

const Likes: CollectionConfig = {
    slug: 'likes',
    fields: [
        { name: 'article', type: 'relationship', relationTo: 'articles', required: true },
        { name: 'userHash', type: 'text', required: true }, // Anonymized user identifier
    ],
    timestamps: true,
};

const AdSlots: CollectionConfig = {
  slug: 'ad-slots',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['key', 'provider', 'enabled'],
    group: 'Настройки',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    update: ({ req }) => Boolean(req.user) || isJobsRequest(req),
    delete: ({ req }) => Boolean(req.user) || isJobsRequest(req),
  },
  fields: [
    {
      name: 'key',
      label: 'Ключ слота',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Машинное имя слота (например, home_sidebar, article_sidebar). Используется на фронте.',
      },
    },
    {
      name: 'label',
      label: 'Название слота',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
    },
    {
      name: 'enabled',
      label: 'Включен',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'provider',
      label: 'Провайдер',
      type: 'select',
      required: true,
      defaultValue: 'yan',
      options: [
        { label: 'Yandex Ads (РСЯ)', value: 'yan' },
        { label: 'Google AdSense', value: 'adsense' },
        { label: 'Прямой код', value: 'direct' },
        { label: 'Prebid / Header Bidding', value: 'prebid' },
      ],
    },
    {
      name: 'yandexBlockId',
      label: 'Yandex RTB blockId',
      type: 'text',
      admin: {
        condition: (data: any) => data?.provider === 'yan',
        description: 'Идентификатор блока РСЯ (blockId), без скрипта.',
      },
    },
    {
      name: 'adsenseSlotId',
      label: 'AdSense data-ad-slot',
      type: 'text',
      admin: {
        condition: (data: any) => data?.provider === 'adsense',
        description: 'Значение атрибута data-ad-slot из кода AdSense.',
      },
    },
    {
      name: 'adFormat',
      label: 'Формат объявления (AdSense)',
      type: 'text',
      admin: {
        condition: (data: any) => data?.provider === 'adsense',
      },
    },
    {
      name: 'width',
      label: 'Рекомендованная ширина (px)',
      type: 'number',
    },
    {
      name: 'height',
      label: 'Рекомендованная высота (px)',
      type: 'number',
    },
    {
      name: 'usageHint',
      label: 'Как использовать слот на фронтенде',
      type: 'textarea',
      admin: {
        readOnly: true,
        description:
          'Подсказка для разработчиков: показывает пример кода компонента AdSlot, который рендерит этот слот.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const key = (data && (data as any).key) || '';
            if (!key) return value || '';

            const lines = [
              'Как использовать этот рекламный слот в шаблонах сайта:',
              '',
              '- В основных layoutах (MainColumns, Article и др.) компонент AdSlot уже импортирован.',
              '- Чтобы вывести ИМЕННО ЭТОТ слот в таком шаблоне, достаточно в разметке вставить:',
              '',
              `<AdSlot placementKey="${key}" />`,
              '',
              'placementKey (prop компонента) должен совпадать с полем «Ключ слота» (key) в этой форме.',
              '',
              'Если создаётся НОВЫЙ тип страницы/шаблон, где AdSlot ещё не импортирован, разработчик должен добавить импорт в верхний блок --- .astro-файла, например:',
              "import AdSlot from '../components/AdSlot.astro';  // путь может отличаться, см. раздел про рекламу в DOCS.md.",
            ];

            return lines.join('\n');
          },
        ],
      },
    },
  ],
};

const AnalyticsSettings: GlobalConfig = {
  slug: 'analytics-settings',
  label: 'Аналитика и веб-мастеры',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Настройки',
    description:
      'Подключение Яндекс.Метрики, Google Analytics и кодов верификации для Google/Yandex Webmaster.',
  },
  fields: [
    {
      name: 'yandexMetrica',
      label: 'Яндекс.Метрика',
      type: 'group',
      admin: {
        description: 'Настройки счётчика Яндекс.Метрики. Вставка кода происходит автоматически на всех страницах.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Включить Яндекс.Метрику',
          defaultValue: false,
        },
        {
          name: 'counterId',
          type: 'text',
          label: 'ID счётчика',
          admin: {
            description: 'Числовой ID счётчика, например 12345678.',
          },
        },
      ],
    },
    {
      name: 'googleAnalytics',
      label: 'Google Analytics (GA4)',
      type: 'group',
      admin: {
        description: 'Настройки Google Analytics 4 (gtag). Скрипт подключается на всех страницах.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Включить Google Analytics',
          defaultValue: false,
        },
        {
          name: 'measurementId',
          type: 'text',
          label: 'Measurement ID',
          admin: {
            description: 'Идентификатор вида G-XXXXXXX.',
          },
        },
      ],
    },
    {
      name: 'webmaster',
      label: 'Коды верификации (Webmaster)',
      type: 'group',
      admin: {
        description:
          'Коды верификации для Google Search Console и Яндекс.Вебмастер. Будут добавлены как meta-теги на всех страницах.',
      },
      fields: [
        {
          name: 'googleVerification',
          type: 'text',
          label: 'Google site verification',
          admin: {
            description:
              'Значение атрибута content из meta name="google-site-verification" (только сам код, без тега).',
          },
        },
        {
          name: 'yandexVerification',
          type: 'text',
          label: 'Yandex site verification',
          admin: {
            description:
              'Значение атрибута content из meta name="yandex-verification" (только сам код, без тега).',
          },
        },
      ],
    },
    {
      name: 'customHeadHtml',
      label: 'Произвольный HTML-код в <head>',
      type: 'textarea',
      admin: {
        description:
          'Содержимое будет вставлено как есть внутрь <head> на всех страницах. Используйте только доверенный код (пиксели, скрипты, мета-теги).',
      },
    },
  ],
};

const RobotsSettings: GlobalConfig = {
  slug: 'robots',
  label: 'robots.txt',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Настройки',
    description:
      'Содержимое файла robots.txt, который отдаётся на фронте по /robots.txt.',
  },
  fields: [
    {
      name: 'content',
      label: 'robots.txt',
      type: 'textarea',
      admin: {
        description:
          'Полный текст файла robots.txt. Если оставить пустым, будет использован дефолт (Allow: / + Sitemap).',
      },
    },
  ],
};

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта / язык',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Настройки',
    description:
      'Текущий язык сайта (RU/EN) и переводы заголовков блоков и футера.',
  },
  fields: [
    {
      name: 'currentLanguage',
      label: 'Текущий язык сайта',
      type: 'select',
      defaultValue: 'ru',
      options: [
        { label: 'Русский', value: 'ru' },
        { label: 'English', value: 'en' },
      ],
      required: true,
    },
    {
      name: 'siteName',
      label: 'Название сайта',
      type: 'text',
      defaultValue: 'LADY.NEWS',
      admin: {
        description: 'Используется как текстовый логотип в шапке и футере.',
      },
    },
    {
      name: 'headerLogoCss',
      label: 'CSS для логотипа в шапке',
      type: 'textarea',
      admin: {
        description:
          'Произвольный CSS, который будет добавлен в <head> внутри <style>. Можно использовать, чтобы переопределить стили .site-logo-header.',
      },
    },
    {
      name: 'headerTagline',
      label: 'Подзаголовок в шапке (2-я строка)',
      type: 'text',
      admin: {
        description: 'Необязательный текст под логотипом в шапке, например: NEWS ABOUT MODA.',
      },
    },
    {
      name: 'labels',
      label: 'Подписи блоков',
      type: 'group',
      fields: [
        {
          name: 'homeMainRu',
          label: 'Главное (RU)',
          type: 'text',
          defaultValue: 'Главное',
        },
        {
          name: 'homeMainEn',
          label: 'Главное (EN)',
          type: 'text',
          defaultValue: 'Top stories',
        },
        {
          name: 'homeLatestRu',
          label: 'Последние новости (RU)',
          type: 'text',
          defaultValue: 'Последние новости',
        },
        {
          name: 'homeLatestEn',
          label: 'Последние новости (EN)',
          type: 'text',
          defaultValue: 'Latest news',
        },
        {
          name: 'homeMustReadRu',
          label: 'Must-Read Stories (RU)',
          type: 'text',
          defaultValue: 'Must-Read Stories',
        },
        {
          name: 'homeMustReadEn',
          label: 'Must-Read Stories (EN)',
          type: 'text',
          defaultValue: 'Must-Read Stories',
        },
        {
          name: 'homePopularRu',
          label: 'Популярное (RU)',
          type: 'text',
          defaultValue: 'Популярное',
        },
        {
          name: 'homePopularEn',
          label: 'Популярное (EN)',
          type: 'text',
          defaultValue: 'Popular',
        },
        {
          name: 'homeTagsRu',
          label: 'Теги (RU)',
          type: 'text',
          defaultValue: 'Теги',
        },
        {
          name: 'homeTagsEn',
          label: 'Теги (EN)',
          type: 'text',
          defaultValue: 'Tags',
        },
        {
          name: 'articleReadMoreRu',
          label: 'Читайте также (RU)',
          type: 'text',
          defaultValue: 'Читайте также',
        },
        {
          name: 'articleReadMoreEn',
          label: 'Читайте также (EN)',
          type: 'text',
          defaultValue: 'Read more',
        },
        {
          name: 'articleAlsoOnTopicRu',
          label: 'Ещё по теме (RU)',
          type: 'text',
          defaultValue: 'Ещё по теме',
        },
        {
          name: 'articleAlsoOnTopicEn',
          label: 'Ещё по теме (EN)',
          type: 'text',
          defaultValue: 'More on this topic',
        },
      ],
    },
    {
      name: 'footer',
      label: 'Футер',
      type: 'group',
      fields: [
        {
          name: 'textRu',
          label: 'Текст футера (RU, без года)',
          type: 'text',
          defaultValue: 'LADY.NEWS. Все права защищены.',
        },
        {
          name: 'textEn',
          label: 'Текст футера (EN, без года)',
          type: 'text',
          defaultValue: 'LADY.NEWS. All rights reserved.',
        },
      ],
    },
  ],
};

const LegalPage: GlobalConfig = {
  slug: 'legal-page',
  label: 'Правовая информация',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Страницы',
    description:
      'Контент страницы «Правовая информация» (RU/EN), отображаемой по адресу /legal/.',
  },
  fields: [
    {
      name: 'contentRu',
      label: 'Контент (RU)',
      type: 'textarea',
      admin: {
        description: 'HTML для русской версии страницы /legal/.',
      },
    },
    {
      name: 'contentEn',
      label: 'Контент (EN)',
      type: 'textarea',
      admin: {
        description: 'HTML для английской версии страницы /legal/.',
      },
    },
  ],
};

const PrivacyPage: GlobalConfig = {
  slug: 'privacy-page',
  label: 'Политика конфиденциальности',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Страницы',
    description:
      'Контент страницы «Политика конфиденциальности» (RU/EN), отображаемой по адресу /privacy-policy/.',
  },
  fields: [
    {
      name: 'contentRu',
      label: 'Контент (RU)',
      type: 'textarea',
      admin: {
        description: 'HTML для русской версии страницы /privacy-policy/.',
      },
    },
    {
      name: 'contentEn',
      label: 'Контент (EN)',
      type: 'textarea',
      admin: {
        description: 'HTML для английской версии страницы /privacy-policy/.',
      },
    },
  ],
};

const CookiesPage: GlobalConfig = {
  slug: 'cookies-page',
  label: 'Политика использования файлов Cookie',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Страницы',
    description:
      'Контент страницы «Политика использования файлов Cookie» (RU/EN), отображаемой по адресу /cookies-policy/.',
  },
  fields: [
    {
      name: 'contentRu',
      label: 'Контент (RU)',
      type: 'textarea',
      admin: {
        description: 'HTML для русской версии страницы /cookies-policy/.',
      },
    },
    {
      name: 'contentEn',
      label: 'Контент (EN)',
      type: 'textarea',
      admin: {
        description: 'HTML для английской версии страницы /cookies-policy/.',
      },
    },
  ],
};

const ContactsPage: GlobalConfig = {
  slug: 'contacts-page',
  label: 'Контакты',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Страницы',
    description:
      'Контент страницы «Контакты» (RU/EN), отображаемой по адресу /contacts/.',
  },
  fields: [
    {
      name: 'contentRu',
      label: 'Контент (RU)',
      type: 'textarea',
      admin: {
        description: 'HTML для русской версии страницы /contacts/.',
      },
    },
    {
      name: 'contentEn',
      label: 'Контент (EN)',
      type: 'textarea',
      admin: {
        description: 'HTML для английской версии страницы /contacts/.',
      },
    },
  ],
};

const serverURL = process.env.SERVER_URL || 'http://localhost:3000'
const serverOrigin = (() => {
  try {
    return new URL(serverURL).origin
  } catch {
    return serverURL
  }
})()
const allowedOrigins = [
  'http://localhost:4321',
  'http://localhost:4322',
  'http://localhost:3000',
  'http://cms:3000',
  serverOrigin,
]

export default buildConfig({
  serverURL: serverURL,
  secret: process.env.PAYLOAD_SECRET || 'a-good-secret-key',
  editor: lexicalEditor(),
  collections: [Users, Authors, Categories, Tags, Media, Articles, Feeds, Likes, AdSlots],
  globals: [AnalyticsSettings, RobotsSettings, SiteSettings, LegalPage, PrivacyPage, CookiesPage, ContactsPage],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // Use migrations instead of automatic schema push
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    migrationDir: path.resolve(__dirname, './migrations'),
  }),
  sharp, 
});
