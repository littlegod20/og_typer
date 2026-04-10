import { Repository } from "typeorm";
import { Lesson } from "../entities/lesson.entity";
import { CreateLessonDto } from "../dto/lesson.dto";
import { Course } from "../entities/course.entity";
import { TextSample } from "../entities/text_sample.entity";


export class LessonService {
  constructor(
    private readonly lessonRepository: Repository<Lesson>,
    private readonly courseRepository: Repository<Course>,
    private readonly textSampleRepository: Repository<TextSample>
  ) { }

  async findAllLessons(courseId?: string) {

    const allLessons = this.lessonRepository
      .createQueryBuilder("lesson")
      .leftJoin(
        "lesson.course",
        "course"
      )
      .addSelect([
        "course.id",
        "course.name"
      ])
      .leftJoin(
        "lesson.text_sample",
        "text_sample"
      )
      .addSelect([
        "text_sample.id",
        "text_sample.content",
        "text_sample.title",
        "text_sample.difficulty_level"
      ])
      .leftJoin(
        "lesson.prerequisite_lesson",
        "prerequisite"
      )
      .addSelect([
        "prerequisite.id",
        "prerequisite.title",
        "prerequisite.order_index"
      ])
      .orderBy(
        "lesson.order_index",
        "ASC"
      )

    if (courseId) {
      allLessons.where("lesson.course_id = :courseId", { courseId })
    }

    return allLessons.getMany()
  }

  async findLessonsOfCourse(courseId: string) {
    const lessonsOfCourse = await this.lessonRepository.find({
      relations: ["course", "text_sample", "prerequisite_lesson"],
      select: {
        course: { name: true },
        text_sample: { title: true }
      },
      where: { course: { id: courseId } }
    })

    return lessonsOfCourse
  }

  async findLessonById(id: string) {
    const lessonById = await this.lessonRepository.findOne({
      where: { id },
      relations: ["text_sample", "course", "prerequisite_lesson"],
    });

    return lessonById;
  }

  async add(lesson: CreateLessonDto) {

    // checking if course_id, text_sample_id and prerequisite_lesson_id exist
    const course = await this.courseRepository.findOne({ where: { id: lesson.course_id } })

    if (!course) {
      throw new Error("No course exists with this course id!")
    }

    const text_sample = await this.textSampleRepository.findOne({ where: { id: lesson.text_sample_id } })

    if (!text_sample) {
      throw new Error(`No text sample exists with this id! :${lesson.title} => ${lesson.text_sample_id}`)
    }

    let prerequisite_lesson: Lesson | null = null;

    if (lesson.prerequisite_lesson_id) {
      prerequisite_lesson = await this.lessonRepository.findOne({ where: { id: lesson.prerequisite_lesson_id } })

      if (!prerequisite_lesson) {
        throw new Error("Prerequisite lesson not found!")
      }
    }

    const newLesson = this.lessonRepository.create({
      course: { id: lesson.course_id },
      text_sample: { id: lesson.text_sample_id },
      prerequisite_lesson: lesson.prerequisite_lesson_id ? { id: lesson.prerequisite_lesson_id } : null,
      title: lesson.title,
      description: lesson.description,
      order_index: lesson.order_index
    })


    const savedLesson = await this.lessonRepository.save(newLesson)

    return savedLesson
  }

  async update(lessonId: string, lesson: Partial<CreateLessonDto>) {
    await this.lessonRepository.update(
      {
        id: lessonId
      }, {
      title: lesson.title,
      description: lesson.description,
      order_index: lesson.order_index
    })

    const updatedLesson = await this.lessonRepository.findOne({
      where: { id: lessonId }
    })

    return updatedLesson
  }

  async delete(id: string) {
    const deletedLesson = await this.lessonRepository.softDelete(id)

    return deletedLesson
  }
}