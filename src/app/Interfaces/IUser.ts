import { ICourse } from './icourse';

export default interface IUser {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  cart: ICourse[];
  watchLater: ICourse[];
  purchaseCourses: ICourse[];
  refreshToken: string;
  accessToken: string;
}
