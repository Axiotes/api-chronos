import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Chronos API')
    .setDescription(
      `API REST desenvolvida para o sistema de ponto eletrônico Chronos, 
      responsável pelo gerenciamento de registros de entrada e saída de funcionários. 
      Permite o controle de jornada de trabalho de forma automatizada, 
      integrando dispositivos de leitura (como RFID) e oferecendo 
      funcionalidades de monitoramento, relatórios e administração de usuários.`,
    )
    .setVersion('1.0')
    .build();

  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
