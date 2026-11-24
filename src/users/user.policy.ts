import { Policy } from '@nestjs/authorization';
import type { User } from './entities/user.entity.js';

@Policy()
export class UserPolicy {
  /** Список пользователей — только админ. */
  list(user: User | null) {
    return user?.role === 'admin';
  }

  /** Публичный профиль — виден всем. */
  view(_user: User | null, _target: User) {
    return true;
  }

  /** Админ или сам пользователь. */
  update(user: User | null, target: User) {
    if (!user) return false;
    return user.role === 'admin' || user.id === target.id;
  }

  /** Только админ. */
  delete(user: User | null, _target: User) {
    if (!user) return false;
    return user.role === 'admin';
  }
}