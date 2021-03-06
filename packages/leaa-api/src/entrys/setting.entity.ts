import { Index, Entity, Column } from 'typeorm';

import { Base } from '@leaa/api/src/entrys';

@Entity('settings')
@Index('settings_name_unique', ['name'], { unique: true })
@Index('settings_slug_unique', ['slug'], { unique: true })
export class Setting extends Base {
  @Column({ type: 'varchar', length: 32, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  slug?: string;

  @Column({ type: 'varchar', length: 32 })
  type!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  options?: string;
  @Column({ type: 'text', nullable: true })
  value?: string;

  @Column({ type: 'int', default: 0 })
  sort!: number;

  @Column({ type: 'int', default: 0 })
  private!: number;
}
