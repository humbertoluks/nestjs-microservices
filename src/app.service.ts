import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloPrefix(): string {
    return 'Hello World com prefixo!';
  }
}
