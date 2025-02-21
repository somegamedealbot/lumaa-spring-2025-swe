import { Body, Controller, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "../user/user.dto";


@Controller('auth')
export class AuthController {
    authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService
    }

    @Post('register')
    async register(@Body() authDto: AuthDto) {
        const registered = await this.authService.createUser(authDto);
        return { registered };
    }

    @Post('login')
    async login(@Body() authDto: AuthDto){ 
        const jwt = await this.authService.login(authDto);
        return { access_token: jwt };
    }

}