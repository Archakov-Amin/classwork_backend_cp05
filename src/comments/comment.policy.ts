import { Policy } from '@nestjs/authorization';
import type { User } from '../users/entities/user.entity.js';
import type { Post } from '../posts/entities/post.entity.js';
import type { Comment } from './entities/comment.entity.js';

@Policy()
export class CommentPolicy {
  /**
   * Список комментариев — доступен всем (анонимно тоже).
   * Фильтрация по postId — в сервисе.
   */
  list(_user: User | null) {
    return true;
  }

  /** Один комментарий — доступен всем. */
  view(_user: User | null, _comment: Comment) {
    return true;
  }

  /** Статистика — доступна всем. */
  stats(_user: User | null) {
    return true;
  }

  /**
   * Создание комментария: только аутентифицированный,
   * и только к опубликованному посту, либо автор поста, либо админ.
   * Guard должен подгрузить Post по dto.postId и передать вторым аргументом.
   */
  create(user: User | null, post: Post) {
    if (!user) return false;
    return post.published || user.role === 'admin' || post.authorId === user.id;
  }

  /** Редактирование — админ или автор комментария. */
  update(user: User | null, comment: Comment) {
    if (!user) return false;
    return user.role === 'admin' || comment.authorId === user.id;
  }

  /** Удаление — админ или автор комментария. */
  delete(user: User | null, comment: Comment) {
    if (!user) return false;
    return user.role === 'admin' || comment.authorId === user.id;
  }
}