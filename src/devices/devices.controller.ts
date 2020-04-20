import { Controller, Get, Res, Body, Put, Post, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DevicesService } from './devices.service';

@Controller('devices')
@ApiTags('Notification')
export class DevicesController {
    // constructor(private readonly deviceService: DevicesService, private readonly _messagingService: MessagingService, private readonly _loggerService: Logger) { }

    // @Get()
    // async getUserDevices(@Res() response): Promise<any> {
    //     try {
    //         const result = await this.deviceService.getDevices();
    //         return response.send(result);
    //     }
    //     catch (err) {
    //         return response.status(500).send(err);
    //     }
    // }

    // @Post('/:userId')
    // async createUserDevice(
    //     @Res() response,
    //     @Param('userId') userId: string,
    //     @Body() body: CreateDeviceDto
    // ): Promise<any> {
    //     try {
    //         const fcmToken = body.fcmToken;
    //         if (fcmToken) {
    //             const deviceObj = {
    //                 projectId,
    //                 customerId,
    //                 token: fcmToken,
    //             } as IDevice;

    //             const result = await this.deviceService.saveDevice(deviceObj);
    //             return response.send({ status: 'success', message: `Device for '${projectId}' added successfully!` });
    //         }
    //         throw new Error('Unprocessable Entity');
    //     }
    //     catch (err) {
    //         return response.send(err);
    //     }
    // }

    // @Post('/:projectId/:customerId/messages')
    // async sendNotification(
    //     @Res() response,
    //     @Param('projectId') projectId: string,
    //     @Param('customerId') customerId: string,
    //     @Body() message: MessageDto): Promise<any> {
    //     try {
    //         const device: IDevice = await this._deviceService.getDevice(projectId, customerId);
    //         if (device) {
    //             const fcmToken: string = device.token;
    //             const data = await this._messagingService.sendNotification(projectId, fcmToken, message);
    //             return response.send(data);
    //         }
    //         throw new Error('Unprocessable Entity');

    //     }
    //     catch (err) {
    //         this._loggerService.error(err);
    //         return response.status(500).send('Internal Server Error');
    //     }
    // }

}
