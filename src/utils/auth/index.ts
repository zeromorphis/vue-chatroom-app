/*
 * @Author: 言棠
 * @version: 3.0.0
 * @Descripttion: 授人以渔，功德无量，利在千秋
 * @Date: 2022-04-14 16:15:41
 * @LastEditTime: 2022-04-15 00:19:44
 */
import Cookies from 'js-cookie';

const TOKENKEY: any = 'token'

export function getAccessToken() {
    return Cookies.get(TOKENKEY)
}

export function setAccessToken(token: string) {
    return Cookies.set(TOKENKEY, token)
}

export function removeAccessToken() {
    return Cookies.remove(TOKENKEY)
}