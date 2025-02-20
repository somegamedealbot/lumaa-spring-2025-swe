import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    findUserByUsername(username: string) {
        return this.userRepo.findOneBy({
            username
        });
    }

    createUser(userDto: AuthDto){
        const user = this.userRepo.create({
            username: userDto.username,
            password: userDto.password
        });
        return this.userRepo.save(user)
    }

}