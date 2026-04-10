import { DataSource } from 'typeorm';
import { TextSample } from '../entities/text_sample.entity';
import { textSampleSeeds, courseSeeds, lessonSeeds } from './constants';
import logger from '../config/logger';
import { Course } from '../entities/course.entity';
import { Lesson } from '../entities/lesson.entity';
import { LessonService } from '../services/lesson.service';

// Seeder function for text samples
export async function seedTextSamples(dataSource: DataSource): Promise<void> {
  try {
    const textSampleRepository = dataSource.getRepository(TextSample);

    logger.info('Seeding TextSample data...');

    for (const seedData of textSampleSeeds) {
      const existingTextSample = await textSampleRepository.findOne({
        where: { title: seedData.title }
      });

      if (!existingTextSample) {
        const textSample = textSampleRepository.create(seedData);
        await textSampleRepository.save(textSample);
        logger.info(`Created TextSample: ${seedData.title}`);
      } else {
        // logger.info(`TextSample already exists: ${seedData.title}`);
        continue;
      }
    }

    logger.info('TextSample seeding completed!');

  } catch (error) {
    logger.error(`Error seeding text samples: ${error}`)
  }
}

export async function seedCourses(dataSource: DataSource): Promise<void> {
  try {
    const courseRepository = dataSource.getRepository(Course);

    logger.info('Seeding Courses data...');

    for (const seedData of courseSeeds) {
      const existingCourse = await courseRepository.findOne({
        where: { name: seedData.name }
      });

      if (!existingCourse) {
        const course = courseRepository.create(seedData);
        await courseRepository.save(course);
        logger.info(`Created course: ${seedData.name}`);
      } else {
        // logger.info(`course already exists: ${seedData.title}`);
        continue;
      }
    }

    logger.info('Courses seeding completed!');

  } catch (error) {
    logger.error(`Error seeding courses... ${error}`)
  }
}

export async function seedLessons(dataSource: DataSource) {
  const lessonRepository = dataSource.getRepository(Lesson)
  const courseRepository = dataSource.getRepository(Course)
  const textSampleRepository = dataSource.getRepository(TextSample)

  const lessonService = new LessonService(
    lessonRepository,
    courseRepository,
    textSampleRepository,
  )

  logger.info('Seeding Lesson data...')

  for (const seedData of lessonSeeds) {
    const existingLesson = await lessonRepository.findOne({
      where: { title: seedData.title },
    })

    if (existingLesson) continue

    const course = await courseRepository.findOne({
      where: { name: seedData.courseName },
    })
    const textSample = await textSampleRepository.findOne({
      where: { title: seedData.textSampleTitle },
    })

    if (!course || !textSample) {
      logger.warn(
        `Skipping lesson "${seedData.title}": course "${seedData.courseName}" or text sample "${seedData.textSampleTitle}" not found`,
      )
      continue
    }

    let prerequisiteLessonId: string | null = null
    if (seedData.order_index > 1) {
      const previous = await lessonRepository.findOne({
        where: {
          course: { id: course.id },
          order_index: seedData.order_index - 1,
        },
      })
      prerequisiteLessonId = previous?.id ?? null
    }

    try {
      await lessonService.add({
        course_id: course.id,
        text_sample_id: textSample.id,
        prerequisite_lesson_id: prerequisiteLessonId,
        title: seedData.title,
        description: seedData.description,
        order_index: seedData.order_index,
      })
      logger.info(`Created lesson: ${seedData.title}`)
    } catch (err) {
      logger.error(`Failed to seed lesson "${seedData.title}": ${err}`)
    }
  }
  logger.info('Lessons seeding completed!')
}