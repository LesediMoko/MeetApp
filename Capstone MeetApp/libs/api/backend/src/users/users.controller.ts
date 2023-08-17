import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, Request, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request as RequestExpress } from 'express';
import { AuthGuard } from './users.guard';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiTags, ApiBearerAuth, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { AuthenticatedRequest, InterestCategoryResponse, InterestRegionResponse, UnfriendBody, UnfriendResponse, UserAccountInfo, UserFriends, UserLoginRequest} from '../interfaces';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { User } from './schema';


@Controller('users')
@ApiSecurity('Api-Key')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({summary: 'Create a new user'})
  @ApiBody({description: 'Fill in your information', type: CreateUserDto})
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({summary: 'Log into an existing account'})
  @ApiBody({description: 'Fill in your the account\'s credentials', type: UserLoginRequest})
  signup(@Body() LoginInfo : UpdateUserDto){
    if (LoginInfo != null){
      if (LoginInfo.password != null && LoginInfo.username != null)
        return this.usersService.login(LoginInfo.username,LoginInfo.password)
      else 
        return {user : null, message: "username or password missing"}
    }
    else
      return {user: null, message : "No payload found"}
  }


  @UseGuards(AuthGuard)
  @Get('account')
  @ApiOperation({summary: 'View logged-in user\'s credentials'})
  @ApiBearerAuth()
  @ApiResponse({type: UserAccountInfo, description: "The user's credentials"})
  getAccount(@Request() req : AuthenticatedRequest) {
    //
      return req.user;
  }

  @UseGuards(AuthGuard)
  @Get('attendances')
  @ApiBearerAuth()
  @ApiOperation({summary: 'View list of events a logged-in user is attending'})
  @ApiResponse({type: [CreateEventDto], description: "A list of events attended by the user"})
  getUserAttendancesJWT(@Request() req : AuthenticatedRequest, ) {
    
    return this.usersService.getUserAttendances(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('attendances/count')
  @ApiBearerAuth()
  @ApiOperation({summary: "View the total number of events attended by the logged-in user"})
  @ApiResponse({type: Number, description: "The total number of events attended by the user"})
  getUserAttendancesCountJWT(@Request() req : AuthenticatedRequest, ) {
    
    return this.usersService.getUserAttendancesCount(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  @ApiOperation({summary: "Update the logged-in user's information"})
  @ApiBearerAuth()
  updateJWT(@Request() req : AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto, ) {
    
    return this.usersService.update(req.user.id, updateUserDto);
  }


  
  @Get()
  @ApiOperation({summary: "View a list of all existing users"})
  @ApiResponse({type: [User], description: "A list of all existing users"})
  findAll(@Req() request: RequestExpress, ) {
    
    if (request.query == null)
      return this.usersService.findAll();
    else
      return this.usersService.findByQuery(request.query)
  }

  @UseGuards(AuthGuard)
  @Get('friends')
  @ApiOperation({summary: "View a list of the logged-in user's friends"})
  @ApiBearerAuth()
  @ApiResponse({type: [UserFriends], description: "A list of the user's friends"})
  async getUserFriends(@Request() req : AuthenticatedRequest, ) {
    
    const friends = await this.usersService.getUserFriends(req.user.id);
    return friends;
  }

  @Get(':userId/attendances')
  getUserAttendances(@Param('userId') userId: string, ) {
    
    return this.usersService.getUserAttendances(userId);
  }

  @UseGuards(AuthGuard)
  @Get('friends/count')
  @ApiBearerAuth()
  @ApiOperation({summary: "View the total number of friends of the logged-in user"})
  @ApiResponse({type: Number, description: "The total number of friends the user has"})
  getUserFriendsCount(@Request() req : AuthenticatedRequest, ) {
    
    return this.usersService.getUserFriendsCount(req.user.id);
  }

  
  @Get(':userId/attendances/count')
  getUserAttendancesCount(@Param('userId') userId: string, ) {
    
    return this.usersService.getUserAttendancesCount(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, ) {
    
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('friend-requests')
  @ApiBearerAuth()
  @ApiOperation({summary: "View a list of the logged-in user's friend requests"})
  @ApiResponse({type: [UserFriends], description: "A list of the user's friend requests"})
  async getUserFriendRequests(@Request() req : AuthenticatedRequest, ) {
    
    const friends = await this.usersService.getUserFriendRequests(req.user.id);
    return friends;
  }

  @UseGuards(AuthGuard)
  @Delete('friend/unfriend')
  @ApiBearerAuth()
  @ApiBody({type: UnfriendBody})
  @ApiOperation({summary: "Remove a logged-in user's friend"})
  @ApiResponse({type: UnfriendResponse, description: "Details of success or failure of unfriend process"})
  unfriend(@Request() req : AuthenticatedRequest, @Body() friendID : {friend: string}, ) {
    
    return this.usersService.unfriend(req.user.id,friendID.friend);
  }

  @UseGuards(AuthGuard)
  @Post('friend/send-request')
  @ApiBearerAuth()
  sendFriendRequest(@Request() req : AuthenticatedRequest, @Body() requesteeID : {requestee: string}, ) {
    
    return this.usersService.sendFriendRequest(req.user.id,requesteeID.requestee)
  }

  @UseGuards(AuthGuard)
  @Patch('friend/accept-request')
  @ApiBearerAuth()
  acceptFriendship(@Request() req : AuthenticatedRequest, @Body() requesterID: {requester: string}, ) {
    
    return this.usersService.acceptRequest(req.user.id, requesterID.requester);
  }

  @UseGuards(AuthGuard)
  @Get('friend-requests/pending')
  @ApiBearerAuth()
  @ApiOperation({summary: "View a list of the logged-in user's pending friend requests"})
  @ApiResponse({type: [UserFriends], description: "A list of the user's pending friend requests"})
  async getUsersentRequests(@Request() req : AuthenticatedRequest, ) {
    
    const friends = await this.usersService.getUserSentRequests(req.user.id);
    return friends;
  }

  @UseGuards(AuthGuard)
  @Get('friends/events')
  @ApiBearerAuth()
  @ApiOperation({summary: 'View list of events a logged-in user\'s friends are attending'})
  @ApiResponse({type: [CreateEventDto], description: "A list of events attended by the user's friends"})
  async getFriendEvents(@Request() req : AuthenticatedRequest, ) {
    
    return this.usersService.getFriendEvents(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('attend')
  @ApiBearerAuth()
  async attendEvent(@Request() req : AuthenticatedRequest, @Body() eventToAttend : {eventID : string}, ) {
    
    return await this.usersService.attendEvent(req.user.id, eventToAttend.eventID);
  }

  @UseGuards(AuthGuard)
  @Get('all-events')
  @ApiBearerAuth()
  async getAllEvents(@Request() req : AuthenticatedRequest, ){
    
    return await this.usersService.getUserEvents(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get('event/:eventID')
  @ApiBearerAuth()
  async getEvent(@Request() req : AuthenticatedRequest, @Param('eventID') eventID :  string, ){
    
    return await this.usersService.getUserEvent(req.user.id, eventID)
  }

  @UseGuards(AuthGuard)
  @Get('recommendations/region')
  @ApiBearerAuth()
  @ApiOperation({summary: 'View list of events recommended to a logged-in user based on region'})
  @ApiResponse({type: [CreateEventDto], description: "A list of events recommended to a logged-in user based on region"})
  async getRecRegion(@Request() req : AuthenticatedRequest, ){
    
    return await this.usersService.recommendByRegion(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get('recommendations/category')
  @ApiBearerAuth()
  @ApiOperation({summary: 'View list of events recommended to a logged-in user based on category'})
  @ApiResponse({type: [CreateEventDto], description: "A list of events recommended to a logged-in user based on category"})
  async getRecCategory(@Request() req : AuthenticatedRequest, ){
    
    return await this.usersService.recommendationCategory(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get('recommendations/timeofday')
  @ApiBearerAuth()
  @ApiOperation({summary: 'View list of events recommended to a logged-in user based on time of day'})
  @ApiResponse({type: [CreateEventDto], description: "A list of events recommended to a logged-in user based on time of day"})
  async getRecTOD(@Request() req : AuthenticatedRequest, ){
    
    return await this.usersService.getUserTimeOfDayRecommendation(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get('interests/category')
  @ApiBearerAuth()
  @ApiBearerAuth()
  @ApiOperation({summary: 'View the top 3 categories the user may be interested in based on attendances'})
  @ApiResponse({type: InterestCategoryResponse, description: "The top 3 categories the user may be interested in based on attendances along with their frequencies"})
  async getIntCategory(@Request() req : AuthenticatedRequest, ){
    
    return await this.usersService.InterestCategory(req.user.id)
  }

  @UseGuards(AuthGuard)
  @Get('recommendations/duration')
  @ApiBearerAuth()
  @ApiOperation({summary: 'View list of events recommended to a logged-in user based on duration'})
  @ApiResponse({type: [CreateEventDto], description: "A list of events recommended to a logged-in user based on duration"})
  async getRecDuration(@Request() req : AuthenticatedRequest, ){
    
    return await this.usersService.getUserInterestAverageDuration(req.user.id)
  }
  
  // @UseGuards(AuthGuard)
  // @Get('interests/duration')
  // @ApiBearerAuth()
  // async getIntDuration(@Request() req : AuthenticatedRequest){
  //   return await this.usersService.getUserInterestDuration(req.user.id)
  // }

  @UseGuards(AuthGuard)
  @Get('interests/region')
  @ApiBearerAuth()
  @ApiOperation({summary: 'View the top 3 regions the user may be interested in based on attendances'})
  @ApiResponse({type: InterestRegionResponse, description: "The top 3 regions the user may be interested in based on attendances along with their frequencies"})
  async getIntRegion(@Request() req : AuthenticatedRequest, ){
    
    return await this.usersService.InterestRegion(req.user.id)
  }
}
