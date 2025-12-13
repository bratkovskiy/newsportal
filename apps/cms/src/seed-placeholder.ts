import { getPayload } from 'payload';
import config from './payload.config';
import path from 'path';
import fs from 'fs';

// Скрипт для добавления placeholder изображения в медиа
async function seedPlaceholder() {
  const payload = await getPayload({ config });

  try {
    // Проверяем, существует ли уже placeholder
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: 'placeholder-1.jpg',
        },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log('✓ Placeholder уже существует в базе данных');
      process.exit(0);
    }

    const placeholderPath = path.resolve(__dirname, './media/placeholder-1.jpg');
    
    if (!fs.existsSync(placeholderPath)) {
      console.error('✗ Файл placeholder-1.jpg не найден в ./media/');
      process.exit(1);
    }

    // Добавляем placeholder в базу данных
    await payload.create({
      collection: 'media',
      data: {
        alt: 'Изображение недоступно',
      },
      filePath: placeholderPath,
    });

    console.log('✓ Placeholder успешно добавлен в базу данных');
    process.exit(0);
  } catch (error) {
    console.error('✗ Ошибка при добавлении placeholder:', error);
    process.exit(1);
  }
}

seedPlaceholder();
