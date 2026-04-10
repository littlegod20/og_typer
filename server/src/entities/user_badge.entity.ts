import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Badge } from "./badge.entity";


@Entity()
export class UserBadge {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.user_badges)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Badge, (badge) => badge.user_badges)
  @JoinColumn({ name: "badge_id" })
  badge!: Badge;

  @CreateDateColumn()
  date_earned!: Date;
}