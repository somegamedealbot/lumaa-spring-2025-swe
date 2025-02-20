import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    secret_key: Buffer;

    constructor(private userService: UserService) {
        // generate and store secret key
        this.secret_key = randomBytes(32);
    }

    async createUser(@Body() authDto: AuthDto){

        // check if username already exists
        const res = await this.userService.findUserByUsername(authDto.username);
        
        if (res == null) {
            throw new HttpException({
                error: 'Username already exists'
            },
                HttpStatus.BAD_REQUEST)
        }

        // hash password
        authDto.password = await bcrypt.hash(authDto.password, 16)
        
        try {
            const user = await this.userService.createUser(authDto);
            const jwt = await this._genJwt({
                username: user.username,
                id: user.id
            });
            return jwt;
        }
        catch (e) {
            const message = e instanceof Error ? e.message : ''
            throw new HttpException({
                error: `Could not register user`,
                message 
            },
                HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
    }

    async _genJwt(payload: object) {
        
        return new jose.SignJWT(payload as jose.JWTPayload)
            .setProtectedHeader({ alg: "HS256" }) // Set algorithm
            .setIssuedAt() // Adds the "iat" (issued at) field
            .setExpirationTime("1h") // Expires in 1 hour
            .sign(this.secret_key);
 
    }

    async login(@Body() authDto: AuthDto) {
    
        const user = await this.userService.findUserByUsername(authDto.username);
        
        if (user == null) {
            throw new HttpException('Username or password is incorrect',
                HttpStatus.BAD_REQUEST);
        }
        
        const token = await this._genJwt({
            username: user.username,
            id: user.id
        });

        return {token};
        
    }
}
