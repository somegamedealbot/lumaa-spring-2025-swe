import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthDto } from "./user.dto";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

    getAllUsers(){
        return this.userRepo.find({});
    }

    findUserByUsername(username: string) {
        return this.userRepo.findOneBy({
            username: username
        });
    }

    async createUser(userDto: AuthDto){
        const user = this.userRepo.create({
            username: userDto.username,
            password: userDto.password
        });
        await this.userRepo.save(user)
        return user
    }

}