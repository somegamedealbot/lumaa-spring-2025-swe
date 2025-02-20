import { Body, Controller, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";


@Controller('auth')
export class AuthController {
    authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService
    }

    @Post('register')
    async register(@Body() authDto: AuthDto) {
        const jwt = await this.authService.createUser(authDto);
        return { access_token: jwt };
    }

    @Post('login')
    async login(@Body() authDto: AuthDto){ 
        const jwt = await this.authService.login(authDto);
        return { access_token: jwt };
    }

}