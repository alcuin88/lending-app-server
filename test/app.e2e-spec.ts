import { describe } from 'node:test';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma';
import { AuthDto } from 'src/modules/auth/dto';
import { ResetPasswordDto } from 'src/modules/user/dto';
import { Client } from '@prisma/client';

void describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  void describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com',
      password: 'test1!!!',
    };
    void describe('Signup', () => {
      it('Should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            passport: dto.password,
          })
          .expectStatus(400);
      });
      it('Should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('Should Signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('Should throw if email alreay taken', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });
    void describe('Login', () => {
      it('Should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            passport: dto.password,
          })
          .expectStatus(400);
      });
      it('Should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('Should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  void describe('User', () => {
    void describe('Get user', () => {
      it('Should throw for unauthorized user', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200);
      });
    });
    void describe('Reset password', () => {
      const dto: ResetPasswordDto = {
        password: 'testtest123!',
      };
      it('Should throw if unauthorized', () => {
        return pactum.spec().patch('/users').withBody(dto).expectStatus(401);
      });
      it('Should throw if no body provided', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });
      it('Should reset user password', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });

  void describe('Client', () => {
    const client: Client = {
      client_id: 0,
      first_name: 'Test',
      last_name: 'Client',
    };
    void describe('Create client', () => {
      it('Should throw if unauthorized', () => {
        return pactum
          .spec()
          .post('/client/create')
          .withBody(client)
          .expectStatus(401)
          .stores('client_id', 'client_id');
      });
      it('Should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/client/create')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({})
          .expectStatus(400)
          .stores('client_id', 'client_id');
      });
      it('Should create client', () => {
        return pactum
          .spec()
          .post('/client/create')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(client)
          .expectStatus(201)
          .stores('client_id', 'client_id');
      });
    });
    void describe('Get clients', () => {
      it('Should throw if not authorized', () => {
        return pactum.spec().get('/client/all').expectStatus(401);
      });
      it('Should get client', () => {
        return pactum
          .spec()
          .get('/client/all')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });
    void describe('Get client by id', () => {
      it('Should throw if no id in params', () => {
        return pactum
          .spec()
          .post('/client')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });
      it('Should throw if no id found', () => {
        return pactum
          .spec()
          .post('/client/222')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404);
      });
      it('Should get client by id', () => {
        return pactum
          .spec()
          .get('/client/$S{client_id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    void describe('Get client by name', () => {
      it('Should throw if not authorized', () => {
        return pactum.spec().post('/client').withBody(client).expectStatus(401);
      });
      it('Should get client by name', () => {
        return pactum
          .spec()
          .post('/client')
          .withBearerToken('$S{userAt}')
          .withBody(client)
          .expectStatus(200);
      });
    });
    void describe('Update client', () => {
      it('Should throw if no client found', () => {
        return pactum
          .spec()
          .patch('/client')
          .withBearerToken('$S{userAt}')
          .withBody({
            client_id: 1212,
            first_name: 'Test',
            last_name: 'Update',
          })
          .expectStatus(404);
      });

      it('Should update client', () => {
        return pactum
          .spec()
          .patch('/client')
          .withBearerToken('$S{userAt}')
          .withBody({
            client_id: '$S{client_id}',
            first_name: 'Test',
            last_name: 'Update',
          })
          .expectStatus(200);
      });
    });
  });

  void describe('Loan', () => {
    void describe('Create loan', () => {
      it.todo('Should create loan');
    });
    void describe('Get loans', () => {
      it.todo('Should get loan');
    });
    void describe('Get by id', () => {
      it.todo('Should get loan by id');
    });
    void describe('Update loan', () => {
      it.todo('Should update loan');
    });
  });

  void describe('Payment', () => {
    void describe('Create payment', () => {
      it.todo('Should create payment');
    });
    void describe('Get payments', () => {
      it.todo('Should get payments');
    });
    void describe('Get payment by id', () => {
      it.todo('Should get payment by id');
    });
    void describe('Get payment by loan_id', () => {
      it.todo('Should get payment by loan_id');
    });
    void describe('Update payment', () => {
      it.todo('Should update payment');
    });
  });
});
