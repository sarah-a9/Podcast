import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EpisodeModule } from './Episode/episode.module';
import { PodcastModule } from './Podcast/podcast.module';
import { CategoryModule } from './Category/category.module';
import { PlaylistModule } from './Playlist/playlist.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [
    // MongoDB connection with ConfigService for dynamic connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        console.log("MONGO_URL:", config.get('database.connectionString')); // 🔍 Debug here
        return { uri: config.get('database.connectionString') };
      },
      inject: [ConfigService],
    }),

    // JWT Authentication
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      load: [config]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({ secret: config.get('jwt.secret') }),
      global: true,
      inject: [ConfigService],
    }),

    // Application modules
    UserModule, 
    EpisodeModule,
    PodcastModule,
    CategoryModule,
    PlaylistModule,
    AuthModule,
    SwaggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
