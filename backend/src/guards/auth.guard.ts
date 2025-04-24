import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express"
import mongoose from "mongoose";

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
            const payLoad = this.jwtService.verify(token);
            console.log("Decoded token payload in AuthGuard:", payLoad); // Debug logging
            // Retrieve the userId from the 'sub' property
            const userId = payLoad.sub;
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                throw new UnauthorizedException('Invalid token payload');
            }
            request.userId = userId;
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