import { BaseRepoCache } from '@nestjs-bff/backend/lib/domain/core/repo/base.repo-cache';
import { AppSharedProviderTokens } from '@nestjs-bff/backend/lib/shared/app/app.shared.constants';
import { CacheStore } from '@nestjs-bff/backend/lib/shared/caching/cache-store.shared';
import { CachingProviderTokens } from '@nestjs-bff/backend/lib/shared/caching/caching.shared.constants';
import { LoggerSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger.shared.service';
import { Inject, Injectable } from '@nestjs/common';
import { IAppConfig } from '../../../../config/app.config';
import { TodoEntity } from '../../../global/entities/todo.entity';
import { ITodoModel } from '../model/todo.domain.model';
import { TodoDomainRepoRead } from './todo.domain.read-repo';

@Injectable()
export class TodoDomainRepoCache extends BaseRepoCache<TodoEntity, ITodoModel> {
  constructor(
    private _repo: TodoDomainRepoRead,
    loggerService: LoggerSharedService,
    @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
    @Inject(AppSharedProviderTokens.Config.App) appConfig: IAppConfig,
  ) {
    super({ loggerService, repo: _repo, cacheStore, ttl: appConfig.caching.entities.todo });
  }

  public async findByUserId(userId: string): Promise<TodoEntity[]> {
    return this.cacheStore.wrap(
      this.makeCacheKeyFromIdentifier(userId, 'userId'),
      () => this._repo.findByUserId(userId),
      {
        ttl: this.ttl,
      },
    );
  }
}
