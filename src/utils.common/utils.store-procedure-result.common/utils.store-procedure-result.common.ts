import { HttpException, HttpStatus } from "@nestjs/common";
import { ExceptionResponseDetail } from "../utils.exceptions.common/utils.exception-common";
import { StoreProcedureStatusEnum } from "./utils.store-procedure-status-enum.common";

export class StoreProcedureResult<T> {
    result: T[];

    constructor(result?: T[]) {
        this.result = result ? null : result;
    }

    public getResultPagination(data: any) {

        if (data.length < 3 && (parseInt(data[0][0].status) === StoreProcedureStatusEnum.ERROR || parseInt(data[0][0].status) === StoreProcedureStatusEnum.FAIL_LOGIC)) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, data[0][0].message), HttpStatus.OK);
        }

        return {
            data: data[0],
            total_record: + data[2][0].total_record
        }
    }

    public getResultTotalAmount(data: any) {

        if (data.length < 3 && (parseInt(data[0][0].status) === StoreProcedureStatusEnum.ERROR || parseInt(data[0][0].status) === StoreProcedureStatusEnum.FAIL_LOGIC)) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, data[0][0].message), HttpStatus.OK);
        }
        return {
            data: data[0],
            total_amount: + data[2][0].total_amount,
            total_record: + data[2][0].total_record
        }
    }

    public getResultList(data: any) {
        if (data.length < 3 && (parseInt(data[0][0].status) === StoreProcedureStatusEnum.ERROR || parseInt(data[0][0].status) === StoreProcedureStatusEnum.FAIL_LOGIC)) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, data[0][0].message), HttpStatus.OK);
        } return data[0];
    }

    public getResultDetail(data: any) {
        if (data.length < 3 && (parseInt(data[0][0].status) === StoreProcedureStatusEnum.ERROR || parseInt(data[0][0].status) === StoreProcedureStatusEnum.FAIL_LOGIC)) {
            throw new HttpException(new ExceptionResponseDetail(HttpStatus.BAD_REQUEST, data[0][0].message), HttpStatus.OK);
        }
        return data[0][0];
    }

}