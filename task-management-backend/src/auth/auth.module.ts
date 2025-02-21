import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, UserModule, AuthService]
})

export class AuthModule {};
