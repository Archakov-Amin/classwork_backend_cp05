import { Policy } from '@nestjs/authorization';
import type { User } from '../users/entities/user.entity.js';
import type { Post } from './entities/post.entity.js';

@Policy()
export class PostPolicy {
  /**
   * Список постов: доступен всем (анонимно тоже),
   * фильтрация published/author/admin — в сервисе.
   */
  list(_user: User | null) {
    return true;
  }

  /** Один пост: опубликован, либо автор, либо админ. */
  view(user: User | null, post: Post) {
    if (post.published) return true;
    if (!user) return false;
    return user.role === 'admin' || post.authorId === user.id;
  }

  /** Создание — только аутентифицированный. */
  create(user: User | null) {
    return !!user;
  }

  /** Редактирование — админ или автор. */
  update(user: User | null, post: Post) {
    if (!user) return false;
    return user.role === 'admin' || post.authorId === user.id;
  }

  /** Удаление — админ или автор. */
  delete(user: User | null, post: Post) {
    if (!user) return false;
    return user.role === 'admin' || post.authorId === user.id;
  }
}