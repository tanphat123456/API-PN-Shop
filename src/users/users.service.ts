import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity/users.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './users.dto/user.create.dto';
import { ExceptionResponseDetail } from 'src/utils.common/utils.exceptions.common/utils.exception-common';
import { UserChangePasswordDTO } from './users.dto/user.change-password.dto';
import { GenerateToken } from 'src/utils.common/utils.generate-token.common/utils.generate-token.common';
import { HandleBase64 } from 'src/utils.common/utils.handle-base64.common/utils.handle-base64.common';
import { Password } from 'src/utils.common/utils.password.common/utils.password.common';
import { JwtService } from '@nestjs/jwt';
import { AuthTypeEnum } from 'src/auth/auth.enum/auth.enum';
import { UtilsDate } from 'src/utils.common/utils.format-time.common/utils.formar-time.common';
import { UserResetPasswordDTO } from './users.dto/user.reset-password.dto';
import { UserVerifyCodeDTO } from './users.dto/user.verify-code.dto';
import { UserUpdateProfileDTO } from './users.dto/user.update.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,  
        private jwtService: JwtService,
    ){ }

    
    

    async create(userDTO : UserDTO): Promise<User>{

        let user : User = new User();

        user.full_name = userDTO.full_name
        user.email = userDTO.email
        user.birthday = UtilsDate.formatStringDateToDate(userDTO.birthday)
        user.image_url = userDTO.image_url
        user.address = userDTO.address
        user.phone_number = userDTO.phone_number
        user.verify_code = ''
        user.password = userDTO.password
        user.token = ""

        await this.userRepository.create(user);
        // Tạo token từ mật khẩu và sđt người dùng (Generate Token By Phone And Password )
        
        let passwordBasic: string = await HandleBase64.decodePasswordBase64(user.password);
        let generateToken = new GenerateToken(user.phone_number, passwordBasic, AuthTypeEnum.USER);
        user.token = await this.jwtService.sign(JSON.stringify(generateToken));

        // Mã hóa mật khẩu 
        
        user.password = String(await Password.bcryptPassword(passwordBasic));
        
        
        await this.userRepository.save(user);

        
        return user;
    }

  /**
   * 
   * @param user_id 
   * @param userUpdateProfileDTO 
   * @returns 
   */
    async updateUser(user_id : number , userUpdateProfileDTO : UserUpdateProfileDTO): Promise<User>{
      let user : User = await this.findOneById(user_id);
      user.full_name = userUpdateProfileDTO.full_name
      user.birthday = UtilsDate.formatStringDateToDate(userUpdateProfileDTO.birthday)
      user.image_url = userUpdateProfileDTO.image_url
      await this.update(user);

      
      return user;
      
  }

    async changePassword(userChangePasswordDTO: UserChangePasswordDTO, userId: number): Promise<User> {
        let user: User = await this.findOneById(userId);
        
        // Kiểm tra mật khẩu cũ có đúng không

        if (!(await Password.comparePassword(await HandleBase64.decodePasswordBase64(userChangePasswordDTO.old_password), user.password))) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.FORBIDDEN, `Mật khẩu cũ không đúng!`,), HttpStatus.OK);
        } else {
            if (userChangePasswordDTO.new_password != userChangePasswordDTO.confirm_password) {
                throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Mật khẩu không đúng!`), HttpStatus.OK);
            } else {
                let newPassword: string = await HandleBase64.decodePasswordBase64(userChangePasswordDTO.new_password);

                let generateToken = new GenerateToken(user.phone_number, newPassword, AuthTypeEnum.USER);
                user.token = await this.jwtService.sign(JSON.stringify(generateToken));
                user.password = String(await Password.bcryptPassword(newPassword));
                await this.update(user)

            }
        }

        return user;
    }
    
    // Gửi email cho người dùng

    async tranportEmail(email : string , verify_code : string): Promise<any>{
        var nodemailer = require('nodemailer');
        const optionEmail = {
            service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.EMAIL_USER, // email hoặc username
                    pass: process.env.EMAIL_PASSWORD // password
                }
            };

        var transporter = nodemailer.createTransport(optionEmail);
        transporter.verify(function(error) {
        if (error) {
            console.log(error);
        } else { 
            console.log('Kết nối  đến gmail thành công!');
            var mail = {
                from: process.env.EMAIL_USER, 
                to: email, 
                subject: 'MÃ XÁC NHẬN THAY ĐỔI MẬT KHẨU', 
                html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                <!--[if gte mso 9]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta name="x-apple-disable-message-reformatting">
                  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                  <title></title>
                  
                    <style type="text/css">
                      @media only screen and (min-width: 570px) {
                  .u-row {
                    width: 550px !important;
                  }
                  .u-row .u-col {
                    vertical-align: top;
                  }
                
                  .u-row .u-col-100 {
                    width: 550px !important;
                  }
                
                }
                
                @media (max-width: 570px) {
                  .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                  }
                  .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                  }
                  .u-row {
                    width: 100% !important;
                  }
                  .u-col {
                    width: 100% !important;
                  }
                  .u-col > div {
                    margin: 0 auto;
                  }
                }
                body {
                  margin: 0;
                  padding: 0;
                }
                
                table,
                tr,
                td {
                  vertical-align: top;
                  border-collapse: collapse;
                }
                
                p {
                  margin: 0;
                }
                
                .ie-container table,
                .mso-container table {
                  table-layout: fixed;
                }
                
                * {
                  line-height: inherit;
                }
                
                a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
                }
                
                table, td { color: #000000; } @media (max-width: 480px) { #u_content_heading_1 .v-container-padding-padding { padding: 14px 10px 0px !important; } #u_content_heading_1 .v-text-align { text-align: center !important; } #u_content_heading_2 .v-container-padding-padding { padding: 0px 10px 10px !important; } #u_content_heading_2 .v-text-align { text-align: center !important; } #u_content_text_1 .v-container-padding-padding { padding: 10px !important; } #u_content_text_1 .v-text-align { text-align: center !important; } }
                    </style>
                  
                  
                
                <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
                
                </head>
                
                <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
                  <!--[if IE]><div class="ie-container"><![endif]-->
                  <!--[if mso]><div class="mso-container"><![endif]-->
                  <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
                  <tbody>
                  <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
                    
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #010916;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #010916;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table id="u_content_heading_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 0px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                  <h1 class="v-text-align" style="margin: 0px; color: #2dc26b; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Playfair Display',serif; font-size: 18px; font-weight: 400;">PN-SHOP</h1>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table id="u_content_heading_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                  <h1 class="v-text-align" style="margin: 0px; color: #236fa1; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Raleway',sans-serif; font-size: 22px; font-weight: 400;">MÃ XÁC NHẬN THAY ĐỔI MẬT KHẨU</h1>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 10px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                  <div class="v-text-align" style="font-size: 14px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word;">
                    <p style="line-height: 140%; text-align: left;">xin chào ${email},</p>
                <p style="line-height: 140%; text-align: left;"> - mã xác nhận thay đổi mật khẩu của bạn là ${verify_code} <br />PN-Shop.</p>
                  </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #010916;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #010916;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
                      
                      <img align="center" border="0" src="https://lh3.googleusercontent.com/pw/AJFCJaVwf3yx_YIjzjZ7TsUbyxgA6YG0kxq9e5v2PW2JEhUqlcQHt5w25eJBRNUl9nBWgAHyAIqpD3A6WeYwN0upzvJUxFpM2EZB6bb4zmwan_ICJ3KfEzs_zJm_Y5FuIcucywCWdp1NroxK6lffmJxj-2Ktm3u_lGknmtky_ZbdIJPXoGXHT6ZSCtuu5_vfs28-6GhurqOs4GpaEpW9yFPZXMPbSknjK_IUZI5xnkiHHi1junGbf3lfYJy8F6nJwPCpFibat_5qHg-fOA09DddE7utKtc9LQKzekILONrNyfCQVZpwe_8Cd6C1YNvPtWngPsg1PgfFbDOUg26Z6Ry4LwYwDDjsC-oSS3bM3jdAy9-FALKQ2qcMSuL8rrtr3pSJPih2tJqeXReXZUM7846OnsFn9z0nAB8KX5xEqq6Jwlk6XIjWIU2NET2s4i-hwwXufeJtJzGDX9JIuaBX9vq1OnavVsDv41t1tLcWiDxWFLJrFT_NAIvL1s1mt5uVw_mPAC5m94uWHc6txAWWKYmPeQd-0lQeA10aBUa4_vXi1AjbTqgFAphWmZfZGyEdhWSSgBitkdKsb-DCiACQpF4VkXGSVgXMTN5Qtdn0kgRZkMjgkG4xH1biS6vLCW-gHdH39kDxJ_fZGdkUY-4NxvXv3YwxY6iNexza84sp0vECoWsV-4z3Y8ObaohX4F7zyFGBvIFgR7XpWOl6ZZ7sAIprCyf7kmGVAjndJuFKpkkFFxBjMPmXUxeXoXTz2weJod8a9WbWMAw6ywbsSNWkM9ZG2zhwT852H84jofp2KP6MG5bAzu2uUtcIYwJIq-PwdhhJ3AjrD35w2Nzql3l3fVEqyUtj9FN9uwWQ0yb4xgiU9Bwl0uTt5g9DrJ1WgoDZVv2dbK1kdWSHBrdcpXMNB7Y025Yf33TnQNJ4oOCpdAIf8uCm104bQ3sDUJg3C8NE=w600-h317-s-no?authuser=0" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 530px;" width="530"/>
                      
                    </td>
                  </tr>
                </table>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: transparent;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:3px 10px 35px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="20%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 3px solid #2dc26b;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                      <tr style="vertical-align: top">
                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                          <span>&#160;</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #100e0f;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #100e0f;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                  <div class="v-text-align" style="font-size: 14px; color: #686767; line-height: 140%; text-align: center; word-wrap: break-word;">
                    <p style="font-size: 14px; line-height: 140%;"><span style="font-family: 'courier new', courier; font-size: 14px; line-height: 19.6px;">© PN-Shop -  All Rights Reserved</span></p>
                  </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                  </tbody>
                  </table>
                  <!--[if mso]></div><![endif]-->
                  <!--[if IE]></div><![endif]-->
                </body>
                
                </html>`
                // text: 'I LÒ VÉ EM  : ', 
            };
        }
        transporter.sendMail(mail, function(error, info) {
            if (error) { // nếu có lỗi
                console.log("Gửi gmail không thành công !");
                console.log(error);
            } else { //nếu thành công
                console.log("Gửi gmail thành công !");
            }
        });
        });
        return 1;
    }


    async verifyCode(userVerifyCodeDTO: UserVerifyCodeDTO): Promise<User>{
        let user = await this.findOneByGmail(userVerifyCodeDTO.email)
        if(user.verify_code != userVerifyCodeDTO.verify_code){
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, `Mã code: [${userVerifyCodeDTO.verify_code}] không đúng!`), HttpStatus.OK);
        }else{
            let passwordBasic= "0000";
            user.password = String(await Password.bcryptPassword(passwordBasic));
            let generateToken = new GenerateToken(user.phone_number, passwordBasic, AuthTypeEnum.USER);
            user.token = await this.jwtService.sign(JSON.stringify(generateToken));
            this.update(user);
            return user ;
        }
       
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id});
      }

    async findOneByPhone(phone_number: string): Promise<User> {
        return await this.userRepository.findOneBy({ phone_number});
    }

    async findOneByUsername(full_name: string): Promise<User> {
        return await this.userRepository.findOneBy({ full_name});
    }

    async findOneByGmail(email : string) : Promise<User>{
        return await this.userRepository.findOneBy({ email});
    }

    async update(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
