import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'host.docker.internal',
      port:  Number(process.env.DATABASE_PORT) || 5433,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'vaibhav',
      database: process.env.DATABASE_NAME || 'user_management_db',
      entities: [User],
      synchronize: true,         // auto-create tables (disable in prod)
      retryAttempts: 10,
      retryDelay: 3000,
      autoLoadEntities: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
