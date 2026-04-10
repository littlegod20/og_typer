import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { TextSample } from "./text_sample.entity";
import { ErrorLog } from "./error_log.entity";



@Entity()
export class TypingTest {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.typing_tests)
  @JoinColumn({ name: "user_id" })
  user!: User

  @ManyToOne(() => TextSample, (text_sample) => text_sample.typing_tests)
  @JoinColumn({ name: "text_sample_id" })
  text_sample!: TextSample

  @OneToMany(() => ErrorLog, (error_log) => error_log.typing_test)
  error_logs!: ErrorLog[]

  @Column({ type: "timestamp" })
  start_time!: Date

  @Column({ type: "timestamp" })
  end_time!: Date

  @Column()
  total_duration!: string;

  @Column("int")
  characters_correct!: number;

  @Column("int")
  wpm!: number;

  @Column("float")
  accuracy!: number;

  @CreateDateColumn()
  created_At!: Date;
}