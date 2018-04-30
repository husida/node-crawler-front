/*
 * @Author: husida 
 * @Date: 2018-01-17 12:05:42 
 * @Last Modified by: husida
 * @Last Modified time: 2018-04-30 18:46:20
 * @Explain: 服务器接口请求
 */
import http from "./http";

class Server {
    /**
     * @description 注册
     * @author husida
     * @memberof Server
     */
    regist (userName, password, status) {
        return http.post('/admin/regist', {
            userName: userName,
            password: password,
            status: status
        });
    }
}

export default new Server();
