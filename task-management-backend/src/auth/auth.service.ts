import { Body, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jose from 'jose';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
    secret_key: Uint8Array;
    // private readonly logger = new Logger(AuthService.name);

    constructor(private userService: UserService) {
        // generate and store secret key
        this.secret_key = new TextEncoder().encode(process.env.SECRET_KEY as string);
    }

    async createUser(@Body() authDto: UserDto){

        // check if username already exists
        const res = await this.userService.findUserByUsername(authDto.username);
        
        if (res !== null) {
            throw new HttpException({
                error: 'Username already exists'
            },
                HttpStatus.BAD_REQUEST)
        }

        // hash password
        authDto.password = await bcrypt.hash(authDto.password, 16)
        
        try {
            await this.userService.createUser(authDto);
            return true;
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
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .sign(this.secret_key);
 
    }

    extractJwt(req: Request){
        const [type, token] = (req.headers['authorization'] as string) ?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async verifyJwt(req: Request) {

        const jwt = this.extractJwt(req);
        
        if (jwt === undefined) {
            throw new UnauthorizedException();
        }

        try {
            const decoded = await jose.jwtVerify(jwt, this.secret_key);
            return decoded;
        }
        catch {
            throw new HttpException(`Unable to verify jwt`,
                HttpStatus.UNAUTHORIZED);
        }
    }

    async login(@Body() authDto: UserDto) {
        
        const user = await this.userService.findUserByUsername(authDto.username);

        if (user === null) {
            throw new HttpException(`Username or password is incorrect`,
                HttpStatus.BAD_REQUEST);
        }

        // verify password
        const match = await bcrypt.compare(authDto.password, user.password);
        
        if (!match) {
            throw new HttpException('Username or password is incorrect',
                HttpStatus.BAD_REQUEST);
        }

        const token = await this._genJwt({
            username: user.username,
            id: user.id
        });

        return token;
        
    }

}
