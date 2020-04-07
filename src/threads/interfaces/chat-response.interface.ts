import { User } from '../../users/user.entity';

export interface ChatResponse {
    readonly sender: User;
    readonly receiver: User;
    readonly text: string;
    readonly image: string;
}