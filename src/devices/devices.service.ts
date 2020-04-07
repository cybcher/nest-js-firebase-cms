import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesService {
    // constructor(
    //     @Inject('devices') private readonly _deviceModel: Model<IDevice>) {
    //     super();
    // }

    // constructor(
    //     @InjectRepository(DeviceRepository)
    //     private deviceRepository: DeviceRepository,
    //   ) {
    //     super()
    //   }

    // async getDevice(projectId: string, customerId: string): Promise<IDevice> {
    //     try {
    //         return await this._deviceModel.findOne({ projectId, customerId }).exec();
    //     } catch (error) {
    //         return this.throwInternalServerError(error);
    //     }
    // }

    // async getDevices(): Promise<any> {
    //     try {
    //         return await this._deviceModel.find().exec();
    //     } catch (error) {
    //         return this.throwInternalServerError(error);
    //     }
    // }

    // async saveDevice(data: IDevice): Promise<IDevice> {
    //     if (data.projectId && data.customerId && data.token) {
    //         try {
    //             return await this._deviceModel.create(data);
    //         } catch (error) {
    //             return this.throwInternalServerError(error);
    //         }
    //     } 
    //     return this.throwUnProcessableEntity();
    // }

    // async deleteDevice(projectId: string, customerId: string): Promise<any> {
    //     try {
    //         return await this._deviceModel.deleteOne({ projectId, customerId }).exec();
    //     } catch (error) {
    //         return this.throwInternalServerError(error);
    //     }
    // }
}
