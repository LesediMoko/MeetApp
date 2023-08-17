//import { Request } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Request } from '@nestjs/common';
import mongoose from "mongoose";
import { Friendship } from "./friendships/schema";

export interface AuthenticatedRequest extends Request {
    //@ApiProperty({description: "The user's credentials", example: {id: "747223dedd65fc64879e13dc", username: "TimothyJones24", password: "pass435"}})
     user: {id : string, username : string, password: string};
  }

export class UserAccountInfo {
  @ApiProperty({example: "747223dedd65fc64879e13dc", description : "The user's desired username.", type: "string"})
     readonly id! : string;
     @ApiProperty({example: "user_man23", description : "The user's desired username."})
     readonly username! : string;
     @ApiProperty({example: "password101", description : "The user's chosen password."})
     readonly password! : string;
     @ApiProperty({example: 1516239022, description : "A number showing when the access was granted."})
     readonly iat! : number;
     @ApiProperty({example: 1516245960, description : "A number showing when the access will be expired."})
     readonly exp!: number;
  }

export class UserLoginRequest {

    @ApiProperty({description : 'An existing username.', example: 'john_doe'})
     readonly username! : string;

    @ApiProperty({description : 'The password associated with username.', example: 'pass123'})
    readonly password! : string;
  }

  export class UserFriends {

    @ApiProperty({example: "747223dedd65fc64879e13dc", description : "The user's desired username.", type: "string"})
    readonly ID!: mongoose.Schema.Types.ObjectId;

    @ApiProperty({description : 'An existing username.', example: 'john_doe'})
    readonly username! : string;

    @ApiProperty({example: "em=e?vftb+asi...", description : "Base64/BSON representation of profile picture."})
    readonly profilePicture!: string;
  }

  export class UnfriendBody {
    @ApiProperty({example : {friend : "647223dedd65fc64879e13dc"}, description: "The ID of the friend a logged-in user wants to remove", type: "OrderedMap"})
    readonly friendID! : {friend : string}
  }

  export class UnfriendResponse {
    @ApiProperty({description : 'An existing friendship or null.', example: {_id: "6472234ecd65fc66879d2dbf", requester: "647223decd65fc66879e13dc", requestee: "647223f8cd65fc66879e3f1f", status: true}, type: "OrderedMap"})
    readonly friendship!: Friendship|null
    @ApiProperty({description : 'An message indicated the success/failure of unfriending', example: 'Friend removed successfully!'})
    readonly message! : string
    @ApiProperty({description : 'Whether changes were made to the friendship entry in the database', example: true})
    readonly changes! : boolean
  }