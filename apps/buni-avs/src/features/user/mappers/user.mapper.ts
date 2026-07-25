import { UserDto, UserStatsDto, UserPatternDto, UserActivityDto } from '../types';
import { User, UserStats, UserPattern, UserActivity, UserRole, PatternStatus, ActivityType } from '../types';

export class UserMapper {
  static toDomain(dto: UserDto): User {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      bio: dto.bio,
      location: dto.location,
      website: dto.website,
      github: dto.github,
      twitter: dto.twitter,
      specialty: dto.specialty,
      avatar: dto.avatar,
      role: this.mapRole(dto.role),
      verified: dto.verified,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static toDomainStats(dto: UserStatsDto): UserStats {
    return {
      patternsCreated: dto.patternsCreated,
      totalViews: dto.totalViews,
      memberSince: dto.memberSince,
      downloadsTotal: dto.downloadsTotal,
      favoritesCount: dto.favoritesCount,
      commentsCount: dto.commentsCount,
      trends: dto.trends,
    };
  }

  static toDomainPattern(dto: UserPatternDto): UserPattern {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      type: dto.type,
      status: this.mapStatus(dto.status),
      views: dto.views,
      downloads: dto.downloads,
      imgUrl: dto.imgUrl,
    };
  }

  static toDomainActivity(dto: UserActivityDto): UserActivity {
    return {
      id: dto.id,
      action: dto.action,
      target: dto.target,
      timestamp: dto.timestamp,
      type: this.mapActivityType(dto.type),
    };
  }

  private static mapRole(role: string): UserRole {
    const upperRole = role.toUpperCase();
    if (Object.values(UserRole).includes(upperRole as UserRole)) {
      return upperRole as UserRole;
    }
    return UserRole.VIEWER;
  }

  private static mapStatus(status: string): PatternStatus {
    const lowerStatus = status.toLowerCase();
    if (Object.values(PatternStatus).includes(lowerStatus as PatternStatus)) {
      return lowerStatus as PatternStatus;
    }
    return PatternStatus.DRAFT;
  }

  private static mapActivityType(type?: string): ActivityType {
    if (!type) return ActivityType.COMMENT;
    const lowerType = type.toLowerCase();
    if (Object.values(ActivityType).includes(lowerType as ActivityType)) {
      return lowerType as ActivityType;
    }
    return ActivityType.COMMENT;
  }
}
