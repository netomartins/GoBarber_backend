
import { hash } from 'bcryptjs';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor (private usersRepository: IUserRepository) {}

  public async execute({ email, name, password }: Request): Promise<User> {


    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const users = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });


    return users;
  }
}

export default CreateUserService;