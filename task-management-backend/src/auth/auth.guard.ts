import { CanActivate, ExecutionContext, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor (private authService : AuthService) {}
    
    async canActivate(context: ExecutionContext){
        const req = context.switchToHttp().getRequest<Request>();

        try {
            const decodedJwt = await this.authService.verifyJwt(req);
            req['payload'] = decodedJwt.payload;
            return true
        }
        catch (e){
            if (e instanceof HttpException){
                throw e
            }
            throw new InternalServerErrorException()
        }
    }

}