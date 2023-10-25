import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { GetAdminFromToken, GetUserFromToken, RequestHeaderVerifyApiKey } from 'src/utils.common/utils.decorators.common/utils.decorators.common';
import { UtilsDate } from 'src/utils.common/utils.format-time.common/utils.formar-time.common';
import { ResponseData } from 'src/utils.common/utils.response.common/utils.response.common';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity/admin.entity';
import { CreateAdminDTO } from './admin.dto/admin.create.dto';
import { AdminResponse } from './admin.response/admin.response';
import { AdminChangePasswordDTO } from './admin.dto/admin.change-password.dto';
import { UpdateAdminDTO } from './admin.dto/admin.update.dto';
import { Pagination } from 'src/utils.common/utils.pagination.common/utils.pagination.common';
import { StoreProcedureResultInterface } from 'src/utils.common/utils.store-procedure-result.common/utils.store-procedure-result.interface.common';
import { User } from 'src/users/users.entity/users.entity';
import { ListUserForAdminDTO } from './admin.dto/admin.list-user.dto';
import { UserResponse } from 'src/users/users.response/user.response';
import { BaseListResponseData } from 'src/utils.common/utils.response.common/utils.base-list-response.common';

@Controller('api/admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }
    @Post("/register")
    @UsePipes()
    async create(@Body(new ValidationPipe()) createAdminDTO: CreateAdminDTO, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let adminPhone: Admin = await this.adminService.findOneByPhone(createAdminDTO.phone_number);
        let adminEmail: Admin = await this.adminService.findOneByEmail(createAdminDTO.email);
        if(adminPhone){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Số điện thoại hoặc gmail đã được đăng ký !`), HttpStatus.BAD_REQUEST);
        }
        else{
            let admin: Admin = await this.adminService.createAdmin(createAdminDTO);
            if (admin == undefined) {
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Tạo thành viên thất bại!"), HttpStatus.OK);
            } else {
            response.setData(new AdminResponse(admin));
            }
        }  
        return res.status(HttpStatus.OK).send(response);
    }

    @Get("/list-user")
    @UseGuards(AuthGuard())
    @UsePipes(new ValidationPipe({ transform: true }))
    async spGetOrderDetailForAdmin(@Query() listUserForAdminDTO: ListUserForAdminDTO,@GetAdminFromToken() admin: Admin, @Res() res: Response): Promise<any> {
        let response: ResponseData = new ResponseData();
        let pagination: Pagination = new Pagination(listUserForAdminDTO.page, listUserForAdminDTO.limit);
        if(!admin){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Không có quyền truy cập !`), HttpStatus.OK);
        }
        let listUser: StoreProcedureResultInterface<User> = await this.adminService.getListUserForAdmin(
            listUserForAdminDTO.key_search,
            pagination
        )
        response.setData(new BaseListResponseData<User>(new UserResponse().mapToList(listUser.data), pagination.limit, listUser.total_record))
            return res.status(HttpStatus.OK).send(response);
    }

    @Post("/change-password")
    @UseGuards(AuthGuard())
    @UsePipes()
    async changePassword( @Body ( new ValidationPipe()) adminChangePasswordDTO : AdminChangePasswordDTO , @GetAdminFromToken() adminToken: Admin,@Res() res : Response) : Promise<any>{
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Không có quyền truy cập!"), HttpStatus.OK);
        }
        let admin : Admin = await this.adminService.changePassword(adminChangePasswordDTO , adminToken.id);
        if (admin == undefined) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Thay đổi mật khẩu thất bại!"), HttpStatus.OK);
        } else {
            response.setData(new AdminResponse(admin));
        }
        return res.status(HttpStatus.OK).send(response);
    }

    

    @Post("/update-profile")
    @UseGuards(AuthGuard())
    @UsePipes()
    async updateProfile( @Body ( new ValidationPipe()) updateAdminDTO : UpdateAdminDTO , @GetAdminFromToken() adminToken: Admin,@Res() res : Response) : Promise<any>{
        let response: ResponseData = new ResponseData();
        if(!adminToken){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Không có quyền truy cập!"), HttpStatus.OK);
        }
        let admin : Admin = await this.adminService.updateAdmin(updateAdminDTO , adminToken.id);
        if (admin == undefined) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, "Thay đổi mật khẩu thất bại!"), HttpStatus.OK);
        } else {
            response.setData(new AdminResponse(admin));
        }
        return res.status(HttpStatus.OK).send(response);
    }
}
