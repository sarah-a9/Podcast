import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express"

@Injectable()
export class AuthGuard implements CanActivate{

constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException('Invalid Token')
        }

        try{  
            const payLoad = this.jwtService.verify(token)
            request.userId = payLoad.userId
        }catch(e){
            Logger.error(e.message);
            throw new UnauthorizedException('Invalid Token')
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined{
        return request.headers.authorization?.split(' ')[1]
    }
}