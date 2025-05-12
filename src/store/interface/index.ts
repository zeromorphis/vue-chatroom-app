/*
 * @Descripttion: 给你两窝窝
 * @version: 5.0.0
 * @Author: 言棠
 * @Date: 2022-11-28 17:32:02
 * @LastEditors: 言棠
 * @LastEditTime: 2022-12-09 15:26:25
 */
/* themeConfigProp */
export interface ThemeConfigProps {
	isDark: boolean;
	primary: string;
	isGrey: boolean;
	isWeak: boolean;
	watermark: boolean;
}

/* GlobalState */
export interface GlobalState {
	language: string;
	background: string;
	themeConfig: ThemeConfigProps;
}

/* AppState */
export interface UserState {
	token: string;
	userinfo: User;
}

/* ChatState */
export interface ChatState {
	socket: SocketIOClient.Socket;
	dropped: boolean;
	activeGroupUser: ActiveGroupUser;
	activeRoom: (Group & Friend) | null;
	groupGather: GroupGather;
	userGather: FriendGather;
	friendGather: FriendGather;
	unReadGather: UnReadGather;
}
