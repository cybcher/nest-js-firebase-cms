// import { Injectable, NestMiddleware, HttpStatus, InternalServerErrorException } from '@nestjs/common';
// import { HttpException } from '@nestjs/common/exceptions/http.exception'
// import { Request, Response } from 'express'

// import firebase from './initilize'

// @Injectable()
// export class FirebaseAuthMiddleware implements NestMiddleware {
//   async use(req: Request, _: Response, next: Function) {
//     const { authorization } = req.headers
//     // Bearer ezawagawg.....
//     if (!authorization) {
//       throw new InternalServerErrorException();
//     }

//     const token = authorization.slice(7)

//     const user = await firebase
//       .auth()
//       .verifyIdToken(token)
//       .catch(err => {
//         throw new HttpException(
//           { message: 'Input data validation failed', err },
//           HttpStatus.UNAUTHORIZED,
//         )
//       })

//     req.firebaseUser = user
//     next()
//   }
// }
