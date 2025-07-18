declare namespace UniNamespace {
    type Uni = UniInterface;

    interface NavigateToMiniProgramOptions {
        /**
         * 要打开的小程序 appId（百度小程序则填写App Key）
         */
        appId: string;
        /**
         * 打开的页面路径，如果为空则打开首页
         */
        path?: string;
        /**
         * 需要传递给目标小程序的数据，目标小程序可在 App.vue 的 onLaunch或onShow 中获取到这份数据
         */
        extraData?: any;
        /**
         * 要打开的小程序版本，有效值： develop（开发版），trial（体验版），release（正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版
         * - release: 正式版
         * - develop: 开发版
         * - trial: 体验版
         */
        envVersion?: 'release' | 'develop' | 'trial';
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface NavigateBackMiniProgramOptions {
        /**
         * 需要传递给目标小程序的数据，目标小程序可在 App.vue 的 onLaunch或onShow 中获取到这份数据
         */
        extraData?: any;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GeneralCallbackResult {
        /**
         * 错误信息
         */
        errMsg: string;
    }

    interface SubNVue {
        /**
         * 显示原生子窗体
         */
        show(options: 'slide-in-right' | 'slide-in-left' | 'slide-in-top' | 'slide-in-bottom' | 'fade-in' | 'zoom-out' | 'zoom-fade-out' | 'pop-in'): void;
        /**
         * 隐藏原生子窗体
         */
        hide(options: 'slide-out-right' | 'slide-out-left' | 'slide-out-top' | 'slide-out-bottom' | 'fade-out' | 'zoom-in' | 'zoom-fade-in' | 'pop-out'): void;
        /**
         * 设置原生子窗体的样式
         */
        setStyle(options: SubNVuesSetStyleOptions): void;
        /**
         * 发送消息
         */
        postMessage(message: any): void;
        /**
         * 监听消息
         */
        onMessage(success: (result: any) => void): void;
    }

    interface SubNVuesSetStyleOptions {
        /**
         * 原生子窗体的排版位置
         * - static: 原生子窗体在页面中正常定位
         * - absolute: 原生子窗体在页面中绝对定位
         * - dock: 原生子窗体在页面中停靠
         */
        position: 'static' | 'absolute' | 'dock';
        /**
         * 原生子窗体的停靠方式,仅当原生子窗体 "position" 属性值设置为 "dock" 时才生效
         * - top: 原生子窗体停靠则页面顶部
         * - bottom: 原生子窗体停靠在页面底部
         * - left: 原生子窗体停靠在页面左侧
         * - right: 原生子窗体停靠在页面右侧
         */
        dock: 'top' | 'bottom' | 'left' | 'right';
        /**
         * 原生子窗体的内置样式
         * - popup: 弹出层
         * - navigationBar: 导航栏
         */
        type: 'popup' | 'navigationBar';
        /**
         * 原生子窗体的遮罩层,仅当原生子窗体 "type" 属性值设置为 "popup" 时才生效
         * - popup: 弹出层
         * - navigationBar: 导航栏
         */
        mask: 'popup' | 'navigationBar';
        /**
         * 原生子窗体的宽度
         */
        width: string;
        /**
         * 原生子窗体的高度
         */
        height: string;
        /**
         * 原生子窗体垂直向下的偏移量
         */
        top: string;
        /**
         * 原生子窗体垂直向上的偏移量
         */
        bottom: string;
        /**
         * 原生子窗体水平向左的偏移量
         */
        left: string;
        /**
         * 原生子窗体水平向右的偏移量
         */
        right: string;
        /**
         * 原生子窗体的边距
         */
        margin: string;
    }

    interface RequestPaymentOptions {
        /**
         * 支付服务提供商，通过 uni.getProvider 获取
         * - alipay: 支付宝支付
         * - wxpay: 微信支付
         * - baidu: 百度收银台
         * - appleiap: 苹果应用内支付
         */
        provider: 'alipay' | 'wxpay' | 'baidu' | 'appleiap';
        /**
         * 订单数据
         */
        orderInfo: AnyObject | string;
        /**
         * 时间戳从1970年1月1日至今的秒数，即当前的时间，微信小程序独有
         */
        timeStamp?: string;
        /**
         * 随机字符串，长度为32个字符以下，微信小程序独有 。
         */
        nonceStr?: string;
        /**
         * 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx，微信小程序独有
         */
        package?: string;
        /**
         * 签名算法，暂支持 MD5 ，微信小程序独有
         */
        signType?: string;
        /**
         * 签名，具体签名方案参见小程序支付接口文档，微信小程序独有
         */
        paySign?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }
    interface ConfigMTLSOptions {
        /**
         * 资源url
         */
        certificates: Certificate [];
        /**
         * 成功返回的回调函数
         */
        success?: (result: ConfigMTLSResult) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: ConfigMTLSResult) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface Certificate {
        /**
         * 对应请求的域名（注意：不要协议部分）
         */
        host: string;
        /**
         * 客户端证书（服务器端需要验证客户端证书时需要配置此项，格式要求请参考下面的证书格式说明，注意 iOS 平台客户端证书只支持 .p12 类型的证书）
         */
        client?: string;
        /**
         * 客户端证书对应的密码（客户端证书存在时必须配置此项）
         */
        clientPassword?: string;
        /**
         * 服务器端证书（客户端需要对服务器端证书做校验时需要配置此项，格式要求请参考下面的证书格式说明，注意 iOS 平台服务器端证书只支持 .cer 类型的证书）
         */
        server?: string [];
    }

    interface ConfigMTLSResult {
        /**
         * 成功返回 0,失败返回相应 code 码
         */
        code: number;
    }

    interface UploadFileOption {
        /**
         * 开发者服务器 url
         */
        url: string;
        /**
         * 文件类型，image/video/audio，仅支付宝小程序，且必填。
         * - image: 图像
         * - video: 视频
         * - audio: 音频
         */
        fileType?: 'image' | 'video' | 'audio';
        /**
         * 要上传的文件对象
         */
        file?: File;
        /**
         * 要上传文件资源的路径
         */
        filePath?: string;
        /**
         * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
         */
        name?: string;
        /**
         * 需要上传的文件列表。
         */
        files?: UploadFileOptionFiles [];
        /**
         * HTTP 请求 Header, header 中不能设置 Referer
         */
        header?: any;
        /**
         * HTTP 请求中其他额外的 form data
         */
        formData?: any;
        /**
         * 超时时间，单位 ms
         */
        timeout?: number;
        /**
         * 成功返回的回调函数
         */
        success?: (result: UploadFileSuccessCallbackResult) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: GeneralCallbackResult) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: GeneralCallbackResult) => void;
    }

    interface UploadFileOptionFiles {
        /**
         * multipart 提交时，表单的项目名，默认为 file，如果 name 不填或填的值相同，可能导致服务端读取文件时只能读取到一个文件。
         */
        name?: string;
        /**
         * 要上传的文件对象
         */
        file?: File;
        /**
         * 要上传文件资源的路径
         */
        uri?: string;
    }

    interface UploadTask {
        /**
         * 中断上传任务
         * @tutorial https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * var uploadTask = uni.uploadFile({
         * url: 'http://192.168.12.106:8080/uploadFile', //仅为示例，并非真实接口地址。
         * complete: ()=> {}
         * });
         * uploadTask.abort();
         * ```
         */
        abort(): void;
        /**
         * 监听上传进度变化
         * @tutorial https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * uploadTask.onProgressUpdate((res) => {
         * console.log('上传进度' + res.progress);
         * console.log('已经上传的数据长度' + res.totalBytesSent);
         * console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
         * });
         * ```
         */
        onProgressUpdate(callback: (result: OnProgressUpdateResult) => void): void;
        /**
         * 取消监听上传进度变化事件
         */
        offProgressUpdate(callback: (result: any) => void): void;
        /**
         * 监听 HTTP Response Header 事件
         */
        onHeadersReceived(callback: (result: any) => void): void;
        /**
         * 取消监听 HTTP Response Header 事件
         */
        offHeadersReceived(callback: (result: any) => void): void;
    }

    interface OnProgressUpdateResult {
        /**
         * 上传进度百分比
         */
        progress: number;
        /**
         * 已经上传的数据长度，单位 Bytes
         */
        totalBytesSent: number;
        /**
         * 预期需要上传的数据总长度，单位 Bytes
         */
        totalBytesExpectedToSend: number;
    }

    interface DownloadFileOption {
        /**
         * 下载资源的 url
         */
        url: string;
        /**
         * HTTP 请求 Header，header 中不能设置 Referer
         */
        header?: any;
        /**
         * 超时时间，单位 ms
         */
        timeout?: number;
        /**
         * 下载成功后以 tempFilePath 的形式传给页面，res = {tempFilePath: '文件的临时路径'}
         */
        success?: (result: DownloadSuccessData) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface DownloadTask {
        /**
         * 中断下载任务
         * @tutorial https://uniapp.dcloud.net.cn/api/request/network-file.html#downloadfile
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * var downloadTask = uni.downloadFile({
         * url: 'https://www.example.com/file/test', //仅为示例，并非真实接口地址。
         * complete: ()=> {}
         * });
         * downloadTask.abort();
         * ```
         */
        abort(): void;
        /**
         * 监听下载进度变化
         * @tutorial https://uniapp.dcloud.net.cn/api/request/network-file.html#downloadfile
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * downloadTask.onProgressUpdate((res) => {
         * console.log('下载进度' + res.progress);
         * console.log('已经下载的数据长度' + res.totalBytesWritten);
         * console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
         * });
         * ```
         */
        onProgressUpdate(callback: (result: OnProgressDownloadResult) => void): void;
        /**
         * 取消监听下载进度变化
         */
        offProgressUpdate(callback: (result: any) => void): void;
        /**
         * 监听 HTTP Response Header 事件
         */
        onHeadersReceived(callback: (result: any) => void): void;
        /**
         * 取消监听 HTTP Response Header 事件
         */
        offHeadersReceived(callback: (result: any) => void): void;
    }

    interface OnProgressDownloadResult {
        /**
         * 下载进度百分比
         */
        progress: number;
        /**
         * 已经下载的数据长度，单位 Bytes
         */
        totalBytesWritten: number;
        /**
         * 预期需要下载的数据总长度，单位 Bytes
         */
        totalBytesExpectedToWrite: number;
    }

    interface UploadFileSuccessCallbackResult {
        /**
         * 开发者服务器返回的数据
         */
        data: string;
        /**
         * 开发者服务器返回的 HTTP 状态码
         */
        statusCode: number;
    }

    interface DownloadSuccessData {
        /**
         * 临时文件路径，下载后的文件会存储到一个临时文件
         */
        tempFilePath: string;
        /**
         * 开发者服务器返回的 HTTP 状态码
         */
        statusCode: number;
    }

    interface ConnectSocketOption {
        /**
         * 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
         */
        url: string;
        /**
         * 支付宝小程序：是否创建多实例 socket
         */
        multiple?: boolean;
        /**
         * HTTP 请求 Header，header 中不能设置 Referer
         */
        header?: any;
        /**
         * 默认为 GET
         * 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
         */
        method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
        /**
         * 子协议数组
         */
        protocols?: string [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SendSocketMessageOptions {
        /**
         * 需要发送的内容
         */
        data: string | ArrayBuffer;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GeneralCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: GeneralCallbackResult) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: GeneralCallbackResult) => void;
    }

    interface CloseSocketOptions {
        /**
         * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
         */
        code?: number;
        /**
         * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
         */
        reason?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GeneralCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: GeneralCallbackResult) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: GeneralCallbackResult) => void;
    }

    interface OnSocketCloseOptions {
        /**
         * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
         */
        code?: number;
        /**
         * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
         */
        reason?: string;
        /**
         * 错误信息
         */
        errMsg: string;
    }

    interface SocketTask {
        /**
         * 通过 WebSocket 连接发送数据
         * @tutorial https://uniapp.dcloud.net.cn/api/request/socket-task.html#sockettask-send
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * task.send({data:"halo"});
         * ```
         */
        send(options: SendSocketMessageOptions): void;
        /**
         * 关闭 WebSocket 连接
         * @tutorial https://uniapp.dcloud.net.cn/api/request/socket-task.html#sockettask-close
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * task.close();
         * ```
         */
        close(options: CloseSocketOptions): void;
        /**
         * 监听 WebSocket 连接打开事件
         * @tutorial https://uniapp.dcloud.net.cn/api/request/socket-task.html#sockettask-onopen
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * task.onOpen((res) => {})
         * ```
         */
        onOpen(callback: (result: OnSocketOpenCallbackResult) => void): void;
        /**
         * 监听 WebSocket 连接关闭事件
         * @tutorial https://uniapp.dcloud.net.cn/api/request/socket-task.html#sockettask-onclose
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * task.onClose((res) => {
         * })
         * ```
         */
        onClose(callback: (result: any) => void): void;
        /**
         * 监听 WebSocket 错误
         * @tutorial https://uniapp.dcloud.net.cn/api/request/socket-task.html#sockettask-onerror
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * task.onError((res) => {
         * })
         * ```
         */
        onError(callback: (result: GeneralCallbackResult) => void): void;
        /**
         * 监听WebSocket接受到服务器的消息事件
         * @tutorial https://uniapp.dcloud.net.cn/api/request/socket-task.html#sockettask-onmessage
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * },
         * "ios": {
         * "osVer": "9.0",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         * @example ```typescript
         * task.onMessage((res) => {
         * })
         * ```
         */
        onMessage(callback: (result: OnSocketMessageCallbackResult) => void): void;
    }

    interface OnSocketMessageCallbackResult<T = any> {
        /**
         * 服务器返回的消息
         */
        data: T;
    }

    interface OnSocketOpenCallbackResult {
        /**
         * 连接成功的 HTTP 响应 Header
         */
        header: any;
    }

    interface ChooseImageOptions {
        /**
         * 最多可以选择的图片张数，默认9
         */
        count?: number;
        /**
         * original 原图，compressed 压缩图，默认二者都有
         */
        sizeType?: string | string [];
        /**
         * album 从相册选图，camera 使用相机，默认二者都有
         */
        sourceType?: string [];
        /**
         * 根据文件拓展名过滤，每一项都不能是空字符串。默认不过滤。
         */
        extension?: string [];
        /**
         * 图像裁剪参数，设置后 sizeType 失效。
         */
        crop?: ChooseImageCropOptions;
        /**
         * 成功则返回图片的本地文件路径列表 tempFilePaths
         */
        success?: (result: ChooseImageSuccessCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ChooseImageCropOptions {
        /**
         * 裁剪的宽度，单位为px，用于计算裁剪宽高比。
         */
        width: number;
        /**
         * 裁剪的高度，单位为px，用于计算裁剪宽高比。
         */
        height: number;
        /**
         * 取值范围为1-100，数值越小，质量越低（仅对jpg格式有效）。默认值为80。
         */
        quality?: number;
        /**
         * 是否将width和height作为裁剪保存图片真实的像素值。默认值为true。注：设置为false时在裁剪编辑界面显示图片的像素值，设置为true时不显示。
         */
        resize?: boolean;
        /**
         * 是否将裁剪的图片保存到手机相册里，默认值为false。
         */
        saveToAlbum?: boolean;
    }

    interface ChooseImageSuccessCallbackResult {
        /**
         * 图片的本地文件路径列表
         */
        tempFilePaths: string | string [];
        /**
         * 图片的本地文件列表，每一项是一个 File 对象
         */
        tempFiles: ChooseImageSuccessCallbackResultFile | ChooseImageSuccessCallbackResultFile [] | File | File [];
    }

    interface ChooseImageSuccessCallbackResultFile {
        /**
         * 本地文件路径
         */
        path: string;
        /**
         * 本地文件大小，单位：B
         */
        size: number;
    }

    interface PreviewImageOptions {
        /**
         * 当前显示图片的链接，不填则默认为 urls 的第一张
         */
        count?: string;
        /**
         * current 为当前显示图片的链接/索引值，不填或填写的值无效则为 urls 的第一张。App平台在 1.9.5至1.9.8之间，current为必填。不填会报错
         */
        current?: string | number;
        /**
         * 需要预览的图片链接列表
         */
        urls: string [];
        /**
         * 图片指示器样式
         * - default: 底部圆点指示器
         * - number: 顶部数字指示器
         * - none: 不显示指示器
         */
        indicator?: 'default' | 'number' | 'none';
        /**
         * 是否可循环预览
         */
        loop?: boolean;
        /**
         * 长按图片显示操作菜单，如不填默认为保存相册，1.9.5 起支持。
         */
        longPressActions?: LongPressActionsOptions;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface LongPressActionsOptions {
        /**
         * 按钮的文字数组
         */
        itemList: string [];
        /**
         * 按钮的文字颜色，字符串格式，默认为"#000000"
         */
        itemColor?: string.ColorString | string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: LongPressActionsSuccessData) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface LongPressActionsSuccessData {
        /**
         * 接口调用失败的回调函数
         */
        tapIndex: number;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        index: number;
    }

    interface GetImageInfoOptions {
        /**
         * 图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
         */
        src: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetImageInfoSuccessData) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetImageInfoSuccessData {
        /**
         * 图片宽度，单位px
         */
        width: number;
        /**
         * 图片高度，单位px
         */
        height: number;
        /**
         * 返回图片的本地路径
         */
        path: string;
        /**
         * 返回图片的方向
         */
        orientation?: string;
        /**
         * 返回图片的格式
         */
        type?: string;
    }

    interface SaveImageToPhotosAlbumOptions {
        /**
         * 图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
         */
        filePath: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: SaveImageToPhotosAlbumResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SaveImageToPhotosAlbumResult {
        /**
         * 保存到相册的图片路径
         */
        path: string;
    }

    interface CompressImageOptions {
        /**
         * 图片路径，图片的路径，可以是相对路径、临时文件路径、存储文件路径
         */
        src: string;
        /**
         * 压缩质量，范围0～100，数值越小，质量越低，压缩率越高（仅对jpg有效）
         */
        quality?: number;
        /**
         * 缩放图片的宽度
         */
        width?: string;
        /**
         * 缩放图片的高度
         */
        height?: string;
        /**
         * 压缩后图片的高度，单位为px，若不填写则默认以compressedWidth为准等比缩放
         */
        compressedHeight?: number;
        /**
         * 压缩后图片的宽度，单位为px，若不填写则默认以compressedHeight为准等比缩放。
         */
        compressedWidth?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CompressImageSuccessResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CompressImageSuccessResult {
        /**
         * 压缩后图片的临时文件路径
         */
        tempFilePath: string;
    }

    interface CompressVideoOptions {
        /**
         * 视频文件路径，可以是临时文件路径也可以是永久文件路径
         */
        src: string;
        /**
         * 压缩质量
         * - low: 低
         * - medium: 中
         * - high: 高
         */
        quality?: 'low' | 'medium' | 'high';
        /**
         * 码率，单位 kbps
         */
        bitrate?: number;
        /**
         * 帧率
         */
        fps?: number;
        /**
         * 相对于原视频的分辨率比例，取值范围(0, 1]
         */
        resolution?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CompressVideoSuccessData) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CompressVideoSuccessData {
        /**
         * 压缩后的临时文件地址
         */
        tempFilePath: string;
        /**
         * 压缩后的大小，单位 kB
         */
        size: string;
    }

    interface GetVideoInfoOptions {
        /**
         * 视频文件路径，可以是临时文件路径也可以是永久文件路径
         */
        src: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetVideoInfoSuccessData) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetVideoInfoSuccessData {
        /**
         * 画面方向
         */
        orientation?: string;
        /**
         * 视频格式
         */
        type?: string;
        /**
         * 视频长度
         */
        duration: number;
        /**
         * 视频大小，单位 kB
         */
        size: number;
        /**
         * 视频的长，单位 px
         */
        height: number;
        /**
         * 视频的宽，单位 px
         */
        width: number;
        /**
         * 视频帧率
         */
        fps?: number;
        /**
         * 视频码率，单位 kbps
         */
        bitrate?: number;
    }

    interface OpenVideoEditorOptions {
        /**
         * 视频源的路径，只支持本地路径
         */
        filePath: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: OpenVideoEditorSuccessData) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OpenVideoEditorSuccessData {
        /**
         * 剪辑后生成的视频文件的时长，单位毫秒（ms）
         */
        duration: number;
        /**
         * 剪辑后生成的视频文件大小，单位字节数（byte）
         */
        size: number;
        /**
         * 编辑后生成的视频文件的临时路径
         */
        tempFilePath: string;
        /**
         * 编辑后生成的缩略图文件的临时路径
         */
        tempThumbPath: string;
    }

    interface ChooseFileOptions {
        /**
         * 最多可以选择的文件数，默认100
         */
        count?: number;
        /**
         * 选择文件的类型，默认all，可选image、video
         * - image: 选择图片文件
         * - video: 选择视频文件
         * - all: 默认值，选择本地文件，包含图片和视频
         */
        type?: 'image' | 'video' | 'all';
        /**
         * 选择文件的后缀名，暂只支持.zip、.png等，不支持application/msword等值
         */
        extension?: string [];
        /**
         * original 原图，compressed 压缩图，默认二者都有
         */
        sizeType?: string | string [];
        /**
         * album 从相册选图，camera 使用相机，默认二者都有
         */
        sourceType?: string [];
        /**
         * 成功则返回图片的本地文件路径列表 tempFilePaths、tempFiles
         */
        success?: (result: ChooseFileSuccessCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ChooseFileSuccessCallbackResult {
        /**
         * 文件的本地文件路径列表
         */
        tempFilePaths: string | string [];
        /**
         * 文件的本地文件列表，每一项是一个 File 对象
         */
        tempFiles: ChooseFileSuccessCallbackResultFile | ChooseFileSuccessCallbackResultFile [] | File | File [];
    }

    interface ChooseFileSuccessCallbackResultFile {
        /**
         * 本地文件路径
         */
        path: string;
        /**
         * 本地文件大小，单位：B
         */
        size: number;
    }

    interface StartRecordOptions {
        /**
         * 录音成功后调用，返回录音文件的临时文件路径，res = {tempFilePath: '录音文件的临时路径'}
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface RecorderManager {
        /**
         * 开始录音
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        start(options: RecorderManagerStartOptions): void;
        /**
         * 暂停录音
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        pause(): void;
        /**
         * 暂停录音
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        resume(): void;
        /**
         * 停止录音
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        stop(): void;
        /**
         * 录音开始事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onStart(options: (result: any) => void): void;
        /**
         * 录音暂停事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onPause(options: (result: any) => void): void;
        /**
         * 录音停止事件，会回调文件地址
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onStop(options: (result: any) => void): void;
        /**
         * 已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onFrameRecorded(options: (result: any) => void): void;
        /**
         * 录音错误事件, 会回调错误信息
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onError(options: (result: any) => void): void;
    }

    interface RecorderManagerStartOptions {
        /**
         * 指定录音的时长，单位 ms ，如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音，最大值 600000（10 分钟）,默认值 60000（1 分钟）
         */
        duration?: number;
        /**
         * 采样率，有效值 8000/16000/44100
         */
        sampleRate?: number;
        /**
         * 录音通道数，有效值 1/2
         */
        numberOfChannels?: number;
        /**
         * 编码码率，有效值见下表格
         */
        encodeBitRate?: number;
        /**
         * 音频格式，有效值 aac/mp3
         */
        format?: string;
        /**
         * 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
         */
        frameSize?: number;
    }

    interface PlayVoiceOptions {
        /**
         * 需要播放的语音文件的文件路径
         */
        filePath: string;
        /**
         * original 原图，compressed 压缩图，默认二者都有
         */
        duration?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBackgroundAudioPlayerStateOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetBackgroundAudioPlayerStateSuccessData) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBackgroundAudioPlayerStateSuccessData {
        /**
         * 选定音频的长度（单位：s），只有在当前有音乐播放时返回
         */
        duration: number;
        /**
         * 选定音频的播放位置（单位：s），只有在当前有音乐播放时返回
         */
        currentPosition: number;
        /**
         * 播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
         */
        status: number;
        /**
         * 音频的下载进度（整数，80 代表 80%），只有在当前有音乐播放时返回
         */
        downloadPercent: number;
        /**
         * 歌曲数据链接，只有在当前有音乐播放时返回
         */
        dataUrl: string;
    }

    interface SeekBackgroundAudioOptions {
        /**
         * 音乐位置，单位：秒
         */
        position: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface BackgroundAudioManager {
        /**
         * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
         */
        duration: number;
        /**
         * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
         */
        currentTime: number;
        /**
         * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
         */
        paused: boolean;
        /**
         * 音频的数据源，默认为空字符串，当设置了新的 src 时，会自动开始播放 ，目前支持的格式有 m4a, aac, mp3, wav
         */
        src: string;
        /**
         * 音频开始播放的位置（单位：s）
         */
        startTime: number;
        /**
         * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
         */
        buffered: number;
        /**
         * 音频标题，用于做原生音频播放器音频标题。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
         */
        title: string;
        /**
         * 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
         */
        epname: string;
        /**
         * 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
         */
        singer: string;
        /**
         * 封面图url，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。
         */
        coverImgUrl: string;
        /**
         * 页面链接，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值
         */
        webUrl: string;
        /**
         * 音频协议。默认值为 'http'，设置 'hls' 可以支持播放 HLS 协议的直播音频
         */
        protocol: string;
        /**
         * 播放的倍率。可取值： 0.5/0.8/1.0/1.25/1.5/2.0，默认值为1.0。（仅 App 支持）
         */
        playbackRate?: number;
        /**
         * 播放
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        play(): void;
        /**
         * 暂停
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        pause(): void;
        /**
         * 跳转到指定位置，单位 s
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        seek(position: number): void;
        /**
         * 停止
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        stop(): void;
        /**
         * 背景音频进入可以播放状态，但不保证后面可以流畅播放
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onCanplay(callback: (result: any) => void): void;
        /**
         * 背景音频播放事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onPlay(callback: (result: any) => void): void;
        /**
         * 背景音频暂停事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onPause(callback: (result: any) => void): void;
        /**
         * 背景音频停止事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onStop(callback: (result: any) => void): void;
        /**
         * 背景音频自然播放结束事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onEnded(callback: (result: any) => void): void;
        /**
         * 背景音频播放进度更新事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onTimeUpdate(callback: (result: any) => void): void;
        /**
         * 用户在系统音乐播放面板点击上一曲事件（iOS only）
         */
        onPrev(callback: (result: any) => void): void;
        /**
         * 用户在系统音乐播放面板点击下一曲事件（iOS only）
         */
        onNext(callback: (result: any) => void): void;
        /**
         * 背景音频播放错误事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onError(callback: (result: any) => void): void;
        /**
         * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onWaiting(callback: (result: any) => void): void;
    }

    interface AudioContext {
        /**
         * 音频的地址
         */
        setSrc(): void;
        /**
         * 暂停
         */
        pause(): void;
        /**
         * 播放
         */
        play(): void;
        /**
         * 跳转到指定位置，单位 s
         */
        seek(position: number): void;
    }

    interface InnerAudioContext {
        /**
         * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
         */
        duration: number;
        /**
         * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
         */
        currentTime: number;
        /**
         * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
         */
        paused: boolean;
        /**
         * 音频的数据链接，用于直接播放。
         */
        src: string;
        /**
         * 音频开始播放的位置（单位：s）
         */
        startTime: number;
        /**
         * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
         */
        buffered: number;
        /**
         * 是否自动开始播放，默认 false
         */
        autoplay: boolean;
        /**
         * 是否循环播放，默认 false
         */
        loop: boolean;
        /**
         * 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true
         */
        obeyMuteSwitch: boolean;
        /**
         * 音量。范围 0~1。
         */
        volume: number;
        /**
         * 播放的倍率。可取值： 0.5/0.8/1.0/1.25/1.5/2.0，默认值为1.0。（仅 App 支持）
         */
        playbackRate?: number;
        /**
         * 暂停
         */
        pause(): void;
        /**
         * 停止
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        stop(): void;
        /**
         * 播放
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        play(): void;
        /**
         * 跳转到指定位置，单位 s
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        seek(position: number): void;
        /**
         * 销毁当前实例
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        destroy(): void;
        /**
         * 音频进入可以播放状态，但不保证后面可以流畅播放
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onCanplay(callback: (result: any) => void): void;
        /**
         * 音频播放事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onPlay(callback: (result: any) => void): void;
        /**
         * 音频暂停事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onPause(callback: (result: any) => void): void;
        /**
         * 音频停止事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onStop(callback: (result: any) => void): void;
        /**
         * 音频自然播放结束事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onEnded(callback: (result: any) => void): void;
        /**
         * 音频播放进度更新事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onTimeUpdate(callback: (result: any) => void): void;
        /**
         * 音频播放错误事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onError(callback: (result: any) => void): void;
        /**
         * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onWaiting(callback: (result: any) => void): void;
        /**
         * 音频进行 seek 操作事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onSeeking(callback: (result: any) => void): void;
        /**
         * 音频完成 seek 操作事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        onSeeked(callback: (result: any) => void): void;
        /**
         * 取消监听 onCanplay 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offCanplay(callback: (result: any) => void): void;
        /**
         * 取消监听 onPlay 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offPlay(callback: (result: any) => void): void;
        /**
         * 取消监听 onPause 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offPause(callback: (result: any) => void): void;
        /**
         * 取消监听 onStop 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offStop(callback: (result: any) => void): void;
        /**
         * 取消监听 onEnded 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offEnded(callback: (result: any) => void): void;
        /**
         * 取消监听 onTimeUpdate 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offTimeUpdate(callback: (result: any) => void): void;
        /**
         * 取消监听 onWaiting 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offError(callback: (result: any) => void): void;
        /**
         * 取消监听 onWaiting 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offWaiting(callback: (result: any) => void): void;
        /**
         * 取消监听 onSeeking 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offSeeking(callback: (result: any) => void): void;
        /**
         * 取消监听 onSeeked 事件
         * @uniPlatform {
         * "app": {
         * "android": {
         * "osVer": "4.4",
         * "uniVer": "√",
         * "unixVer": "3.9.0"
         * }
         * }
         * }
         */
        offSeeked(callback: (result: any) => void): void;
    }

    interface ChooseVideoOptions {
        /**
         * album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
         */
        sourceType?: string [];
        /**
         * 是否压缩所选的视频源文件，默认值为true，需要压缩
         */
        compressed?: boolean;
        /**
         * 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
         */
        maxDuration?: number;
        /**
         * 摄像切换
         * - front: 前置摄像头
         * - back: 后置摄像头
         */
        camera?: 'front' | 'back';
        /**
         * 根据文件拓展名过滤，每一项都不能是空字符串。默认不过滤。
         */
        extension?: string [];
        /**
         * 接口调用成功，返回视频文件的临时文件路径，详见返回参数说明
         */
        success?: (result: ChooseVideoSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SaveVideoToPhotosAlbumOptions {
        /**
         * 视频文件路径，可以是临时文件路径也可以是永久文件路径
         */
        filePath: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ChooseVideoSuccess {
        /**
         * 选定视频的临时文件路径
         */
        tempFilePath: string;
        /**
         * 选定的视频文件
         */
        tempFile: File;
        /**
         * 选定视频的时间长度
         */
        duration: number;
        /**
         * 选定视频的数据量大小
         */
        size: number;
        /**
         * 返回选定视频的长
         */
        height: number;
        /**
         * 返回选定视频的宽
         */
        width: number;
        /**
         * 包含扩展名的文件名称（仅H5支持）
         */
        name: string;
    }

    interface VideoContext {
        /**
         * 暂停
         */
        pause(): void;
        /**
         * 播放
         */
        play(): void;
        /**
         * 跳转到指定位置，单位 s
         */
        seek(position: number): void;
        /**
         * 发送弹幕，danmu 包含两个属性 text, color。
         */
        sendDanmu(danmu: Danmu): void;
        /**
         * 设置倍速播放，支持的倍率有 0.5/0.8/1.0/1.25/1.5
         */
        playbackRate(rate: number): void;
        /**
         * 进入全屏，可传入{direction}参数（1.7.0起支持），详见video组件文档
         */
        requestFullScreen(direction?: RequestFullScreenOptions): void;
        /**
         * 退出全屏
         */
        exitFullScreen(): void;
    }

    interface Danmu {
        /**
         * 弹幕文字
         */
        text?: string;
        /**
         * 弹幕颜色
         */
        color?: string.ColorString | string;
    }

    interface RequestFullScreenOptions {
        /**
         * direction
         * - 0: 正常竖向
         * - 90: 屏幕逆时针90度
         * - -90: 屏幕顺时针90度
         */
        direction?: 0 | 90 | -90;
    }

    interface CameraContext {
        /**
         * 拍照，可指定质量，成功则返回图片
         */
        takePhoto(options: CameraContextTakePhotoOptions): void;
        /**
         * 开始录像
         */
        startRecord(options: CameraContextStartRecordOptions): void;
        /**
         * 结束录像，成功则返回封面与视频
         */
        stopRecord(options: CameraContextStopRecordOptions): void;
        /**
         * 结束录像，成功则返回封面与视频
         */
        onCameraFrame(callback: (result: CameraFrame) => void): void;
    }

    interface CameraContextTakePhotoOptions {
        /**
         * 成像质量，值为high, normal, low，默认normal
         * - normal: 普通质量
         * - high: 高质量
         * - low: 低质量
         */
        quality?: 'normal' | 'high' | 'low';
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CameraContextTakePhotoResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CameraContextTakePhotoResult {
        /**
         * 照片文件的临时路径，安卓是jpg图片格式，ios是png
         */
        tempImagePath: string;
    }

    interface CameraContextStartRecordOptions {
        /**
         * 超过30s或页面onHide时会结束录像
         */
        timeoutCallback?: (result: CameraContextStopRecordResult) => void;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CameraContextStopRecordOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CameraContextStopRecordResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CameraContextStopRecordResult {
        /**
         * 封面图片文件的临时路径
         */
        tempThumbPath: string;
        /**
         * 视频的文件的临时路径
         */
        tempVideoPath: string;
    }

    interface CameraFrame {
        /**
         * 图像数据矩形的宽度
         */
        width: number;
        /**
         * 图像数据矩形的高度
         */
        height: number;
        /**
         * 图像像素点数据，一维数组，每四项表示一个像素点的 rgba
         */
        data: ArrayBuffer;
    }

    interface LivePusherContext {
        /**
         * 开始推流
         */
        start(options?: LivePusherContextOptions): void;
        /**
         * 暂停推流
         */
        pause(options?: LivePusherContextOptions): void;
        /**
         * 恢复推流
         */
        resume(options?: LivePusherContextOptions): void;
        /**
         * 停止推流
         */
        stop(options?: LivePusherContextOptions): void;
        /**
         * 切换前后摄像头
         */
        switchCamera(options?: LivePusherContextOptions): void;
        /**
         * 快照
         */
        snapshot(options?: LivePusherContextOptions): void;
        /**
         * 开启摄像头预览
         */
        startPreview(options?: LivePusherContextOptions): void;
        /**
         * 关闭摄像头预览
         */
        stopPreview(options?: LivePusherContextOptions): void;
    }

    interface LivePusherContextOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SaveFileOptions {
        /**
         * 需要保存的文件的临时路径
         */
        tempFilePath: string;
        /**
         * 返回文件的保存路径，res = {savedFilePath: '文件的保存路径'}
         */
        success?: (result: SaveFileSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SaveFileSuccess {
        /**
         * 文件的保存路径
         */
        savedFilePath: string;
    }

    interface GetFileInfoOptions {
        /**
         * 本地路径
         */
        filePath: string;
        /**
         * 计算文件摘要的算法，默认值 md5，有效值：md5，sha1
         */
        digestAlgorithm?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetFileInfoSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetFileInfoSuccess {
        /**
         * 文件大小，单位：B
         */
        size: number;
        /**
         * 按照传入的 digestAlgorithm 计算得出的的文件摘要
         */
        digest?: string;
        /**
         * 调用结果
         */
        errMsg: string;
    }

    interface GetSavedFileListOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetSavedFileListSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSavedFileListSuccess {
        /**
         * 接口调用结果
         */
        errMsg: number;
        /**
         * 文件列表
         */
        fileList: GetSavedFileListSuccessFileItem [];
    }

    interface GetSavedFileListSuccessFileItem {
        /**
         * 文件的本地路径
         */
        filePath: string;
        /**
         * 文件的保存时的时间戳
         */
        createTime: number;
        /**
         * 文件大小，以字节为单位
         */
        size: number;
    }

    interface GetSavedFileInfoOptions {
        /**
         * 文件路径
         */
        filePath: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetSavedFileInfoSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSavedFileInfoSuccess {
        /**
         * 接口调用结果
         */
        errMsg: string;
        /**
         * 文件大小，单位B
         */
        size: number;
        /**
         * 文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数
         */
        createTime: number;
    }

    interface RemoveSavedFileOptions {
        /**
         * 文件路径
         */
        filePath: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OpenDocumentOptions {
        /**
         * 文件路径
         */
        filePath: string;
        /**
         * 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
         */
        fileType?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetStorageOptions {
        /**
         * 本地缓存中的指定的 key
         */
        key: string;
        /**
         * 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
         */
        data: any;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetStorageOptions<T = any> {
        /**
         * 本地缓存中的指定的 key
         */
        key: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetStorageSuccess<T>) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetStorageSuccess<T = any> {
        /**
         * 本地缓存中的指定的 key 对应的内容
         */
        data: T;
    }

    interface GetStorageInfoOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetStorageInfoSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetStorageInfoSuccess {
        /**
         * 当前storage中所有的 key
         */
        keys: string [];
        /**
         * 当前占用的空间大小, 单位 kb
         */
        currentSize: number;
        /**
         * 限制的空间大小，单位kb
         */
        limitSize: number;
    }

    interface RemoveStorageOptions {
        /**
         * 本地缓存中的指定的 key
         */
        key: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetLocationOptions {
        /**
         * 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于uni.openLocation的坐标
         */
        type?: string;
        /**
         * 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
         */
        altitude?: boolean;
        /**
         * 传入 true 会解析地址
         */
        geocode?: boolean;
        /**
         * 高精度定位超时时间(ms)，指定时间内返回最高精度，该值3000ms以上高精度定位才有效果
         */
        highAccuracyExpireTime?: number;
        /**
         * 开启高精度定位
         */
        isHighAccuracy?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetLocationSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetLocationSuccess {
        /**
         * 纬度，浮点数，范围为-90~90，负数表示南纬
         */
        latitude: number;
        /**
         * 经度，范围为-180~180，负数表示西经
         */
        longitude: number;
        /**
         * 速度，浮点数，单位m/s
         */
        speed: number;
        /**
         * 位置的精确度
         */
        accuracy: number;
        /**
         * 高度，单位 m
         */
        altitude: number;
        /**
         * 垂直精度，单位 m（Android 无法获取，返回 0）
         */
        verticalAccuracy: number;
        /**
         * 水平精度，单位 m
         */
        horizontalAccuracy: number;
        /**
         * 地址信息
         */
        address?: any;
    }

    interface StartLocationUpdateOption {
        /**
         * 指定坐标系类型，可以是 wgs84 或 gcj02
         */
        type?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: ChooseLocationSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OnLocationChangeCallbackResult {
        /**
         * 纬度，范围为 -90~90，负数表示南纬
         */
        latitude?: number;
        /**
         * 经度，范围为 -180~180，负数表示西经
         */
        longitude?: number;
        /**
         * 位置的精确度
         */
        accuracy?: number;
        /**
         * 高度，单位 m
         */
        altitude?: number;
        /**
         * 高度的精确度
         */
        altitudeAccuracy?: number;
        /**
         * 速度，单位 m/s
         */
        speed?: number;
        /**
         * 水平精度，单位 m
         */
        horizontalAccuracy?: number;
        /**
         * 垂直精度，单位 m（Android 无法获取，返回 0）
         */
        verticalAccuracy?: number;
    }

    interface ChooseLocationOptions {
        /**
         * 目标地纬度
         */
        latitude?: number;
        /**
         * 目标地经度
         */
        longitude?: number;
        /**
         * 搜索关键字
         */
        keyword?: string;
        /**
         * 使用安全网络请求地图ServiceApi参考：https://uniapp.dcloud.net.cn/api/location/location.html#chooselocation
         */
        useSecureNetwork?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: ChooseLocationSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ChooseLocationSuccess {
        /**
         * 位置名称
         */
        name: string;
        /**
         * 详细地址
         */
        address: string;
        /**
         * 纬度，浮点数，范围为-90~90，负数表示南纬
         */
        latitude: number;
        /**
         * 经度，范围为-180~180，负数表示西经
         */
        longitude: number;
    }

    interface OpenLocationOptions {
        /**
         * 纬度，范围为-90~90，负数表示南纬
         */
        latitude: number;
        /**
         * 经度，范围为-180~180，负数表示西经
         */
        longitude: number;
        /**
         * 缩放比例，范围5~18，默认为18
         */
        scale?: number;
        /**
         * 位置名称
         */
        name?: string;
        /**
         * 地址的详细说明
         */
        address?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSystemInfoOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetSystemInfoResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSystemInfoResult {
        /**
         * 客户端基础库版本
         */
        SDKVersion: string;
        /**
         * 当前运行的客户端
         */
        app?: string;
        /**
         * `manifest.json` 中应用appid。
         */
        appId: string;
        /**
         * 应用设置的语言。仅 App、H5 支持
         */
        appLanguage?: string;
        /**
         * `manifest.json` 中应用名称。和`字节跳动小程序、飞书小程序`字段冲突，原字端与`hostName`一致
         */
        appName: string;
        /**
         * `manifest.json` 中应用版本名称。
         */
        appVersion: string;
        /**
         * `manifest.json` 中应用版本名号
         */
        appVersionCode: string;
        /**
         * 应用资源（wgt）的版本名称。（仅 App 支持）
         */
        appWgtVersion?: string;
        /**
         * 手机品牌。H5 不支持
         */
        brand?: string;
        /**
         * 浏览器名称。`App` 端是系统 webview 的名字，比如 wkwebview、chrome。小程序端为空
         */
        browserName: string;
        /**
         * 浏览器版本、webview 版本。小程序端为空
         */
        browserVersion: string;
        /**
         * 设备 ID
         */
        deviceId: string;
        /**
         * 设备品牌。如：`apple`、`huawei`。H5 不支持
         */
        deviceBrand?: string;
        /**
         * 设备型号
         */
        deviceModel: string;
        /**
         * 设备类型。`phone`、`pad`、`pc`
         */
        deviceType: string;
        /**
         * 设备像素比
         */
        devicePixelRatio: number;
        /**
         * 设备方向。如：`竖屏 portrait`、`横屏 landscape`
         * - portrait: 竖屏
         * - landscape: 横屏
         */
        deviceOrientation: 'portrait' | 'landscape';
        /**
         * 用户字体大小设置
         */
        fontSizeSetting?: number;
        /**
         * 宿主平台
         */
        host?: string;
        /**
         * 用户字体大小设置
         */
        hostFontSizeSetting?: number;
        /**
         * 客户端基础库版本
         */
        hostSDKVersion?: string;
        /**
         * App、小程序宿主名称，如：`WeChat`、`FeiShu`、`alipay`、`DINGTALK`。H5 不支持
         */
        hostName?: string;
        /**
         * App、小程序宿主版本。如：微信版本号。H5 不支持
         */
        hostVersion?: string;
        /**
         * 小程序宿主语言、app 语言
         */
        hostLanguage?: string;
        /**
         * App 主题 `light`、`dark`。H5 端为空，小程序端为系统当前主题
         */
        hostTheme?: string;
        /**
         * 小程序宿主包名。仅 App 支持，其他平台为空
         */
        hostPackageName?: string;
        /**
         * 程序设置的语言
         */
        language?: string;
        /**
         * 手机型号
         */
        model: string;
        /**
         * ios、android、windows、mac、linux
         */
        osName: string;
        /**
         * 操作系统版本。如 ios 版本，andriod 版本
         */
        osVersion: string;
        /**
         * 操作系统语言，小程序端与 `version` 相同，H5 与浏览器语言一致
         */
        osLanguage?: string;
        /**
         * |操作系统主题 light、dark。小程序端为小程序主题，H5 端为空
         */
        osTheme?: string;
        /**
         * 设备像素比
         */
        pixelRatio: number;
        /**
         * 客户端平台
         */
        platform: string;
        /**
         * 屏幕宽度
         */
        screenWidth: number;
        /**
         * 屏幕高度
         */
        screenHeight: number;
        /**
         * 状态栏的高度
         */
        statusBarHeight?: number;
        /**
         * 设备磁盘容量
         */
        storage?: string;
        /**
         * 宿主平台版本号
         */
        swanNativeVersion?: string;
        /**
         * 操作系统版本
         */
        system: string;
        /**
         * 在竖屏正方向下的安全区域
         */
        safeArea?: SafeArea;
        /**
         * 在竖屏正方向下的安全区域插入位置
         */
        safeAreaInsets?: SafeAreaInsets;
        /**
         * 用户标识。小程序端为空
         */
        ua: string;
        /**
         * uni 编译器版本号
         */
        uniCompileVersion: string;
        /**
         * uni-app 运行平台。如：`app`、`mp-weixin`、`web`
         */
        uniPlatform: string;
        /**
         * uni 运行时版本
         */
        uniRuntimeVersion: string;
        /**
         * 引擎版本号
         */
        version: string;
        /**
         * rom 名称。Android 部分机型获取不到值。iOS 恒为 `ios`
         */
        romName?: string;
        /**
         * rom 版本号。Android 部分机型获取不到值。iOS 恒为 `ios 版本号`
         */
        romVersion?: string;
        /**
         * 可使用窗口宽度
         */
        windowWidth: number;
        /**
         * 可使用窗口高度
         */
        windowHeight: number;
        /**
         * 导航栏的高度
         */
        navigationBarHeight?: number;
        /**
         * 标题栏高度
         */
        titleBarHeight?: number;
        /**
         * 当前电量百分比
         */
        currentBattery?: string;
        /**
         * App平台
         */
        AppPlatform?: string;
        /**
         * 可使用窗口的顶部位置
         */
        windowTop: number;
        /**
         * 可使用窗口的底部位置
         */
        windowBottom: number;
        /**
         * 允许微信使用相册的开关（仅 iOS 有效）
         */
        albumAuthorized?: boolean;
        /**
         * 允许微信使用摄像头的开关
         */
        cameraAuthorized?: boolean;
        /**
         * 允许微信使用定位的开关
         */
        locationAuthorized?: boolean;
        /**
         * 允许微信使用麦克风的开关
         */
        microphoneAuthorized?: boolean;
        /**
         * 允许微信通知的开关
         */
        notificationAuthorized?: boolean;
        /**
         * 允许微信通知带有提醒的开关（仅 iOS 有效）
         */
        notificationAlertAuthorized?: boolean;
        /**
         * 允许微信通知带有标记的开关（仅 iOS 有效）
         */
        notificationBadgeAuthorized?: boolean;
        /**
         * 允许微信通知带有声音的开关（仅 iOS 有效）
         */
        notificationSoundAuthorized?: boolean;
        /**
         * 蓝牙的系统开关
         */
        bluetoothEnabled?: boolean;
        /**
         * 地理位置的系统开关
         */
        locationEnabled?: boolean;
        /**
         * Wi-Fi 的系统开关
         */
        wifiEnabled?: boolean;
        /**
         * 上一次缓存的位置信息
         */
        cacheLocation?: any;
        /**
         * 系统当前主题，取值为light或dark。仅微信小程序支持
         */
        theme?: string;
    }

    interface GetWindowInfoResult {
        /**
         * 设备像素比
         */
        pixelRatio: number;
        /**
         * 屏幕宽度
         */
        screenWidth: number;
        /**
         * 屏幕高度
         */
        screenHeight: number;
        /**
         * 可使用窗口宽度
         */
        windowWidth: number;
        /**
         * 可使用窗口高度
         */
        windowHeight: number;
        /**
         * 状态栏的高度
         */
        statusBarHeight: number;
        /**
         * 可使用窗口的顶部位置
         */
        windowTop: number;
        /**
         * 可使用窗口的底部位置
         */
        windowBottom: number;
        /**
         * 在竖屏正方向下的安全区域
         */
        safeArea: SafeArea;
        /**
         * 在竖屏正方向下的安全区域插入位置
         */
        safeAreaInsets: SafeAreaInsets;
        /**
         * 窗口上边缘的 y 值
         */
        screenTop: number;
    }

    interface GetDeviceInfoResult {
        /**
         * 设备品牌。如：`apple`、`huawei`。H5 不支持
         */
        deviceBrand?: string;
        /**
         * 设备型号
         */
        deviceModel: string;
        /**
         * 设备 ID
         */
        deviceId: string;
        /**
         * 设备类型。`phone`、`pad`、`pc`
         */
        deviceType: string;
        /**
         * 设备像素比
         */
        devicePixelRatio: number;
        /**
         * 设备方向。如：`竖屏 portrait`、`横屏 landscape`
         * - portrait: 竖屏
         * - landscape: 横屏
         */
        deviceOrientation: 'portrait' | 'landscape';
        /**
         * 手机品牌。H5 不支持
         */
        brand?: string;
        /**
         * 手机型号
         */
        model: string;
        /**
         * 操作系统版本
         */
        system: string;
        /**
         * 客户端平台
         */
        platform: string;
    }

    interface GetAppBaseInfoResult {
        /**
         * `manifest.json` 中应用appid。
         */
        appId: string;
        /**
         * `manifest.json` 中应用名称。和`字节跳动小程序、飞书小程序`字段冲突，原字端与`hostName`一致
         */
        appName: string;
        /**
         * `manifest.json` 中应用版本名称。
         */
        appVersion: string;
        /**
         * `manifest.json` 中应用版本名号
         */
        appVersionCode: string;
        /**
         * 应用资源（wgt）的版本名称。（仅 App 支持）
         */
        appWgtVersion?: string;
        /**
         * 程序设置的语言
         */
        language: string;
        /**
         * 引擎版本号
         */
        version: string;
        /**
         * App、小程序宿主名称，如：`WeChat`、`FeiShu`、`alipay`、`DINGTALK`。H5 端为浏览器名称
         */
        hostName?: string;
        /**
         * App、小程序宿主版本。如：微信版本号。H5 端为浏览器版本
         */
        hostVersion?: string;
        /**
         * 浏览器语言、小程序宿主语言、app 语言
         */
        hostLanguage?: string;
        /**
         * App 主题 `light`、`dark`。H5 端为空，小程序端为系统当前主题
         */
        hostTheme?: string;
        /**
         * 小程序宿主包名。仅 App 支持，其他平台为空
         */
        hostPackageName?: string;
        /**
         * 系统当前主题，取值为light或dark。仅微信小程序支持
         */
        theme?: string;
        /**
         * 客户端基础库版本。仅支付宝小程序不支持
         */
        SDKVersion: string;
        /**
         * 是否已打开调试本。仅微信小程序支持
         */
        enableDebug: boolean;
        /**
         * 当前小程序运行的宿主环境。仅微信小程序支持
         */
        host?: string;
        /**
         * 应用设置的语言。仅 App、H5 支持
         */
        appLanguage?: string;
        /**
         * 用户字体大小设置
         */
        hostFontSizeSetting?: number;
        /**
         * 客户端基础库版本
         */
        hostSDKVersion?: string;
    }

    interface SafeArea {
        /**
         * 安全区域左上角横坐标
         */
        left: number;
        /**
         * 安全区域右下角横坐标
         */
        right: number;
        /**
         * 安全区域左上角纵坐标
         */
        top: number;
        /**
         * 安全区域右下角纵坐标
         */
        bottom: number;
        /**
         * 安全区域的宽度，单位逻辑像素
         */
        width: number;
        /**
         * 安全区域的高度，单位逻辑像素
         */
        height: number;
    }

    interface SafeAreaInsets {
        /**
         * 安全区域左侧插入位置
         */
        left: number;
        /**
         * 安全区域右侧插入位置
         */
        right: number;
        /**
         * 安全区顶部插入位置
         */
        top: number;
        /**
         * 安全区域底部插入位置
         */
        bottom: number;
    }

    interface GetAppAuthorizeSettingResult {
        /**
         * 允许 App 使用相册的开关（仅 iOS 支持）
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         */
        albumAuthorized?: 'authorized' | 'denied' | 'not determined';
        /**
         * 允许 App 使用蓝牙的开关（仅 iOS 支持）
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: Android平台没有该值；iOS平台：表示没有在 `manifest.json -> App模块配置` 中配置 `BlueTooth(低功耗蓝牙)` 模块
         */
        bluetoothAuthorized?: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 允许 App 使用摄像头的开关
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: Android平台：表示没有授予 `android.permission.CAMERA` 权限；iOS平台没有该值
         */
        cameraAuthorized: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 允许 App 使用定位的开关
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: Android平台：表示没有授予 `android.permission.ACCESS_COARSE_LOCATION` 权限；iOS平台：表示没有在 `manifest.json -> App模块配置` 中配置 `Geolocation(定位)` 模块
         */
        locationAuthorized: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 定位准确度。true 表示模糊定位，false 表示精确定位（仅 iOS 支持）
         * - reduced: 模糊定位
         * - full: 精准定位
         * - unsupported: 不支持（包括用户拒绝定位权限和没有在 `manifest.json -> App模块配置` 中配置 `Geolocation(定位)` 模块）
         */
        locationAccuracy?: 'reduced' | 'full' | 'unsupported';
        /**
         * 定位准确度（推荐使用 locationAccuracy 属性）。true 表示模糊定位，false 表示精确定位（仅 iOS 支持）
         */
        locationReducedAccuracy?: boolean;
        /**
         * 允许 App 使用麦克风的开关
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: Android平台：表示没有授予 `android.permission.RECORD_AUDIO` 权限；iOS平台没有该值
         */
        microphoneAuthorized: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 允许 App 通知的开关
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: Android平台没有该值；iOS平台：表示没有在 `manifest.json -> App模块配置` 中配置 `Push(推送)` 模块
         */
        notificationAuthorized: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 允许 App 通知带有提醒的开关（仅 iOS 10.0+ 支持）
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: 没有在 `manifest.json -> App模块配置` 中配置 `Push(推送)` 模块
         */
        notificationAlertAuthorized?: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 允许 App 通知带有标记的开关（仅 iOS 10.0+ 支持）
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: 没有在 `manifest.json -> App模块配置` 中配置 `Push(推送)` 模块
         */
        notificationBadgeAuthorized?: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 允许 App 通知带有声音的开关（仅 iOS 10.0+ 支持）
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         * - config error: 没有在 `manifest.json -> App模块配置` 中配置 `Push(推送)` 模块
         */
        notificationSoundAuthorized?: 'authorized' | 'denied' | 'not determined' | 'config error';
        /**
         * 允许读写日历的开关（仅微信小程序支持）
         * - authorized: 已经获得授权，无需再次请求授权
         * - denied: 请求授权被拒绝，无法再次请求授权；（此情况需要引导用户打开系统设置，在设置页中打开权限）
         * - not determined: 尚未请求授权，会在App下一次调用系统相应权限时请求；（仅 iOS 会出现。此种情况下引导用户打开系统设置，不展示开关）
         */
        phoneCalendarAuthorized?: 'authorized' | 'denied' | 'not determined';
    }

    interface GetsystemsettingResult {
        /**
         * 蓝牙的系统开关。当值为 `false` 时，App端：有可能是没有权限或模块配置错误导致，此时会返回 `bluetoothError` 属性描述错误。
         */
        bluetoothEnabled: boolean;
        /**
         * App端，Android平台没有权限或者iOS平台模块配置错误时返回字符串，否则不返回此属性
         * - Missing permissions required by BluetoothAdapter.isEnabled: android.permission.BLUETOOTH: Android平台没有 `android.permission.BLUETOOTH` 权限
         * - Missing bluetooth module in manifest.json: iOS平台没有在 `manifest.json -> App模块配置` 中配置 `BlueTooth(低功耗蓝牙)` 模块
         */
        bluetoothError?: 'Missing permissions required by BluetoothAdapter.isEnabled: android.permission.BLUETOOTH' | 'Missing bluetooth module in manifest.json';
        /**
         * 地理位置的系统开关。当值为 `false` 时，App端：Android平台是准确的；iOS平台有可能是模块配置错误导致，此时会返回 `locationError` 属性描述错误。
         */
        locationEnabled: boolean;
        /**
         * App端：Android平台不返回此属性；iOS平台模块配置错误时返回字符串，否则不返回此属性
         * - Missing bluetooth module in manifest.json: iOS平台没有没有在 `manifest.json -> App模块配置` 中配置 `Geolocation(定位)` 模块
         */
        locationError?: 'Missing bluetooth module in manifest.json';
        /**
         * Wi-Fi 的系统开关
         */
        wifiEnabled: boolean;
        /**
         * 设备方向。`竖屏：portrait`，`横屏：landscape`
         * - portrait: 竖屏
         * - landscape: 横屏
         */
        deviceOrientation: 'portrait' | 'landscape';
    }

    interface GetNetworkTypeOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetNetworkTypeSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetNetworkTypeSuccess {
        /**
         * 网络类型
         */
        networkType: string;
    }

    interface OnNetworkStatusChangeSuccess {
        /**
         * 当前是否有网络连接
         */
        isConnected: boolean;
        /**
         * 网络类型
         */
        networkType: string;
    }

    interface OnKeyboardHeightChangeResult {
        /**
         * 键盘高度
         */
        height: number;
    }

    interface OnAccelerometerChangeSuccess {
        /**
         * X 轴
         */
        x: number;
        /**
         * Y 轴
         */
        y: number;
        /**
         * Z 轴
         */
        z: number;
    }

    interface StartAccelerometerOptions {
        /**
         * interval
         * - game: 适用于更新游戏的回调频率，在 20ms/次 左右
         * - ui: 适用于更新游戏的回调频率，在 20ms/次 左右
         * - normal: 普通的回调频率，在 200ms/次 左右
         */
        interval?: 'game' | 'ui' | 'normal';
        /**
         * 成功返回的回调函数
         */
        success?: (result: any) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopAccelerometerOptions {
        /**
         * 成功返回的回调函数
         */
        success?: (result: any) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OnCompassChangeSuccess {
        /**
         * 面对的方向度数
         */
        direction: number;
    }

    interface StartCompassOptions {
        /**
         * 成功返回的回调函数
         */
        success?: (result: any) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopCompassOptions {
        /**
         * 成功返回的回调函数
         */
        success?: (result: any) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface MakePhoneCallOptions {
        /**
         * 需要拨打的电话号码
         */
        phoneNumber: string;
        /**
         * 成功返回的回调函数
         */
        success?: (result: any) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ScanCodeOptions {
        /**
         * 是否只能从相机扫码，不允许从相册选择图片
         */
        onlyFromCamera?: boolean;
        /**
         * 扫码类型，参数类型是数组，二维码是'qrCode'，一维码是'barCode'，DataMatrix是‘datamatrix’，pdf417是‘pdf417’。
         */
        scanType?: any [];
        /**
         * 自动解码字符集，默认 false。可取值：false - 将二维码解码数据当做utf-8字符集处理，对于非utf-8字符集数据可能会出现乱码。true - 自动检测二维码解码数据，兼容处理utf-8、GBK、Big5编码格式的字符。仅App端支持
         */
        autoDecodeCharSet?: boolean;
        /**
         * 是否启用声音，可选值：none、default，默认 none。仅App端支持
         * - none: 扫描成功不播放声音
         * - default: 扫描成功播放声音
         */
        sound?: 'none' | 'default';
        /**
         * 是否启用自动放大，默认启用。仅 App-Android 端支持
         */
        autoZoom?: boolean;
        /**
         * 成功返回的回调函数
         */
        success?: (result: ScanCodeSuccessRes) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ScanCodeSuccessRes {
        /**
         * 所扫码的内容
         */
        result: string;
        /**
         * 所扫码的类型
         */
        scanType: string;
        /**
         * 所扫码的字符集
         */
        charSet: string;
        /**
         * 当所扫的码为当前应用的合法二维码时，会返回此字段，内容为二维码携带的 path。
         */
        path: string;
    }

    interface SetClipboardDataOptions {
        /**
         * 需要设置的内容
         */
        data: string;
        /**
         * 是否弹出提示，默认弹出提示
         */
        showToast?: boolean;
        /**
         * 成功返回的回调函数
         */
        success?: (result: any) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetClipboardDataOptions {
        /**
         * 成功返回的回调函数
         */
        success?: (result: GetClipboardDataSuccessRes) => void;
        /**
         * 失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetClipboardDataSuccessRes {
        /**
         * 剪贴板的内容
         */
        data: string;
    }

    interface OpenBluetoothAdapterOptions {
        /**
         * 成功则返回成功初始化信息
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CloseBluetoothAdapterOptions {
        /**
         * 成功则返回成功关闭模块信息
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBluetoothAdapterStateOptions {
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: GetBluetoothAdapterStateSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBluetoothAdapterStateSuccess {
        /**
         * 是否正在搜索设备
         */
        discovering: boolean;
        /**
         * 蓝牙适配器是否可用
         */
        available: boolean;
        /**
         * 成功：ok，错误：详细信息
         */
        errMsg: string;
    }

    interface OnBluetoothAdapterStateChangeResult {
        /**
         * 是否正在搜索设备
         */
        discovering: boolean;
        /**
         * 蓝牙适配器是否可用
         */
        available: boolean;
    }

    interface OnBluetoothDeviceFoundResult {
        /**
         * 设备列表信息
         */
        devices: BluetoothDeviceInfo [];
    }

    interface StartBluetoothDevicesDiscoveryOptions {
        /**
         * 蓝牙设备主 service 的 uuid 列表
         */
        services?: any [];
        /**
         * 是否允许重复上报同一设备， 如果允许重复上报，则onDeviceFound 方法会多次上报同一设备，但是 RSSI 值会有不同
         */
        allowDuplicatesKey?: boolean;
        /**
         * 上报设备的间隔，默认为0，意思是找到新设备立即上报，否则根据传入的间隔上报
         */
        interval?: number;
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopBluetoothDevicesDiscoveryOptions {
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: StopBluetoothDevicesDiscoverySuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopBluetoothDevicesDiscoverySuccess {
        /**
         * 成功：ok，错误：详细信息
         */
        errMsg: string;
    }

    interface GetBluetoothDevicesOptions {
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: GetBluetoothDevicesSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBluetoothDevicesSuccess {
        /**
         * uuid 对应的的已连接设备列表
         */
        devices: BluetoothDeviceInfo [];
        /**
         * 成功：ok，错误：详细信息
         */
        errMsg: string;
    }

    interface BluetoothDeviceInfo {
        /**
         * 蓝牙设备名称，某些设备可能没有
         */
        name: string;
        /**
         * 用于区分设备的 id
         */
        deviceId: string;
        /**
         * 当前蓝牙设备的信号强度
         */
        RSSI: number;
        /**
         * 当前蓝牙设备的广播数据段中的ManufacturerData数据段 （注意：vConsole 无法打印出 ArrayBuffer 类型数据）
         */
        advertisData: any [];
        /**
         * 当前蓝牙设备的广播数据段中的ServiceUUIDs数据段
         */
        advertisServiceUUIDs: any [];
        /**
         * 当前蓝牙设备的广播数据段中的LocalName数据段
         */
        localName: string;
        /**
         * 当前蓝牙设备的广播数据段中的ServiceData数据段
         */
        serviceData: any [];
    }

    interface GetConnectedBluetoothDevicesOptions {
        /**
         * 蓝牙设备主 service 的 uuid 列表
         */
        services: any [];
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: GetConnectedBluetoothDevicesSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetConnectedBluetoothDevicesSuccess {
        /**
         * 搜索到的设备列表
         */
        devices: GetConnectedBluetoothDevicesSuccessData [];
        /**
         * 成功：ok，错误：详细信息
         */
        errMsg: string;
    }

    interface GetConnectedBluetoothDevicesSuccessData {
        /**
         * 蓝牙设备名称，某些设备可能没有
         */
        name: string;
        /**
         * 用于区分设备的 id
         */
        deviceId: string;
    }

    interface CloseBLEConnectionOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
    }

    interface CreateBLEConnectionOptions {
        /**
         * 蓝牙设备 id，参考 getDevices 接口
         */
        deviceId: string;
        /**
         * 超时时间
         */
        timeout?: number;
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OnBLEConnectionStateChangeSuccess {
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
        /**
         * 连接目前的状态
         */
        connected: boolean;
    }

    interface GetBLEDeviceServicesOptions {
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: GetBLEDeviceServicesSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBLEDeviceServicesSuccess {
        /**
         * 设备服务列表
         */
        services: GetBLEDeviceServicesSuccessData [];
        /**
         * 成功：ok，错误：详细信息
         */
        errMsg: string;
    }

    interface GetBLEDeviceServicesSuccessData {
        /**
         * 蓝牙设备服务的 uuid
         */
        uuid: string;
        /**
         * 该服务是否为主服务
         */
        isPrimary: boolean;
    }

    interface GetBLEDeviceCharacteristicsOptions {
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
        /**
         * 蓝牙服务 uuid
         */
        serviceId: string;
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: GetBLEDeviceCharacteristicsSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBLEDeviceCharacteristicsSuccess {
        /**
         * 设备特征值列表
         */
        characteristics: GetBLEDeviceCharacteristicsSuccessData [];
        /**
         * 成功：ok，错误：详细信息
         */
        errMsg: string;
    }

    interface GetBLEDeviceCharacteristicsSuccessData {
        /**
         * 蓝牙设备服务的 uuid
         */
        uuid: string;
        /**
         * 该特征值支持的操作类型
         */
        properties: any;
    }

    interface ReadBLECharacteristicValueOptions {
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
        /**
         * 蓝牙特征值对应服务的 uuid
         */
        serviceId: string;
        /**
         * 蓝牙特征值的 uuid
         */
        characteristicId: string;
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: ReadBLECharacteristicValueSuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ReadBLECharacteristicValueSuccess {
        /**
         * 错误码
         */
        errCode: string;
        /**
         * 成功：ok，错误：详细信息
         */
        errMsg: string;
    }

    interface WriteBLECharacteristicValueOptions {
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
        /**
         * 蓝牙特征值对应服务的 uuid
         */
        serviceId: string;
        /**
         * 蓝牙特征值的 uuid
         */
        characteristicId: string;
        /**
         * 蓝牙设备特征值对应的二进制值
         */
        value: any [];
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: StopBluetoothDevicesDiscoverySuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface NotifyBLECharacteristicValueChangeOptions {
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
        /**
         * 蓝牙特征值对应服务的 uuid
         */
        serviceId: string;
        /**
         * 蓝牙特征值的 uuid
         */
        characteristicId: string;
        /**
         * true: 启用 notify; false: 停用 notify
         */
        state: boolean;
        /**
         * 成功则返回本机蓝牙适配器状态
         */
        success?: (result: StopBluetoothDevicesDiscoverySuccess) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OnBLECharacteristicValueChangeSuccess {
        /**
         * 蓝牙设备 id，参考 device 对象
         */
        deviceId: string;
        /**
         * 蓝牙特征值对应服务的 uuid
         */
        serviceId: string;
        /**
         * 蓝牙特征值的 uuid
         */
        characteristicId: string;
        /**
         * 特征值最新的值 （注意：vConsole 无法打印出 ArrayBuffer 类型数据）
         */
        value: any [];
    }

    interface StartBeaconDiscoveryOptions {
        /**
         * iBeacon设备广播的 uuids
         */
        uuids: any [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopBeaconDiscoveryOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetBLEMTUOptions {
        /**
         * 用于区分设备的 id
         */
        deviceId: string;
        /**
         * 最大传输单元(22,512) 区间内，单位 bytes
         */
        mtu: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBLEDeviceRSSIOptions {
        /**
         * 蓝牙设备 id
         */
        deviceId: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBeaconsOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetBeaconsRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetBeaconsRes {
        /**
         * 接口调用成功的回调函数
         */
        beacons: Beacon [];
        /**
         * 调用结果
         */
        errMsg: string;
    }

    interface Beacon {
        /**
         * iBeacon 设备广播的 uuid
         */
        uuid: string;
        /**
         * iBeacon 设备的主 id
         */
        major: string;
        /**
         * iBeacon 设备的次 id
         */
        minor: string;
        /**
         * 表示设备距离的枚举值
         */
        proximity: number;
        /**
         * iBeacon 设备的距离
         */
        accuracy: number;
        /**
         * 表示设备的信号强度
         */
        rssi: number;
    }

    interface BeaconService {
        /**
         * 服务目前是否可用
         */
        available: boolean;
        /**
         * 目前是否处于搜索状态
         */
        discovering: boolean;
    }

    interface GetHCEStateOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StartHCEOptions {
        /**
         * 需要注册到系统的 AID 列表，每个 AID 为 String 类型
         */
        aid_list: any [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopHCEOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface HCEMessageRes {
        /**
         * 消息类型
         */
        messageType: number;
        /**
         * 客户端接收到 NFC 设备的指令
         */
        data: any [];
        /**
         * 此参数当且仅当 messageType=2 时有效
         */
        reason: number;
    }

    interface SendHCEMessageOptions {
        /**
         * 二进制数据
         */
        data: any [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StartWifiOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopWifiOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ConnectWifiOptions {
        /**
         * Wi-Fi 设备ssid
         */
        SSID: string;
        /**
         * Wi-Fi 设备bssid
         */
        BSSID?: string;
        /**
         * Wi-Fi 设备密码
         */
        password?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetWifiListOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface WiFi {
        /**
         * Wi-Fi 的SSID
         */
        SSID: string;
        /**
         * Wi-Fi 的BSSID
         */
        BSSID: string;
        /**
         * Wi-Fi 是否安全
         */
        secure: boolean;
        /**
         * Wi-Fi 信号强度
         */
        signalStrength: number;
    }

    interface SetWifiListOptions {
        /**
         * Wi-Fi 的SSID
         */
        wifiList: WiFiItem [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface WiFiItem {
        /**
         * Wi-Fi 的SSID
         */
        SSID: string;
        /**
         * Wi-Fi 的BSSID
         */
        BSSID: string;
        /**
         * Wi-Fi 设备密码
         */
        password: string;
    }

    interface GetConnectedWifiOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetConnectedWifiRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetConnectedWifiRes {
        /**
         * 接口调用成功的回调函数
         */
        wifi: WiFi;
    }

    interface ShowToastOptions {
        /**
         * 提示的内容
         */
        title?: string;
        /**
         * 图标
         * - success: 显示成功图标
         * - loading: 显示加载图标
         * - error: 显示错误图标
         * - none: 不显示图标
         * - fail: 显示错误图标，此时 title 文本无长度显示，仅支付宝小程序、字节小程序
         * - exception: 显示异常图标。此时 title 文本无长度显示，仅支付宝小程序
         */
        icon?: 'success' | 'loading' | 'error' | 'none' | 'fail' | 'exception';
        /**
         * 自定义图标的本地路径，image 的优先级高于 icon
         */
        image?: string;
        /**
         * 提示的延迟时间，单位毫秒，默认：1500
         */
        duration?: number;
        /**
         * 纯文本轻提示显示位置，填写有效值后只有 title 属性生效
         * - top: 居上显示
         * - center: 居中显示
         * - bottom: 居底显示
         */
        position?: 'top' | 'center' | 'bottom';
        /**
         * 是否显示透明蒙层，防止触摸穿透，默认：false
         */
        mask?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ShowLoadingOptions {
        /**
         * 提示的内容
         */
        title?: string;
        /**
         * 是否显示透明蒙层，防止触摸穿透，默认：false
         */
        mask?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ShowModalOptions {
        /**
         * 提示的标题
         */
        title?: string;
        /**
         * 提示的内容
         */
        content?: string;
        /**
         * 是否显示取消按钮，默认为 true
         */
        showCancel?: boolean;
        /**
         * 取消按钮的文字，默认为"取消"
         */
        cancelText?: string;
        /**
         * 取消按钮的文字颜色，默认为"#000000"
         */
        cancelColor?: string.ColorString | string;
        /**
         * 确定按钮的文字，默认为"确定"
         */
        confirmText?: string;
        /**
         * 确定按钮的文字颜色，默认为"#3CC51F"
         */
        confirmColor?: string.ColorString | string;
        /**
         * 是否显示输入框
         */
        editable?: boolean;
        /**
         * 显示输入框时的提示文本
         */
        placeholderText?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: ShowModalRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ShowModalRes {
        /**
         * 为 true 时，表示用户点击了确定按钮
         */
        confirm: boolean;
        /**
         * 为 true 时，表示用户点击了取消
         */
        cancel: boolean;
        /**
         * editable 为 true 时，用户输入的文本
         */
        content?: string;
    }

    interface ShowActionSheetOptions {
        /**
         * 菜单标题
         */
        title?: string;
        /**
         * 警示文案（同菜单标题）
         */
        alertText?: string;
        /**
         * 按钮的文字数组
         */
        itemList: any [];
        /**
         * 按钮的文字颜色，默认为"#000000"
         */
        itemColor?: string.ColorString | string;
        /**
         * 大屏设备弹出原生选择按钮框的指示区域，默认居中显示
         */
        popover?: ShowActionPopover;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: ShowActionSheetRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ShowActionSheetRes {
        /**
         * 用户点击的按钮，从上到下的顺序，从0开始
         */
        tapIndex: number;
    }

    interface ShowActionPopover {
        /**
         * 指示区域坐标，使用原生 navigationBar 时一般需要加上 navigationBar 的高度
         */
        top?: number;
        /**
         * 指示区域坐标
         */
        left?: number;
        /**
         * 指示区域宽度
         */
        width?: number;
        /**
         * 指示区域高度
         */
        height?: number;
    }

    interface SetNavigationBarTitleOptions {
        /**
         * 页面标题
         */
        title: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetNavigationbarColorOptions {
        /**
         * 前景颜色值，包括按钮、标题、状态栏的颜色
         */
        frontColor?: string.ColorString | string;
        /**
         * 背景颜色值，有效值为十六进制颜色
         */
        backgroundColor?: string.ColorString | string;
        /**
         * 动画效果
         */
        animation?: NavigationBarAnimation;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetTabBarBadgeOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 显示的文本，不超过 3 个半角字符
         */
        text: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface RemoveTabBarBadgeOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ShowTabBarRedDotOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface HideTabBarRedDotOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface NavigationBarAnimation {
        /**
         * 动画变化时间，默认0，单位：毫秒
         */
        duration: number;
        /**
         * 动画变化方式，默认 linear
         * - linear: 动画从头到尾的速度是相同的
         * - easeIn: 动画以低速开始
         * - easeOut: 动画以低速结束
         * - easeInOut: 动画以低速开始和结束
         */
        timingFunc: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
    }

    interface WindowResizeResult {
        /**
         * 变化后的窗口的大小，单位为 px ，{windowWidth,windowHeight}
         */
        size: WindowResizeResultSize;
        /**
         * 变化后的设备方向
         * - landscape: undefined
         * - portrait: undefined
         */
        deviceOrientation: 'landscape' | 'portrait';
    }

    interface WindowResizeResultSize {
        /**
         * 变化后的窗口宽度，单位 px
         */
        windowWidth: number;
        /**
         * 变化后的窗口高度，单位 px
         */
        windowHeight: number;
    }

    interface SetTabBarBadgeOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 显示的文本
         */
        text: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface RemoveTabBarBadgeOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ShowTabBarRedDotOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface HideTabBarRedDotOptions {
        /**
         * tabBar的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetTabBarStyleOptions {
        /**
         * tab 上的文字默认颜色
         */
        color?: string.ColorString | string;
        /**
         * tab 上的文字选中时的颜色
         */
        selectedColor?: string.ColorString | string;
        /**
         * tab 的背景色
         */
        backgroundColor?: string.ColorString | string;
        /**
         * 图片背景
         */
        backgroundImage?: string;
        /**
         * 背景图平铺方式
         * - repeat: 背景图片在垂直方向和水平方向平铺
         * - repeat-x: 背景图片在水平方向平铺，垂直方向拉伸
         * - repeat-y: 背景图片在垂直方向平铺，水平方向拉伸
         * - no-repeat: 背景图片在垂直方向和水平方向都拉伸
         */
        backgroundRepeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
        /**
         * tabbar上边框的颜色
         */
        borderStyle?: string;
        /**
         * tabbar 中间按钮 仅在 list 项为偶数时有效
         */
        midButton?: MidButtonOptions;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface MidButtonOptions {
        /**
         * 中间按钮的宽度，tabBar 其它项为减去此宽度后平分，默认值为与其它项平分宽度。默认 80px
         */
        width?: string;
        /**
         * 中间按钮的高度，可以大于 tabBar 高度，达到中间凸起的效果。默认 50px
         */
        height?: string;
        /**
         * 中间按钮的文字
         */
        text?: string;
        /**
         * 中间按钮的图片路径
         */
        iconPath?: string;
        /**
         * 图片宽度（高度等比例缩放）。默认 24px
         */
        iconWidth?: string;
        /**
         * 中间按钮的背景图片路径
         */
        backgroundImage?: string;
        /**
         * 字体图标，优先级高于 iconPath
         */
        iconfont?: MidButtonIconFont;
    }

    interface MidButtonIconFont {
        /**
         * 字库 Unicode 码
         */
        text?: string;
        /**
         * 选中后字库 Unicode 码
         */
        selectedText?: string;
        /**
         * 字体图标字号(px)
         */
        fontSize?: string;
        /**
         * 字体图标颜色
         */
        color?: string;
        /**
         * 字体图标选中颜色
         */
        selectedColor?: string;
    }

    interface SetTabBarItemOptions {
        /**
         * tabBar 的哪一项，从左边算起，索引从0开始
         */
        index: number;
        /**
         * tab 上按钮文字
         */
        text?: string;
        /**
         * 图片路径
         */
        iconPath?: string;
        /**
         * 选中时的图片路径
         */
        selectedIconPath?: string;
        /**
         * 页面绝对路径
         */
        pagePath?: string;
        /**
         * 字体图标，优先级高于 iconPath
         */
        iconfont?: SetTabBarItemIconFontOptions;
        /**
         * tab 是否显示
         */
        visible?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetTabBarItemIconFontOptions {
        /**
         * 字库 Unicode 码
         */
        text: string;
        /**
         * 选中后字库 Unicode 码
         */
        selectedText: string;
        /**
         * 字体图标字号(px)
         */
        fontSize?: string;
        /**
         * 字体图标颜色
         */
        color?: string;
        /**
         * 字体图标选中颜色
         */
        selectedColor?: string;
    }

    interface ShowTabBarOptions {
        /**
         * 是否需要动画效果
         */
        animation?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface HideTabBarOptions {
        /**
         * 是否需要动画效果
         */
        animation?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetTopBarTextOptions {
        /**
         * 置顶栏文字内容
         */
        text: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface NavigateToOptions {
        /**
         * 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数
         */
        url: string | string.PageURIString;
        /**
         * 窗口显示的动画类型
         * - auto: 自动选择动画效果
         * - none: 无动画效果
         * - slide-in-right: 从右侧横向滑动效果
         * - slide-in-left: 左侧横向滑动效果
         * - slide-in-top: 从上侧竖向滑动效果
         * - slide-in-bottom: 从下侧竖向滑动效果
         * - fade-in: 从透明到不透明逐渐显示效果
         * - zoom-out: 从小到大逐渐放大显示效果
         * - zoom-fade-out: 从小到大逐渐放大并且从透明到不透明逐渐显示效果
         * - pop-in: 从右侧平移入栈动画效果
         */
        animationType?: 'auto' | 'none' | 'slide-in-right' | 'slide-in-left' | 'slide-in-top' | 'slide-in-bottom' | 'fade-in' | 'zoom-out' | 'zoom-fade-out' | 'pop-in';
        /**
         * 窗口显示动画的持续时间，单位为 ms
         */
        animationDuration?: number;
        /**
         * 页面间通信接口，用于监听被打开页面发送到当前页面的数据
         */
        events?: any;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: NavigateToSuccessOptions) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface NavigateToSuccessOptions {
        /**
         * 回调信息
         */
        errMsg: string;
        /**
         * 和被打开页面进行通信
         */
        eventChannel: EventChannel;
    }

    /**
     *
     * 文档: [http://uniapp.dcloud.io/api/router.html#event-channel](http://uniapp.dcloud.io/api/router.html#event-channel)
     */
    interface EventChannel {
        /**
         * 触发一个事件
         */
        emit(eventName: string, ...args: any[]): void;
        /**
         * 持续监听一个事件
         */
        on(eventName: string, fn?: (result: any) => void): void;
        /**
         * 取消监听一个事件。给出第二个参数时，只取消给出的监听函数，否则取消所有监听函数
         */
        off(eventName: string, fn?: (result: any) => void): void;
        /**
         * 监听一个事件一次，触发后失效
         */
        once(eventName: string, fn?: (result: any) => void): void;
    }

    interface RedirectToOptions {
        /**
         * 需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数
         */
        url: string | string.PageURIString;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ReLaunchOptions {
        /**
         * 需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'，如果跳转的页面路径是 tabBar 页面则不能带参数
         */
        url: string | string.PageURIString;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SwitchTabOptions {
        /**
         * 需要跳转的 tabBar 页面的路径，路径后不能带参数
         */
        url: string | string.PageURIString;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface PreloadPageOptions {
        /**
         * 预加载页面的路径
         */
        url: string | string.PageURIString;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface UnPreloadPageOptions {
        /**
         * 需要跳转的 tabBar 页面的路径，路径后不能带参数
         */
        url: string | string.PageURIString;
    }

    interface CreateIntersectionObserverOptions {
        /**
         * 所有阈值
         */
        thresholds?: any [];
        /**
         * 初始的相交比例
         */
        initialRatio?: number;
        /**
         * 是否同时观测多个参照节点（而非一个）
         */
        observeAll?: boolean;
    }

    interface NavigateBackOptions {
        /**
         * 返回的页面数，如果 delta 大于现有页面数，则返回到首页
         */
        delta?: number;
        /**
         * 窗口关闭的动画类型
         * - auto: 自动选择动画效果
         * - none: 无动画效果
         * - slide-out-right: 横向向右侧滑出屏幕动画
         * - slide-out-left: 横向向左侧滑出屏幕动画
         * - slide-out-top: 竖向向上侧滑出屏幕动画
         * - slide-out-bottom: 竖向向下侧滑出屏幕动画
         * - fade-out: 从不透明到透明逐渐隐藏动画
         * - zoom-in: 从大逐渐缩小关闭动画
         * - zoom-fade-in: 从大逐渐缩小并且从不透明到透明逐渐隐藏关闭动画
         * - pop-out: 从右侧平移出栈动画效果
         */
        animationType?: 'auto' | 'none' | 'slide-out-right' | 'slide-out-left' | 'slide-out-top' | 'slide-out-bottom' | 'fade-out' | 'zoom-in' | 'zoom-fade-in' | 'pop-out';
        /**
         * 窗口关闭动画的持续时间，单位为 ms
         */
        animationDuration?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetLaunchOptionsSyncOptions {
        /**
         * 启动的路径(代码包路径)
         */
        path: string;
        /**
         * 启动时的场景值，具体值含义请查看各平台文档说明。钉钉小程序在 IDE 恒为0000，真机不支持。
         */
        scene: number;
        /**
         * 启动时的 query 参数
         */
        query: any;
        /**
         * 启来源信息。如果没有则返回 `{}`
         */
        referrerInfo: ReferrerInfo;
        /**
         * 应用的渠道标识。仅 App 端支持
         * - qihoo:browser: 360浏览器流应用
         * - qihoo:appstore: 360手机助手流应用
         * - dcloud:streamapps: DCloud流应用基座
         */
        channel?: 'qihoo:browser' | 'qihoo:appstore' | 'dcloud:streamapps';
        /**
         * 应用启动来源。仅 App 端支持
         * - default: 默认启动方式，通常表示应用列表启动（360手助中搜索启动）
         * - scheme: 通过urlscheme方式触发启动
         * - push: 通过点击系统通知方式触发启动
         * - stream: 通过流应用api（plus.stream.open）启动
         * - shortcut: 通过快捷方式启动，iOS平台表示通过3D Touch快捷方式，Android平台表示通过桌面快捷方式启动
         * - barcode: 通过二维码扫描启动
         * - myapp: 通过流应用"我的"应用列表或历史列表中触发启动
         * - favorite: 通过流应用的"收藏"应用列表启动
         * - browser: 通过流应用的内置浏览器导流启动的流应用（地址栏输入url启动应用、点击wap页面链接启动应用）
         * - engines: 通过流应用的浏览器界面作为搜索引擎启动
         * - search: 通过流应用的应用搜索启动应用（如iOS平台的T9键盘搜索）
         * - speech: 通过流应用的语音识别启动应用
         * - uniLink: 通过通用链接（universal link）启动应用
         * - miniProgram: 通过微信小程序启动应用
         */
        launcher?: 'default' | 'scheme' | 'push' | 'stream' | 'shortcut' | 'barcode' | 'myapp' | 'favorite' | 'browser' | 'engines' | 'search' | 'speech' | 'uniLink' | 'miniProgram';
    }

    interface ReferrerInfo {
        /**
         * 来源小程序 appId
         */
        appId: string;
        /**
         * 来源小程序传过来的数据
         */
        extraData: any;
    }

    interface CreateAnimationOptions {
        /**
         * 动画持续时间，单位ms
         */
        duration?: number;
        /**
         * 定义动画的效果
         * - linear: 动画从头到尾的速度是相同的
         * - ease: 动画以低速开始，然后加快，在结束前变慢
         * - ease-in: 动画以低速开始
         * - ease-in-out: 动画以低速开始和结束
         * - ease-out: 动画以低速结束
         * - step-start: 动画第一帧就跳至结束状态直到结束
         * - step-end: 动画一直保持开始状态，最后一帧跳到结束状态
         */
        timingFunction?: 'linear' | 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'step-start' | 'step-end';
        /**
         * 动画延迟时间，单位 ms
         */
        delay?: number;
        /**
         * 设置transform-origin
         */
        transformOrigin?: string;
    }

    interface PageScrollToOptions {
        /**
         * 滚动到页面的目标位置
         */
        scrollTop?: number;
        /**
         * 选择器
         */
        selector?: string;
        /**
         * 滚动动画的时长
         */
        duration?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StartPullDownRefreshOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SelectorQuery {
        /**
         * 将选择器的选取范围更改为自定义组件component内
         */
        in(component: any): SelectorQuery;
        /**
         * 在当前页面下选择第一个匹配选择器selector的节点
         */
        select(selector: string): NodesRef;
        /**
         * 在当前页面下选择匹配选择器selector的所有节点
         */
        selectAll(selector: string): NodesRef;
        /**
         * 选择显示区域
         */
        selectViewport(): NodesRef;
        /**
         * 执行所有的请求
         */
        exec(callback?: (result: any) => void): NodesRef;
    }

    interface NodesRef {
        /**
         * 添加节点的布局位置的查询请求，相对于显示区域，以像素为单位
         */
        boundingClientRect(callback?: (result: NodeInfo | NodeInfo []) => void): SelectorQuery;
        /**
         * 添加节点的滚动位置查询请求，以像素为单位
         */
        scrollOffset(callback: (result: NodeInfo | NodeInfo []) => void): SelectorQuery;
        /**
         * 获取节点的相关信息，需要获取的字段在fields中指定
         */
        fields(fields: NodeField, callback: (result: NodeInfo | NodeInfo []) => void): SelectorQuery;
        /**
         * 添加节点的 Context 对象查询请求
         */
        context(callback: (result: NodeInfo | NodeInfo []) => void): SelectorQuery;
        /**
         * 获取 Node 节点实例。目前支持 Canvas 的获取。
         */
        node(callback: (result: any) => void): SelectorQuery;
    }

    interface NodeInfo {
        /**
         * 节点的ID
         */
        id?: string;
        /**
         * 节点的dataset
         */
        dataset?: any;
        /**
         * 节点的左边界坐标
         */
        left?: number;
        /**
         * 节点的右边界坐标
         */
        right?: number;
        /**
         * 节点的上边界坐标
         */
        top?: number;
        /**
         * 节点的下边界坐标
         */
        bottom?: number;
        /**
         * 节点的宽度
         */
        width?: number;
        /**
         * 节点的高度
         */
        height?: number;
        /**
         * 节点的水平滚动位置
         */
        scrollLeft?: number;
        /**
         * 节点的垂直滚动位置
         */
        scrollTop?: number;
        /**
         * 节点的内容高度
         */
        scrollHeight?: number;
        /**
         * 节点的内容宽度
         */
        scrollWidth?: number;
        /**
         * 节点对应的 Context 对象
         */
        context?: MapContext | CanvasContext | VideoContext | EditorContext;
    }

    interface NodeCallbackResult {
        /**
         * 节点对应的 Node 实例
         */
        node: any;
    }

    interface EditorContext {
        /**
         * 修改样式
         */
        format(name: string, value: string): void;
        /**
         * 插入分割线
         */
        insertDivider(): void;
        /**
         * 获取节点的相关信息，需要获取的字段在fields中指定
         */
        insertImage(options: EditorContextInsertImageOptions): void;
        /**
         * 添加节点的 Context 对象查询请求
         */
        insertText(options: EditorContextInsertTextOptions): void;
        /**
         * 初始化编辑器内容，hmlt和delta同时存在时仅delta生效
         */
        setContents(options: EditorContextSetContentsOptions): void;
        /**
         * 初始化编辑器内容，hmlt和delta同时存在时仅delta生效
         */
        getContents(options: EditorContextGetContentsOptions): void;
        /**
         * 初始化编辑器内容，hmlt和delta同时存在时仅delta生效
         */
        clear(options: EditorContextClearOptions): void;
        /**
         * 清除当前选区的样式
         */
        removeFormat(options: EditorContextRemoveFormatOptions): void;
        /**
         * 撤销
         */
        undo(options: EditorContextUndoOptions): void;
        /**
         * 撤销
         */
        redo(options: EditorContextRedoOptions): void;
        /**
         * 编辑器失焦，同时收起键盘。
         */
        blur(options: CommonOptions): void;
        /**
         * 使得编辑器光标处滚动到窗口可视区域内。
         */
        scrollIntoView(options: CommonOptions): void;
        /**
         * 获取编辑器已选区域内的纯文本内容。当编辑器失焦或未选中一段区间时，返回内容为空。
         */
        getSelectionText(options: EditorContextGetSelectionTextOptions): void;
    }

    interface EditorContextInsertImageOptions {
        /**
         * 图片地址
         */
        src: string;
        /**
         * 图像无法显示时的替代文本
         */
        alt?: string;
        /**
         * 图片宽度（pixels/百分比)
         */
        width?: string;
        /**
         * 图片高度 (pixels/百分比)
         */
        height?: string;
        /**
         * 添加到图片 img 标签上的类名
         */
        extClass?: string;
        /**
         * data 被序列化为 name=value;name1=value2 的格式挂在属性 data-custom 上
         */
        data?: any;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextInsertTextOptions {
        /**
         * 文本内容
         */
        text: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextSetContentsOptions {
        /**
         * 带标签的HTML内容
         */
        html?: string;
        /**
         * 表示内容的delta对象
         */
        delta?: any;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextGetContentsOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextClearOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextRemoveFormatOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextUndoOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextRedoOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface EditorContextGetSelectionTextOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetSelectionTextSuccessCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSelectionTextSuccessCallbackResult {
        /**
         * 纯文本内容
         */
        text: string;
    }

    interface CommonOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface NodeField {
        /**
         * 是否返回节点 id
         */
        id?: boolean;
        /**
         * 是否返回节点 dataset
         */
        dataset?: boolean;
        /**
         * 是否返回节点布局位置（left right top bottom）
         */
        rect?: boolean;
        /**
         * 是否返回节点尺寸（width height）
         */
        size?: boolean;
        /**
         * 是否返回节点的 scrollLeft scrollTop，节点必须是 scroll-view 或者 viewport
         */
        scrollOffset?: boolean;
        /**
         * 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，id class style 和事件绑定的属性值不可获取）
         */
        properties?: string [];
        /**
         * 指定样式名列表，返回节点对应样式名的当前值
         */
        computedStyle?: string [];
        /**
         * 是否返回节点对应的 Context 对象
         */
        context?: boolean;
        /**
         * 是否返回节点对应的 Node 实例
         */
        node?: boolean;
    }

    interface IntersectionObserver {
        /**
         * 使用选择器指定一个节点，作为参照区域之一
         */
        relativeTo(selector: string, margins?: any): IntersectionObserver;
        /**
         * 指定页面显示区域作为参照区域之一
         */
        relativeToViewport(margins?: any): IntersectionObserver;
        /**
         * 指定目标节点并开始监听相交状态变化情况
         */
        observe(targetSelector: string, callback: (result: ObserveResult) => void): void;
        /**
         * 停止监听
         */
        disconnect(): void;
    }

    /**
     * 和 UI 相关的 api 在组件 mountd 后执行
     */
    interface MediaQueryObserver {
        /**
         * 开始监听页面 media query 变化情况
         */
        observe(descriptor: DescriptorOptions, callback: (result: MediaQueryObserveResult) => void): void;
        /**
         * 停止监听，回调函数将不再触发
         */
        disconnect(): void;
    }

    interface DescriptorOptions {
        /**
         * 屏幕方向（ landscape 或 portrait ）
         * - landscape:
         * - portrait:
         */
        orientation?: 'landscape' | 'portrait';
        /**
         * 页面宽度（ px 为单位）
         */
        width?: number;
        /**
         * 页面高度（ px 为单位）
         */
        height?: number;
        /**
         * 页面最小宽度（ px 为单位）
         */
        'min-width'?: number;
        /**
         * 页面最小高度（ px 为单位）
         */
        'min-height'?: number;
        /**
         * 页面最大宽度（ px 为单位）
         */
        'max-width'?: number;
        /**
         * 页面最大高度（ px 为单位）
         */
        'max-height'?: number;
    }

    interface MediaQueryObserveResult {
        /**
         * 页面的当前状态是否满足所指定的 media query
         */
        matches: boolean;
    }

    interface ObserveResult {
        /**
         * 相交比例
         */
        intersectionRatio: number;
        /**
         * 相交区域的边界
         */
        intersectionRect: any;
        /**
         * 目标节点布局区域的边界
         */
        boundingClientRect: ObserveNodeRect;
        /**
         * 参照区域的边界
         */
        relativeRect: ObserveNodeRect;
        /**
         * 相交检测时的时间戳
         */
        time: number;
    }

    interface ObserveNodeRect {
        /**
         * left
         */
        left: number;
        /**
         * right
         */
        right: number;
        /**
         * top
         */
        top: number;
        /**
         * bottom
         */
        bottom: number;
    }

    interface Animation {
        /**
         * 设置透明度
         */
        opacity(value: number): Animation;
        /**
         * 设置背景色
         */
        backgroundColor(color: number): Animation;
        /**
         * 设置宽度
         */
        width(length: number | string): Animation;
        /**
         * 设置高度
         */
        height(length: number | string): Animation;
        /**
         * 设置 top 值
         */
        top(length: number): Animation;
        /**
         * 设置 left 值
         */
        left(length: number): Animation;
        /**
         * 设置 bottom 值
         */
        bottom(length: number): Animation;
        /**
         * 设置 right 值
         */
        right(length: number): Animation;
        /**
         * 从原点顺时针旋转一个角度
         */
        rotate(deg: number): Animation;
        /**
         * 从X轴顺时针旋转一个角度
         */
        rotateX(deg: number): Animation;
        /**
         * 从Y轴顺时针旋转一个角度
         */
        rotateY(deg: number): Animation;
        /**
         * 从Z轴顺时针旋转一个角度
         */
        rotateZ(deg: number): Animation;
        /**
         * 从固定轴顺时针旋转一个角度
         */
        rotate3d(x: number, y: number, z: number, deg: number): Animation;
        /**
         * 缩放
         */
        scale(sx: number, sy: number): Animation;
        /**
         * 缩放X轴
         */
        scaleX(sx: number): Animation;
        /**
         * 缩放Y轴
         */
        scaleY(sy: number): Animation;
        /**
         * 缩放Z轴
         */
        scaleZ(sz: number): Animation;
        /**
         * 缩放
         */
        scale3d(sx: number, sy: number, sz: number): Animation;
        /**
         * 平移变换
         */
        translate(tx: number, ty: number): Animation;
        /**
         * 对X轴平移
         */
        translateX(tx: number): Animation;
        /**
         * 对Y轴平移
         */
        translateY(ty: number): Animation;
        /**
         * 对Z轴平移
         */
        translateZ(tz: number): Animation;
        /**
         * 对X、Y、Z坐标进行平移变换
         */
        translate3d(tx: number, ty: number, tz: number): Animation;
        /**
         * 对X、Y轴坐标进行倾斜
         */
        skew(ax: number, ay: number): Animation;
        /**
         * 对X轴坐标进行倾斜
         */
        skewX(ax: number): Animation;
        /**
         * 对Y轴坐标进行倾斜
         */
        skewY(ay: number): Animation;
        /**
         * 矩阵变形
         */
        matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Animation;
        /**
         * 矩阵变形
         */
        matrix3d(): Animation;
        /**
         * 表示一组动画完成
         */
        step(options?: CreateAnimationOptions): void;
        /**
         * 导出动画队列
         */
        export(): any;
    }

    interface CanvasContext {
        /**
         * 填充色
         */
        fillStyle: string.ColorString | string;
        /**
         * 边框颜色
         */
        strokeStyle: string.ColorString | string;
        /**
         * 阴影的模糊级别
         */
        shadowBlur: number;
        /**
         * 阴影的颜色
         */
        shadowColor: string.ColorString | string;
        /**
         * 阴影相对于形状在水平方向的偏移
         */
        shadowOffsetX: number;
        /**
         * 阴影相对于形状在竖直方向的偏移
         */
        shadowOffsetY: number;
        /**
         * 线条的宽度
         */
        lineWidth: number;
        /**
         * 线条的端点样式
         * - butt:
         * - round:
         * - square:
         */
        lineCap: 'butt' | 'round' | 'square';
        /**
         * 线条的结束交点样式
         * - bevel:
         * - round:
         * - miter:
         */
        lineJoin: 'bevel' | 'round' | 'miter';
        /**
         * 最大斜接长度
         */
        miterLimit: number;
        /**
         * 透明度
         */
        globalAlpha: number;
        /**
         * 设置要在绘制新形状时应用的合成操作的类型
         */
        globalCompositeOperation: string;
        /**
         * 偏移量
         */
        lineDashOffset: number;
        /**
         * 字体样式
         */
        font: string;
        /**
         * 设置填充色
         */
        setFillStyle(color: string.ColorString | CanvasGradient): void;
        /**
         * 设置边框颜色
         */
        setStrokeStyle(color: string.ColorString | string): void;
        /**
         * 设置阴影样式
         */
        setShadow(offsetX?: number, offsetY?: number, blur?: number, color?: string.ColorString | string): void;
        /**
         * 创建一个线性的渐变颜色
         */
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        /**
         * 创建一个圆形的渐变颜色
         */
        createCircularGradient(x: number, y: number, r: number): CanvasGradient;
        /**
         * 创建一个颜色的渐变点
         */
        addColorStop(stop: number, color: string.ColorString | string): void;
        /**
         * 设置线条的宽度
         */
        setLineWidth(lineWidth: number): void;
        /**
         * 设置线条的端点样式
         */
        setLineCap(lineCap: 'butt' | 'round' | 'square'): void;
        /**
         * 设置线条的交点样式
         */
        setLineJoin(lineJoin: 'bevel' | 'round' | 'miter'): void;
        /**
         * 设置线条的宽度
         */
        setLineDash(pattern: any [], offset: number): void;
        /**
         * 设置最大斜接长度
         */
        setMiterLimit(miterLimit: number): void;
        /**
         * 创建一个矩形
         */
        rect(x: number, y: number, width: number, height: number): void;
        /**
         * 填充一个矩形
         */
        fillRect(x: number, y: number, width: number, height: number): void;
        /**
         * 画一个矩形(非填充)
         */
        strokeRect(x: number, y: number, width: number, height: number): void;
        /**
         * 清除画布上在该矩形区域内的内容
         */
        clearRect(x: number, y: number, width: number, height: number): void;
        /**
         * 对当前路径中的内容进行填充
         */
        fill(): void;
        /**
         * 画出当前路径的边框
         */
        stroke(): void;
        /**
         * 开始创建一个路径
         */
        beginPath(): void;
        /**
         * 关闭一个路径
         */
        closePath(): void;
        /**
         * 把路径移动到画布中的指定点，不创建线条
         */
        moveTo(x: number, y: number): void;
        /**
         * 增加一个新点，然后创建一条从上次指定点到目标点的线
         */
        lineTo(x: number, y: number): void;
        /**
         * 画一条弧线
         */
        arc(x: number, y: number, r: number, sAngle: number, eAngle: number, counterclockwise?: boolean): void;
        /**
         * 创建三次方贝塞尔曲线路径
         */
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        /**
         * 创建二次贝塞尔曲线路径
         */
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        /**
         * 横纵坐标缩放
         */
        scale(scaleWidth: number, scaleHeight: number): void;
        /**
         * 顺时针旋转当前坐标轴
         */
        rotate(rotate: number): void;
        /**
         * 对当前坐标系的原点(0, 0)进行变换
         */
        translate(x: number, y: number): void;
        /**
         * 从原始画布中剪切任意形状和尺寸
         */
        clip(): void;
        /**
         * 设置字体的字号
         */
        setFontSize(fontSize: number): void;
        /**
         * 在画布上绘制被填充的文本
         */
        fillText(text: string, x: number, y: number, maxWidth?: number): void;
        /**
         * 设置文字的对齐
         */
        setTextAlign(align: 'left' | 'center' | 'right'): void;
        /**
         * 设置文字的水平对齐
         */
        setTextBaseline(textBaseline: 'top' | 'bottom' | 'middle' | 'normal'): void;
        /**
         * 绘制图像到画布
         */
        drawImage(imageResource: string, dx?: number, dy?: number, dWidth?: number, dHeigt?: number, sx?: number, sy?: number, sWidth?: number, sHeight?: number): void;
        /**
         * 设置全局画笔透明度
         */
        setGlobalAlpha(alpha: number): void;
        /**
         * 保存当前的绘图上下文
         */
        save(): void;
        /**
         * 恢复之前保存的绘图上下文
         */
        restore(): void;
        /**
         * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
         */
        draw(reserve?: boolean, callback?: (result: any) => void): void;
        /**
         * 测量文本尺寸信息，目前仅返回文本宽度
         */
        measureText(text: string): CanvasTextMetrics;
        /**
         * 根据控制点和半径绘制圆弧路径
         */
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        /**
         * 给定的 (x, y) 位置绘制文本描边的方法
         */
        strokeText(text: string, x: number, y: number, maxWidth?: number): void;
        /**
         * 对指定的图像创建模式的方法，可在指定的方向上重复元图像
         */
        createPattern(image: string, repetition: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'): void;
        /**
         * 使用矩阵重新设置（覆盖）当前变换的方法
         */
        setTransform(scaleX: number, skewX: number, skewY: number, scaleY: number, translateX: number, translateY: number): void;
    }

    interface CanvasGradient {
        /**
         * 添加颜色的渐变点
         */
        addColorStop(stop: number, color: string.ColorString | string): void;
    }

    interface CanvasTextMetrics {
        /**
         * 文本的宽度
         */
        width: number;
    }

    interface CanvasToTempFilePathOptions {
        /**
         * 画布x轴起点（默认0）
         */
        x?: number;
        /**
         * 画布y轴起点（默认0）
         */
        y?: number;
        /**
         * 画布宽度（默认为canvas宽度-x）
         */
        width?: number;
        /**
         * 画布高度（默认为canvas高度-y）
         */
        height?: number;
        /**
         * 输出图片宽度（默认为 width * 屏幕像素密度）
         */
        destWidth?: number;
        /**
         * 输出图片高度（默认为 height * 屏幕像素密度）
         */
        destHeight?: number;
        /**
         * 画布标识，传入 <canvas/> 的 canvas-id
         */
        canvasId: string;
        /**
         * 目标文件的类型，默认为 'png'
         */
        fileType?: string;
        /**
         * 图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理
         */
        quality?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CanvasToTempFilePathRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CanvasToTempFilePathRes {
        /**
         * 导出生成的图片路径
         */
        tempFilePath: string;
    }

    interface CanvasGetImageDataOptions {
        /**
         * 画布标识，传入 <canvas/> 的 canvas-id
         */
        canvasId: string;
        /**
         * 将要被提取的图像数据矩形区域的左上角 x 坐标
         */
        x?: number;
        /**
         * 将要被提取的图像数据矩形区域的左上角 y 坐标
         */
        y?: number;
        /**
         * 将要被提取的图像数据矩形区域的宽度
         */
        width?: number;
        /**
         * 将要被提取的图像数据矩形区域的高度
         */
        height?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CanvasGetImageDataRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CanvasGetImageDataRes {
        /**
         * 回调信息
         */
        errMsg: string;
        /**
         * 图像数据矩形的宽度
         */
        width: number;
        /**
         * 图像数据矩形的高度
         */
        height: number;
        /**
         * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
         */
        data: any [];
    }

    interface CanvasPutImageDataOptions {
        /**
         * 画布标识，传入 <canvas/> 的 canvas-id
         */
        canvasId: string;
        /**
         * 图像像素点数据，一维数组，每四项表示一个像素点的rgba
         */
        data?: any;
        /**
         * 源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）
         */
        x?: number;
        /**
         * 源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）
         */
        y?: number;
        /**
         * 源图像数据矩形区域的宽度
         */
        width?: number;
        /**
         * 源图像数据矩形区域的高度
         */
        height?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetScreenBrightnessOptions {
        /**
         * 屏幕亮度值，范围 0~1，0 最暗，1 最亮
         */
        value: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetScreenBrightnessOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetScreenBrightnessSuccessRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetScreenBrightnessSuccessRes {
        /**
         * 屏幕亮度值，范围 0~1，0 最暗，1 最亮。
         */
        value: number;
    }

    interface SetKeepScreenOnOptions {
        /**
         * 是否保持屏幕常亮
         */
        keepScreenOn: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface VibrateOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface VibrateLongOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface VibrateShortOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface AddPhoneContactOptions {
        /**
         * 头像本地文件路径
         */
        photoFilePath?: string;
        /**
         * 昵称
         */
        nickName?: string;
        /**
         * 姓氏
         */
        lastName?: string;
        /**
         * 中间名
         */
        middleName?: string;
        /**
         * 名字
         */
        firstName?: string;
        /**
         * 备注
         */
        remark?: string;
        /**
         * 手机号
         */
        mobilePhoneNumber?: string;
        /**
         * 微信号
         */
        weChatNumber?: string;
        /**
         * 联系地址国家
         */
        addressCountry?: string;
        /**
         * 联系地址省份
         */
        addressState?: string;
        /**
         * 联系地址城市
         */
        addressCity?: string;
        /**
         * 联系地址街道
         */
        addressStreet?: string;
        /**
         * 联系地址邮政编码
         */
        addressPostalCode?: string;
        /**
         * 公司
         */
        organization?: string;
        /**
         * 职位
         */
        title?: string;
        /**
         * 工作传真
         */
        workFaxNumber?: string;
        /**
         * 工作电话
         */
        workPhoneNumber?: string;
        /**
         * 公司电话
         */
        hostNumber?: string;
        /**
         * 电子邮件
         */
        email?: string;
        /**
         * 网站
         */
        url?: string;
        /**
         * 工作地址国家
         */
        workAddressCountry?: string;
        /**
         * 工作地址省份
         */
        workAddressState?: string;
        /**
         * 工作地址城市
         */
        workAddressCity?: string;
        /**
         * 工作地址街道
         */
        workAddressStreet?: string;
        /**
         * 工作地址邮政编码
         */
        workAddressPostalCode?: string;
        /**
         * 住宅传真
         */
        homeFaxNumber?: string;
        /**
         * 住宅电话
         */
        homePhoneNumber?: string;
        /**
         * 住宅地址国家
         */
        homeAddressCountry?: string;
        /**
         * 住宅地址省份
         */
        homeAddressState?: string;
        /**
         * 住宅地址城市
         */
        homeAddressCity?: string;
        /**
         * 住宅地址街道
         */
        homeAddressStreet?: string;
        /**
         * 住宅地址邮政编码
         */
        homeAddressPostalCode?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetExtConfigSuccessCallbackResult {
        /** 第三方平台自定义的数据 */
        extConfig: AnyObject;
        errMsg: string;
    }

    interface GetExtConfigOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetExtConfigSuccessCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetMenuButtonBoundingClientRectRes {
        /**
         * 小程序胶囊菜单按钮的宽度
         */
        width: number;
        /**
         * 小程序胶囊菜单按钮的高度
         */
        height: number;
        /**
         * 小程序胶囊菜单按钮的上边界坐标
         */
        top: number;
        /**
         * 小程序胶囊菜单按钮的右边界坐标
         */
        right: number;
        /**
         * 小程序胶囊菜单按钮的下边界坐标
         */
        bottom: number;
        /**
         * 小程序胶囊菜单按钮的左边界坐标
         */
        left: number;
    }

    interface GetProviderOptions {
        /**
         * 服务类型，可取值“oauth”、“share”、“payment”、“push”
         * - oauth: 授权登录
         * - share: 分享
         * - payment: 支付
         * - push: 推送
         */
        service: 'oauth' | 'share' | 'payment' | 'push';
        /**
         * 接口调用成功的回调
         */
        success?: (result: GetProviderRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetProviderRes {
        /**
         * 服务类型
         * - oauth: 授权登录
         * - share: 分享
         * - payment: 支付
         * - push: 推送
         */
        service: 'oauth' | 'share' | 'payment' | 'push';
        /**
         * 得到的服务供应商
         */
        provider: PlusShareShareService['id'][] | PlusPushClientInfo['id'][] | PlusOauthAuthService['id'][] | PlusPaymentPaymentChannel['id'][];
        /**
         * 得到的服务供应商服务对象
         */
        providers: any [];
        /**
         * 描述信息
         */
        errMsg: string;
    }

    interface LoginOptions {
        /**
         * 授权登录服务提供商，通过uni.getProvider获取，如果不设置则弹出分享列表选择界面
         * - weixin: 微信登录
         * - qq: QQ登录
         * - sinaweibo: 新浪微博登录
         * - xiaomi: 小米登录
         * - apple: Apple登录
         * - univerify: 一键登录
         * - huawei: 华为登录
         */
        provider?: 'weixin' | 'qq' | 'sinaweibo' | 'xiaomi' | 'apple' | 'univerify' | 'huawei';
        /**
         * 授权类型，默认 auth_base。
         */
        scopes?: LoginScopes | LoginScopes [];
        /**
         * 超时时间，单位 ms
         */
        timeout?: number;
        /**
         * 一键登录页面样式
         */
        univerifyStyle?: UniverifyStyle;
        /**
         * 微信登录仅请求授权认证
         */
        onlyAuthorize?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: LoginRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface UniverifyStyle {
        /**
         * 是否全屏模式。
         *
         * true表示全屏模式，false表示非全屏模式，默认值为false。
         */
        fullScreen?: boolean;
        /**
         * 授权界面背景颜色。
         *
         * 格式为"#RRGGBB"，默认值为"#FFFFF"。
         */
        backgroundColor?: string;
        /**
         * 背景图片
         */
        backgroundImage?: string;
        /**
         * 授权界面图标样式。
         *
         * 可设置自定义图标，默认为应用图标。
         */
        icon?: UniverifyIconStyles;
        /**
         * 授权界面电话号码样式
         *
         * 可设置自定义电话号码文字颜色、大小等。
         */
        phoneNum?: UniverifyPhoneNumStyles;
        /**
         * 授权界面服务说明样式
         *
         * 可设置自定义服务说明文字颜色、大小等。
         */
        slogan?: UniverifySloganStyles;
        /**
         * 授权界面其他登录按钮样式
         *
         * 可设置自定义其他登录按钮背景颜色、文本内容、大小等。
         */
        authButton?: UniverifyAuthButtonStyles;
        /**
         * 支付宝小程序登录成功的授权 scope
         */
        otherLoginButton?: UniverifyOtherButtonStyles;
        /**
         * 授权界面服务协议样式
         *
         * 自定义设置服务器协议文字颜色、文本内容，添加自定义服务协议链接等。
         */
        privacyTerms?: UniverifyPrivacyTermsStyles;
        /**
         * 自定义登录按钮列表样式
         *
         * 自定义设置更多登录按钮列表，如其它三方登录等。
         *                     注意：HBuilderX3.1.14+版本支持。
         */
        buttons?: UniVerifyButtonsStyles;
    }

    interface UniverifyIconStyles {
        /**
         * 图标地址
         *
         * 仅支持本地路径，默认为应用图标。
         */
        path: string;
        /**
         * 图标宽度
         *
         * 格式为“XXpx"，默认值为"60px"。
         */
        width?: string;
        /**
         * 图标高度
         *
         * 格式为“XXpx"，默认值为"60px"。
         */
        height?: string;
    }

    interface UniVerifyButtonsStyles {
        /**
         * 自定义登录按钮图标宽度
         *
         * 单位为px，默认值为45px。
         *                     按指定宽度缩放，高度等比例缩放。
         */
        iconWidth?: string;
        /**
         * 自定义登录按钮列表
         */
        list: UniVerifyButtonListItem [];
    }

    interface UniVerifyButtonListItem {
        /**
         * 该按钮标识，会原样返回。
         */
        provider: string;
        /**
         * 图片路径
         *
         * 仅支持本地图片
         */
        iconPath: string;
    }

    interface UniverifyPhoneNumStyles {
        /**
         * 字体颜色
         *
         * 格式为"#RRGGBB"，默认值为"#000000"。
         */
        color?: string;
        /**
         * 字体大小
         *
         * 格式为“XXpx"，默认值为"18px"。注意：字体加粗显示。
         */
        fontSize?: string;
    }

    interface UniverifySloganStyles {
        /**
         * 字体颜色
         *
         * 格式为"#RRGGBB"，默认值为"#8a8b90"。
         */
        color?: string;
        /**
         * 字体大小
         *
         * 格式为“XXpx"，默认值为"12px"。
         */
        fontSize?: string;
    }

    interface UniverifyAuthButtonStyles {
        /**
         * 正常状态按钮颜色
         *
         * 格式为"#RRGGBB"，默认值为"#3479f5"。
         */
        normalColor?: string;
        /**
         * 按下状态按钮颜色
         *
         * 格式为"#RRGGBB"，默认值为"#2861c5"。
         */
        highlightColor?: string;
        /**
         * 不可点击状态按钮颜色
         *
         * 格式为"#RRGGBB"，默认值为"#73aaf5"。 注意：仅iOS平台支持。
         */
        disabledColor?: string;
        /**
         * 按钮宽度
         *
         * 格式为“XXpx"，默认值为自适应，距离屏幕左右"32px"。
         */
        width?: string;
        /**
         * 按钮高度
         *
         * 格式为“XXpx"，默认值为"94px"。
         */
        height?: string;
        /**
         * 按钮上文字颜色
         *
         * 格式为"#RRGGBB"，默认值为"#ffffff"。
         */
        textColor?: string;
        /**
         * 按钮上文字内容
         *
         * 默认值为"本机号码一键登录"。
         */
        title?: string;
        /**
         * 授权按钮圆角
         *
         * 格式为“XXpx"，默认值："24px" （按钮高度的一半）
         */
        borderRadius?: string;
    }

    interface UniverifyOtherButtonStyles {
        /**
         * 是否显示其它按钮
         *
         * 可取值： true - 显示其它按钮；false - 不显示其它按钮。 默认值为true。
         */
        visible?: boolean;
        /**
         * 正常状态按钮颜色
         *
         * 格式为"#RRGGBB"，默认值为"#f8f8f8"。
         */
        normalColor?: string;
        /**
         * 按下状态按钮颜色
         *
         * 格式为"#RRGGBB"，默认值为"#dedede"。
         */
        highlightColor?: string;
        /**
         * 按钮宽度
         *
         * 格式为“XXpx"，默认值为自适应，距离屏幕左右"32px"。
         */
        width?: string;
        /**
         * 按钮高度
         *
         * 格式为“XXpx"，默认值为"94px"。
         */
        height?: string;
        /**
         * 按钮上文字颜色
         *
         * 格式为"#RRGGBB"，默认值为"#000000"。
         */
        textColor?: string;
        /**
         * 按钮上文字内容
         *
         * 默认值为"本机号码一键登录"。
         */
        title?: string;
        /**
         * 按钮边框宽度
         *
         * 格式为“XXpx"，默认值为"1px"。 注意：仅iOS平台支持。
         */
        borderWidth?: string;
        /**
         * 按钮边框颜色
         *
         * 格式为"#RRGGBB"，默认值为"#c5c5c5"。 注意：仅iOS平台支持。
         */
        borderColor?: string;
        /**
         * 其他登录按钮圆角
         *
         * 格式为“XXpx"，默认值："24px" （按钮高度的一半）
         */
        borderRadius?: string;
    }

    interface UniverifyPrivacyTermsStyles {
        /**
         * 默认是否勾选同意协议选择框
         *
         * ture表示勾选，false表示不勾选。默认值为true。
         *                     HBuilderX3.1.0+版本新增支持。
         */
        defaultCheckBoxState?: boolean;
        /**
         * 普通文字颜色
         *
         * 格式为"#RRGGBB"，默认值为"#8a8b90"。
         */
        textColor?: string;
        /**
         * 协议链接文字颜色
         *
         * 格式为"#RRGGBB"，默认值为"#1d4788"。
         */
        termsColor?: string;
        /**
         * 服务协议前文本内容
         *
         * 默认值为"我已阅读并同意"。
         */
        prefix?: string;
        /**
         * 服务协议后文本内容
         *
         * 默认值为"并使用本机号码登录"。
         */
        suffix?: string;
        /**
         * 字体大小
         *
         * 格式为“XXpx"，默认值为"12px"。
         */
        fontSize?: string;
        /**
         * 服务协议
         *
         * 自定义服务协议，可设置使用手机号码登录的协议，最多可设置两个协议。 注意：运营商的服务协议链接会自动添加到自定义服务协议之前。
         */
        privacyItems?: UniverifyPrivacyItemStyles [];
    }

    interface UniverifyPrivacyItemStyles {
        /**
         * 链接地址
         *
         * http/https开头的协议链接地址。
         */
        url: string;
        /**
         * 协议链接文字
         */
        title: string;
    }

    /**
     * - auth_base: 静默授权
     * - auth_user: 网站支付宝登录
     * - auth_zhima: 用户芝麻信息
     */
    type LoginScopes = 'auth_base' | 'auth_user' | 'auth_zhima';

    interface LoginRes {
        /**
         * 描述信息
         */
        errMsg: string;
        /**
         * 登录服务商提供的登录信息，服务商不同返回的结果不完全相同
         */
        authResult: string;
        /**
         * 小程序用户临时登录凭证
         */
        code: string;
        /**
         * 头条小程序当前设备标识
         */
        anonymousCode?: string;
        /**
         * 支付宝小程序授权码
         */
        authCode?: string;
        /**
         * 支付宝小程序登录失败的授权类型，key是授权失败的 scope，value 是对应的错误码
         */
        authErrorScope?: any;
        /**
         * 支付宝小程序登录成功的授权 scope
         */
        authSucessScope?: string [];
        /**
         * 苹果登录成功返回的信息
         */
        appleInfo?: AppleLoginAppleInfo;
    }

    interface AppleLoginAppleInfo {
        /**
         * 应用程序用来与服务器交互的令牌
         */
        authorizationCode?: string;
        /**
         * 返回身份的全名
         */
        fullName?: any;
        /**
         * 一个JSON Web令牌(JWT)，可以安全地将用户信息传递给应用程序
         */
        identityToken?: string;
        /**
         * 指示用户是否为真人
         */
        realUserStatus?: number;
        /**
         * 验证用户的标识符
         */
        user?: string;
    }

    interface CheckSessionOptions {
        /**
         * 接口调用成功的回调函数，session_key未过期
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数，session_key已过期
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface AuthorizeOptions {
        /**
         * 需要获取权限的scope
         */
        scope: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetUserInfoOptions {
        /**
         * 授权登录服务提供商，通过uni.getProvider获取
         * - weixin: 微信登录
         * - qq: QQ登录
         * - sinaweibo: 新浪微博登录
         * - xiaomi: 小米登录
         * - apple: Apple登录
         */
        provider?: 'weixin' | 'qq' | 'sinaweibo' | 'xiaomi' | 'apple';
        /**
         * 是否带上登录态信息，仅微信小程序生效。
         */
        withCredentials?: boolean;
        /**
         * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en，仅微信小程序生效。
         */
        lang?: string;
        /**
         * 超时时间，单位 ms
         */
        timeout?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetUserInfoRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetUserProfileOptions {
        /**
         * 授权登录服务提供商，通过uni.getProvider获取
         * - weixin: 微信登录
         * - qq: QQ登录
         * - sinaweibo: 新浪微博登录
         * - xiaomi: 小米登录
         * - apple: Apple登录
         */
        provider?: 'weixin' | 'qq' | 'sinaweibo' | 'xiaomi' | 'apple';
        /**
         * 声明获取用户个人信息后的用途，不超过30个字符。仅微信小程序生效，且为必填。
         */
        desc?: string;
        /**
         * 是否带上登录态信息，仅微信小程序生效。
         */
        withCredentials?: boolean;
        /**
         * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en，仅微信小程序生效。
         * - en: 英文
         * - zh_CN: 简体中文
         * - zh_TW: 繁体中文
         */
        lang?: 'en' | 'zh_CN' | 'zh_TW';
        /**
         * 超时时间，单位 ms
         */
        timeout?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetUserProfileRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetUserInfoRes {
        /**
         * 用户信息对象，不包含 openid 等敏感信息
         */
        userInfo: UserInfo;
        /**
         * 不包括敏感信息的原始数据字符串，用于计算签名。
         */
        rawData: string;
        /**
         * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，仅微信小程序生效。
         */
        signature: string;
        /**
         * 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法，仅微信小程序生效。
         */
        encryptedData: string;
        /**
         * 加密算法的初始向量，详细见加密数据解密算法，仅微信小程序生效。
         */
        iv: string;
        /**
         * 描述信息
         */
        errMsg: string;
    }

    interface GetUserProfileRes {
        /**
         * 用户信息对象，不包含 openid 等敏感信息
         */
        userInfo: UserInfo;
        /**
         * 不包括敏感信息的原始数据字符串，用于计算签名。
         */
        rawData: string;
        /**
         * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，仅微信小程序生效。
         */
        signature: string;
        /**
         * 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法，仅微信小程序生效。
         */
        encryptedData: string;
        /**
         * 加密算法的初始向量，详细见加密数据解密算法，仅微信小程序生效。
         */
        iv: string;
        /**
         * 描述信息
         */
        errMsg: string;
    }

    interface UserInfo {
        /**
         * 用户昵称
         */
        nickName: string;
        /**
         * 该服务商唯一用户标识
         */
        openId: string;
        /**
         * 用户头像
         */
        avatarUrl: string;
    }

    interface PreLoginOptions {
        /**
         * 授权登录服务提供商，通过uni.getProvider获取
         * - univerify: 一键登录
         */
        provider?: 'univerify';
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetCheckBoxStateOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetCheckBoxStateRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetCheckBoxStateRes {
        /**
         * 错误信息
         */
        errMsg: string;
        /**
         * 一键登录条款勾选框状态
         */
        state: boolean;
    }

    interface UniverifyManager {
        /**
         * 一键登录
         */
        login(options: UniverifyLoginOptions): void;
        /**
         * 预登录
         */
        preLogin(options: CallBackOptions): void;
        /**
         * 关闭一键登陆页面
         */
        close(): void;
        /**
         * 获取一键登录条款勾选框状态
         */
        getCheckBoxState(options: GetCheckBoxStateOptions): void;
        /**
         * 订阅一键登录自定义按钮点击事件
         */
        onButtonsClick(callback: (result: any) => void): void;
        /**
         * 取消订阅一键登录自定义按钮点击事件
         */
        offButtonsClick(callback: (result: any) => void): void;
    }

    interface UniverifyLoginOptions {
        /**
         * 一键登录页面样式
         */
        univerifyStyle?: UniverifyStyle;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: LoginRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CallBackOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GeneralCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: GeneralCallbackResult) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: GeneralCallbackResult) => void;
    }

    interface ShareOptions {
        /**
         * 分享服务提供商，通过uni.getProvider获取，如果不设置则弹出分享列表选择界面
         * - sinaweibo: 新浪微博分享
         * - qq: 分享到QQ好友
         * - weixin: 分享微信消息、朋友圈及微信小程序
         */
        provider?: 'sinaweibo' | 'qq' | 'weixin';
        /**
         * 分享类型。默认图文0，纯文字1，纯图片2，音乐3，视频4，小程序5。
         * - 0: 图文
         * - 1: 纯文字
         * - 2: 纯图片
         * - 3: 音乐
         * - 4: 视频
         * - 5: 小程序
         */
        type?: 0 | 1 | 2 | 3 | 4 | 5;
        /**
         * 标题
         */
        title?: string;
        /**
         * 场景。可取值“WXSceneSession”分享到聊天界面，“WXSceneTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏
         * - WXSceneSession: 分享到聊天界面
         * - WXSceneTimeline: 分享到朋友圈
         * - WXSceneFavorite: 分享到微信收藏
         */
        scene?: 'WXSceneSession' | 'WXSceneTimeline' | 'WXSceneFavorite';
        /**
         * 摘要
         */
        summary?: string;
        /**
         * 跳转链接
         */
        href?: string;
        /**
         * 图片地址
         */
        imageUrl?: string;
        /**
         * 音视频地址
         */
        mediaUrl?: string;
        /**
         * 分享小程序
         */
        miniProgram?: MiniProgramShareOptions;
        /**
         * 是否启用拉起客服功能（目前仅支持微信）
         */
        openCustomerServiceChat?: boolean;
        /**
         * 客服ID（目前仅支持微信）
         */
        corpid?: string;
        /**
         * 客服的页面路径（目前仅支持微信）
         */
        customerUrl?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface MiniProgramShareOptions {
        /**
         * 微信小程序原始id
         */
        id?: string;
        /**
         * 点击链接进入的页面
         */
        path?: string;
        /**
         * 微信小程序版本类型，默认为0。
         * - 0: 正式版
         * - 1: 测试版
         * - 2: 体验版
         */
        type?: 0 | 1 | 2;
        /**
         * 兼容低版本的网页链接
         */
        webUrl?: string;
    }

    interface ShareWithSystemOptions {
        /**
         * 分享内容的类型
         * - text: 文字类型
         * - image: 图片类型
         */
        type?: 'text' | 'image';
        /**
         * 分享文字内容
         */
        summary?: string;
        /**
         * 分享链接
         */
        href?: string;
        /**
         * 分享图片地址,仅支持本地图片
         */
        imageUrl?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CreatePushMessageOptions {
        /**
         * 是否覆盖上一次提示的消息
         */
        cover?: boolean;
        /**
         * 提示消息延迟显示的时间,单位为s
         */
        delay?: number;
        /**
         * 推送消息的图标
         */
        icon?: string;
        /**
         * 推送消息的提示音
         * - system: 使用系统通知提示音（默认值）
         * - none: 不使用提示音
         */
        sound?: 'system' | 'none';
        /**
         * 推送消息的标题
         */
        title?: string;
        /**
         * 消息显示的内容，在系统通知中心中显示的文本内容
         */
        content: string;
        /**
         * 消息承载的数据，可根据业务逻辑自定义数据格式
         */
        payload?: unknown;
        /**
         * 消息上显示的提示时间
         */
        when?: Date;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetPushChannelOptions {
        /**
         * 添加的声音文件，注意raw目录下必须要有 ，不传此字段将使用默认铃音。
         * @defaultValue null
         */
        soundName?: string;
        /**
         * 通知渠道id
         */
        channelId: string;
        /**
         * 通知渠道描述
         */
        channelDesc: string;
        /**
         * 呼吸灯闪烁
         * @defaultValue false
         */
        enableLights?: boolean;
        /**
         * 震动
         * @defaultValue false
         */
        enableVibration?: boolean;
        /**
         * 通知的重要性级别，可选范围IMPORTANCE_LOW：2、IMPORTANCE_DEFAULT：3、IMPORTANCE_HIGH：4 。
         * @defaultValue 3
         */
        importance?: number;
        /**
         * 锁屏可见性，可选范围VISIBILITY_PRIVATE：0、VISIBILITY_PUBLIC：1、VISIBILITY_SECRET：-1、VISIBILITY_NO_OVERRIDE：-1000。
         * @defaultValue -1000
         */
        lockscreenVisibility?: number;
    }
    interface ChannelManager {
        /**
         * 设置推送渠道
         *
         * @uniPlatform {
         *    "app": {
         *        "android": {
         *            "osVer": "4.4",
         *  		  	 "uniVer": "√",
         * 			 "unixVer": "3.98"
         *        },
         *        "ios": {
         *            "osVer": "9.0",
         *  		  	 "uniVer": "x",
         * 			 "unixVer": "x"
         *        }
         *    }
         * }
         */
        setPushChannel(options: SetPushChannelOptions): void;
        /**
         * 获取当前应用注册的所有的通知渠道。
         *
         * @uniPlatform {
         *    "app": {
         *        "android": {
         *            "osVer": "4.4",
         *  		  	 "uniVer": "√",
         * 			 "unixVer": "3.98"
         *        },
         *        "ios": {
         *            "osVer": "9.0",
         *  		  	 "uniVer": "x",
         * 			 "unixVer": "x"
         *        }
         *    }
         * }
         */
        getAllChannels(): Array<string>;
    }

    interface GetPushClientIdSuccessData {
        /**
         * 个推客户端推送id，对应uni-id-device表的push_clientid
         */
        cid: string;
        /**
         * 错误描述
         */
        errMsg: string;
    }

    interface GetPushClientIdOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetPushClientIdSuccessData) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OnPushMessageCallbackOptions {
        /**
         * 事件类型
         * - click: 从系统推送服务点击消息启动应用事件
         * - receive: 应用从推送服务器接收到推送消息事件
         */
        type: 'click' | 'receive';
        /**
         * 消息内容
         */
        data: OnPushMessageSuccessOptionData;
    }

    interface OnPushMessageSuccessOptionData {
        /**
         * 消息标题
         */
        title: string;
        /**
         * 消息内容
         */
        content: string;
        /**
         * 消息承载的数据，可根据业务逻辑自定义数据格式
         */
        payload: unknown;
    }

    interface SubscribePushOptions {
        /**
         * 推送服务提供商，通过uni.getProvider获取
         * - unipush: UniPush
         * - igexin: 个推
         * - mipush: 小米推送
         */
        provider?: 'unipush' | 'igexin' | 'mipush';
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface UnscribePushOptions {
        /**
         * 推送服务提供商，通过uni.getProvider获取
         * - unipush: UniPush
         * - igexin: 个推
         * - mipush: 小米推送
         */
        provider?: 'unipush' | 'igexin' | 'mipush';
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OnPushOptions {
        /**
         * 推送服务提供商，通过uni.getProvider获取
         * - unipush: UniPush
         * - igexin: 个推
         * - mipush: 小米推送
         */
        provider?: 'unipush' | 'igexin' | 'mipush';
        /**
         * 接收到透传数据回调，回调参数（Object）：messageId（消息id）、data（消息内容）
         */
        callback?: (result: any) => void;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OffPushOptions {
        /**
         * 推送服务提供商，通过uni.getProvider获取
         * - unipush: UniPush
         * - igexin: 个推
         * - mipush: 小米推送
         */
        provider?: 'unipush' | 'igexin' | 'mipush';
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ShowShareMenuOptions {
        /**
         * 是否使用带 shareTicket 的转发
         */
        withShareTicket?: boolean;
        /**
         * 需要显示的转发按钮名称列表
         */
        menus?: ShowShareMenuOptionsMenu [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    /**
     * 转发按钮名称
     * - shareAppMessage: 发送给朋友
     * - shareTimeline: 分享到朋友圈
     */
    type ShowShareMenuOptionsMenu = 'shareAppMessage' | 'shareTimeline';

    interface HideShareMenuOptions {
        /**
         * 控制隐藏的哪些分享选项
         */
        hideShareItems: any [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface UpdateShareMenuOptions {
        /**
         * 是否使用带 shareTicket 的转发
         */
        withShareTicket?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetShareInfoOptions {
        /**
         * shareTicket
         */
        shareTicket: string;
        /**
         * 超时时间，单位 ms
         */
        timeout?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetShareInfoRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetShareInfoRes {
        /**
         * 错误信息
         */
        errMsg: string;
        /**
         * 包括敏感数据在内的完整转发信息的加密数据
         */
        encryptedData: string;
        /**
         * 加密算法的初始向量
         */
        iv: string;
    }

    interface ChooseAddressOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: ChooseAddressRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }
    
    interface ChooseMediaSuccessCallbackResult {
        /**
         * 本地临时文件列表
         */
        tempFiles: MediaFile[];
        /**
         * 文件类型，有效值有 image 、video、mix
         */
        type: string;
        errMsg: string;
    }

    /**
     * 接口调用成功的回调函数
     */
    type ChooseMediaSuccessCallback = (
                result: ChooseMediaSuccessCallbackResult
            ) => void;
    
    interface ChooseMediaOption {
        /**
         * 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头
         *
         * 可选值：
         * - 'back': 使用后置摄像头;
         * - 'front': 使用前置摄像头;
         */
        camera?: "back" | "front";
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: ChooseMediaCompleteCallback;
        /**
         * 最多可以选择的文件个数，基础库2.25.0前，最多可支持9个文件，2.25.0及以后最多可支持20个文件
         */
        count?: number;
        /**
         * 接口调用失败的回调函数
         */
        fail?: ChooseMediaFailCallback;
        /**
         * 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间。不限制相册。
         */
        maxDuration?: number;
        /**
         * 文件类型
         *
         * 可选值：
         * - 'image': 只能拍摄图片或从相册选择图片;
         * - 'video': 只能拍摄视频或从相册选择视频;
         * - 'mix': 可同时选择图片和视频;
         */
        mediaType?: ("video" | "image" | "mix")[];
        /**
         * 是否压缩所选文件，基础库2.25.0前仅对 mediaType 为 image 时有效，2.25.0及以后对全量 mediaType 有效
         */
        sizeType?: string[];
        /**
         * 图片和视频选择的来源
         *
         * 可选值：
         * - 'album': 从相册选择;
         * - 'camera': 使用相机拍摄;
         */
        sourceType?: ("album" | "camera")[];
        /**
         * 接口调用成功的回调函数
         */
        success?: ChooseMediaSuccessCallback;
    }

    interface ChooseAddressRes {
        /**
         * 调用结果
         */
        errMsg: string;
        /**
         * 收货人姓名
         */
        userName: string;
        /**
         * 邮编
         */
        postalCode: string;
        /**
         * 国标收货地址第一级地址
         */
        provinceName: string;
        /**
         * 国标收货地址第二级地址
         */
        cityName: string;
        /**
         * 国标收货地址第三级地址
         */
        countyName: string;
        /**
         * 详细收货地址信息
         */
        detailInfo: string;
        /**
         * 收货地址国家码
         */
        nationalCode: string;
        /**
         * 收货人手机号码
         */
        telNumber: string;
    }

    interface AddCardOptions {
        /**
         * 需要添加的卡券列表
         */
        cardList: AddCardData [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: AddCardRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface AddCardData {
        /**
         * 卡券 id
         */
        cardId: string;
        /**
         * 卡券的扩展参数
         */
        cardExt: string;
    }

    interface AddCardRes {
        /**
         * 卡券 id
         */
        cardList: CardData [];
    }

    interface CardData {
        /**
         * 加密 code，为用户领取到卡券的code加密后的字符串
         */
        code: string;
        /**
         * 用户领取到卡券的id
         */
        cardId: string;
        /**
         * 用户领取到卡券的扩展参数，与调用时传入的参数相同
         */
        cardExt: string;
        /**
         * 是否成功
         */
        isSuccess: boolean;
    }

    interface OpenCardOptions {
        /**
         * 需要打开的卡券列表
         */
        cardList: OpenCardData [];
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface OpenCardData {
        /**
         * 需要打开的卡券 Id
         */
        cardId: string;
        /**
         * 由 addCard 的返回对象中的加密 code 通过解密后得到
         */
        code: string;
    }

    interface OpenSettingOptions {
        /**
         * 是否同时获取用户订阅消息的订阅状态，默认不获取。注意：withSubscriptions 只返回用户勾选过订阅面板中的“总是保持以上选择，不再询问”的订阅消息。
         *
         * 最低基础库：2.10.3
         */
        withSubscriptions?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSettingOptions {
        /**
         * 是否同时获取用户订阅消息的订阅状态
         */
        withSubscriptions?: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetSettingSuccessResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSettingSuccessResult {
        /**
         * 用户授权结果
         */
        authSetting: AuthSetting;
        /**
         * 用户订阅消息设置
         */
        subscriptionsSetting: SubscriptionsSetting;
    }

    interface AuthSetting {
        /**
         * 是否授权用户信息
         */
        'scope.userInfo': boolean;
        /**
         * 是否授权地理位置
         */
        'scope.userLocation': boolean;
        /**
         * 是否授权通讯地址
         */
        'scope.address': boolean;
        /**
         * 是否授权发票抬头
         */
        'scope.invoiceTitle': boolean;
        /**
         * 是否授权获取发票
         */
        'scope.invoice': boolean;
        /**
         * 是否授权微信运动步数
         */
        'scope.werun': boolean;
        /**
         * 是否授权录音功能
         */
        'scope.record': boolean;
        /**
         * 是否授权保存到相册
         */
        'scope.writePhotosAlbum': boolean;
        /**
         * 是否授权摄像头
         */
        'scope.camera': boolean;
    }

    interface SubscriptionsSetting {
        /**
         * 订阅消息总开关
         */
        mainSwitch: boolean;
        /**
         * 每一项订阅消息的订阅状态
         */
        itemSettings: any;
    }

    interface GetWeRunDataOptions {
        /**
         * 超时时间，单位 ms
         */
        timeout?: number;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetWeRunDataRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetWeRunDataRes {
        /**
         * 调用结果
         */
        errMsg: string;
        /**
         * 包括敏感数据在内的完整用户信息的加密数据
         */
        encryptedData: string;
        /**
         * 加密算法的初始向量
         */
        iv: string;
    }

    interface ChooseInvoiceTitleOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: ChooseInvoiceTitleRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface ChooseInvoiceTitleRes {
        /**
         * 抬头类型（0：单位，1：个人）
         */
        type: string;
        /**
         * 抬头名称
         */
        title: string;
        /**
         * 抬头税号
         */
        taxNumber: string;
        /**
         * 单位地址
         */
        companyAddress: string;
        /**
         * 手机号码
         */
        telephone: string;
        /**
         * 银行名称
         */
        bankName: string;
        /**
         * 银行账号
         */
        bankAccount: string;
        /**
         * 接口调用结果
         */
        errMsg: string;
    }

    interface CheckIsSupportSoterAuthenticationOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CheckIsSupportSoterAuthenticationRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CheckIsSupportSoterAuthenticationRes {
        /**
         * 接口调用成功的回调函数
         */
        supportMode: SoterAuthModes [];
        /**
         * 接口调用结果
         */
        errMsg: string;
    }

    interface StartSoterAuthenticationOptions {
        /**
         * 请求使用的可接受的生物认证方式
         */
        requestAuthModes: SoterAuthModes [];
        /**
         * 挑战因子
         */
        challenge?: string;
        /**
         * 验证描述，即识别过程中显示在界面上的对话框提示内容
         */
        authContent?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: StartSoterAuthenticationRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    /**
     * 生物认证方式
     * - fingerPrint: 指纹识别
     * - facial: 人脸识别（暂未支持）
     * - speech: 声纹识别（暂未支持）
     */
    type SoterAuthModes = 'fingerPrint' | 'facial' | 'speech';

    interface StartSoterAuthenticationRes {
        /**
         * 错误码
         */
        errCode: number;
        /**
         * 生物认证方式
         * - fingerPrint: 指纹识别
         * - facial: 人脸识别（暂未支持）
         * - speech: 声纹识别（暂未支持）
         */
        authMode: 'fingerPrint' | 'facial' | 'speech';
        /**
         * 在设备安全区域（TEE）内获得的本机安全信息以及本次认证信息
         */
        resultJSON?: string;
        /**
         * 用SOTER安全密钥对 resultJSON 的签名(SHA256 with RSA/PSS, saltlen=20)
         */
        resultJSONSignature?: string;
        /**
         * 接口调用结果
         */
        errMsg: string;
    }

    interface CheckIsSoterEnrolledInDeviceOptions {
        /**
         * 生物认证方式
         * - fingerPrint: 指纹识别
         * - facial: 人脸识别（暂未支持）
         * - speech: 声纹识别（暂未支持）
         */
        checkAuthMode: 'fingerPrint' | 'facial' | 'speech';
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: CheckIsSoterEnrolledInDeviceRes) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface CheckIsSoterEnrolledInDeviceRes {
        /**
         * 是否已录入信息
         */
        isEnrolled: boolean;
        /**
         * 错误信息
         */
        errMsg: string;
    }

    interface UpdateManager {
        /**
         * 当向应用后台请求完新版本信息，会进行回调
         */
        onCheckForUpdate(callback: (result: OnCheckForUpdateResult) => void): void;
        /**
         * 当新版本下载完成，会进行回调
         */
        onUpdateReady(callback: (result: any) => void): void;
        /**
         * 当新版本下载失败，会进行回调
         */
        onUpdateFailed(callback: (result: any) => void): void;
        /**
         * 当新版本下载完成，调用该方法会强制当前uni-app应用上新版本并重启
         */
        applyUpdate(): void;
    }

    interface OnCheckForUpdateResult {
        /**
         * 是否有新版本
         */
        hasUpdate: boolean;
    }

    interface Worker {
        /**
         * 向 Worker 线程发送的消息。
         */
        postMessage(message: any): void;
        /**
         * 监听 Worker 线程向当前线程发送的消息
         */
        onMessage(callback: (result: any) => void): void;
        /**
         * 结束当前 Worker 线程，仅限在主线程 Worker 实例上调用。
         */
        terminate(): void;
    }

    interface SetEnableDebugOptions {
        /**
         * 是否打开调试
         */
        enableDebug: boolean;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetBackgroundColorOptions {
        /**
         * 窗口的背景色，必须为十六进制颜色值
         */
        backgroundColor?: string;
        /**
         * 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
         */
        backgroundColorTop?: string;
        /**
         * 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持
         */
        backgroundColorBottom?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface SetBackgroundTextStyleOptions {
        /**
         * 下拉背景字体、loading 图的样式，值为：dark、light
         */
        textStyle: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StatusBarStyle {
        /**
         * 页面根节点样式，页面根节点是所有页面节点的祖先节点，相当于 HTML 中的 body 节点
         */
        pageStyle?: string;
        /**
         * 页面的根字体大小，页面中的所有 rem 单位，将使用这个字体大小作为参考值，即 1rem 等于这个字体大小
         */
        rootFontSize?: string;
    }

    interface OnGyroscopeChangeSuccess {
        /**
         * x 轴方向角速度
         */
        x: number;
        /**
         * y 轴方向角速度
         */
        y: number;
        /**
         * z 轴方向角速度
         */
        z: number;
    }

    interface StartGyroscopeOptions {
        /**
         * 监听陀螺仪数据回调函数的执行频率：game（20ms/次）、ui（60ms/次）、normal （200ms/次）
         */
        interval?: string;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopGyroscopeOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface StopGyroscopeOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface LoadFontFaceOptions {
        /**
         * 是否全局生效
         */
        global?: boolean;
        /**
         * 定义的字体名称
         */
        family: string;
        /**
         * 字体资源的地址。建议格式为 TTF 和 WOFF，WOFF2 在低版本的iOS上会不兼容。
         */
        source: string;
        /**
         * 可选的字体描述符
         */
        desc?: LoadFontFaceOptionsDesc;
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: any) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface LoadFontFaceOptionsDesc {
        /**
         * 字体样式，可选值为 normal、italic、oblique
         */
        style: string;
        /**
         * 字体粗细，可选值为 normal、bold、100、200../ 900
         */
        weight: string;
        /**
         * 设置小型大写字母的字体显示文本，可选值为 normal、small-caps、inherit
         */
        variant: string;
    }

    interface GetSelectedTextRangeOptions {
        /**
         * 接口调用成功的回调函数
         */
        success?: (result: GetSelectedTextRangeSuccessCallbackResult) => void;
        /**
         * 接口调用失败的回调函数
         */
        fail?: (result: any) => void;
        /**
         * 接口调用结束的回调函数（调用成功、失败都会执行）
         */
        complete?: (result: any) => void;
    }

    interface GetSelectedTextRangeSuccessCallbackResult {
        /**
         * 输入框光标起始位置
         */
        start?: number;
        /**
         * 输入框光标结束位置
         */
        end?: number;
    }

    interface RewardedVideoAdOptions {
        /**
         * 广告位 id
         */
        adpid?: string;
        /**
         * 小程序平台广告位 id
         */
        adUnitId?: string;
    }

    interface RewardedVideoAdContext {
        /**
         * 加载激励视频广告
         */
        load(): Promise<any>;
        /**
         * 显示激励视频广告
         */
        show(): Promise<any>;
        /**
         * 获取广告商
         */
        getProvider(): string;
        /**
         * 销毁激励视频广告实例
         */
        destroy(): void;
        /**
         * 绑定 load 事件的监听器
         */
        onLoad(callback: (result: any) => void): void;
        /**
         * 绑定 close 事件的监听器
         */
        onClose(callback: (result: any) => void): void;
        /**
         * 绑定 error 事件的监听器
         */
        onError(callback: (result: any) => void): void;
        /**
         * 解除绑定 load 事件的监听器
         */
        offLoad(callback: (result: any) => void): void;
        /**
         * 解除绑定 close 事件的监听器
         */
        offClose(callback: (result: any) => void): void;
        /**
         * 解除绑定 error 事件的监听器
         */
        offError(callback: (result: any) => void): void;
    }

    interface FullScreenVideoAdOptions {
        /**
         * 广告位 id
         */
        adpid?: string;
    }

    interface FullScreenVideoAdContext {
        /**
         * 加载全屏视频广告
         */
        load(): Promise<any>;
        /**
         * 显示全屏视频广告
         */
        show(): Promise<any>;
        /**
         * 销毁全屏视频广告实例
         */
        destroy(): void;
        /**
         * 绑定 load 事件的监听器
         */
        onLoad(callback: (result: any) => void): void;
        /**
         * 绑定 close 事件的监听器
         */
        onClose(callback: (result: any) => void): void;
        /**
         * 绑定 error 事件的监听器
         */
        onError(callback: (result: any) => void): void;
        /**
         * 解除绑定 load 事件的监听器
         */
        offLoad(callback: (result: any) => void): void;
        /**
         * 解除绑定 close 事件的监听器
         */
        offClose(callback: (result: any) => void): void;
        /**
         * 解除绑定 error 事件的监听器
         */
        offError(callback: (result: any) => void): void;
    }

    interface InterstitialAdOptions {
        /**
         * 广告位 id
         */
        adpid?: string;
        /**
         * 小程序平台广告位 id
         */
        adUnitId?: string;
    }

    interface InterstitialAdContext {
        /**
         * 加载插屏广告
         */
        load(): Promise<any>;
        /**
         * 显示插屏广告
         */
        show(): Promise<any>;
        /**
         * 销毁插屏广告实例
         */
        destroy(): void;
        /**
         * 绑定 load 事件的监听器
         */
        onLoad(callback: (result: any) => void): void;
        /**
         * 绑定 close 事件的监听器
         */
        onClose(callback: (result: any) => void): void;
        /**
         * 绑定 error 事件的监听器
         */
        onError(callback: (result: any) => void): void;
        /**
         * 解除绑定 load 事件的监听器
         */
        offLoad(callback: (result: any) => void): void;
        /**
         * 解除绑定 close 事件的监听器
         */
        offClose(callback: (result: any) => void): void;
        /**
         * 解除绑定 error 事件的监听器
         */
        offError(callback: (result: any) => void): void;
    }

    interface InteractiveAdOptions {
        /**
         * 广告位 id
         */
        adpid: string;
        /**
         * 广告服务商标识
         */
        provider: string;
    }

    interface InteractiveAdContext {
        /**
         * 加载互动广告
         */
        load(): Promise<any>;
        /**
         * 显示互动广告
         */
        show(): Promise<any>;
        /**
         * 场景入口曝光打点
         */
        reportExposure(): void;
        /**
         * 销毁互动广告实例
         */
        destroy(): void;
        /**
         * 绑定 load 事件的监听器
         */
        onLoad(callback: (result: any) => void): void;
        /**
         * 绑定 close 事件的监听器
         */
        onClose(callback: (result: any) => void): void;
        /**
         * 绑定 error 事件的监听器
         */
        onError(callback: (result: any) => void): void;
        /**
         * 解除绑定 load 事件的监听器
         */
        offLoad(callback: (result: any) => void): void;
        /**
         * 解除绑定 close 事件的监听器
         */
        offClose(callback: (result: any) => void): void;
        /**
         * 解除绑定 error 事件的监听器
         */
        offError(callback: (result: any) => void): void;
    }

    interface InterceptorOptions {
        /**
         * 拦截前触发
         */
        invoke?: (result: any) => void;
        /**
         * 方法调用后触发，处理返回值
         */
        returnValue?: (result: any) => void;
        /**
         * 成功回调拦截
         */
        success?: (result: any) => void;
        /**
         * 失败回调拦截
         */
        fail?: (result: any) => void;
        /**
         * 完成回调拦截
         */
        complete?: (result: any) => void;
    }

    interface OnLocaleChangeCallbackResult {
        /**
         * 当前语言
         */
        locale?: string;
    }

    /**
     * 分享服务对象
     * ShareService对象用于表示分享服务，在JS中为对象，用于向系统请求分享操作。
     *
     * 文档: [http://uniapp.dcloud.io/share.html](http://uniapp.dcloud.io/share.html)
     */
    interface PlusShareShareService {
        /**
         * 分享服务标识
         * 用于表示分享服务标识：
         *                         "sinaweibo" - 表示新浪微博；
         *                         "weixin" - 表示微信；
         *                         "qq" - 表示腾讯QQ；
         *                         "tencentweibo" - 表示腾讯微博（已废弃）。
         * - sinaweibo: 新浪微博
         * - weixin: 微信
         * - qq: QQ
         *
         * 文档: [http://uniapp.dcloud.io/share.html](http://uniapp.dcloud.io/share.html)
         */
        id: 'sinaweibo' | 'weixin' | 'qq';
        /**
         * 分享服务描述
         * 用于描述分享服务的信息：
         *                         如“新浪微博”、“腾讯微博”、“微信”、“QQ”。
         *
         * 文档: [http://uniapp.dcloud.io/share.html](http://uniapp.dcloud.io/share.html)
         */
        description: string;
        /**
         * 是否授权认证
         * 用于标识此分享是否已经授权认证过，true表示已完成授权认证；false表示未完成授权认证。
         *
         * 文档: [http://uniapp.dcloud.io/share.html](http://uniapp.dcloud.io/share.html)
         */
        authenticated: boolean;
        /**
         * 授权认证信息
         * 仅在authenticated为true时有效，标识客户认证标识信息，用于发送分享信息。
         *
         * 文档: [http://uniapp.dcloud.io/share.html](http://uniapp.dcloud.io/share.html)
         */
        accessToken: string;
        /**
         * 是否存在对应的分享客户端
         * <p>
         *                         对于某些分享服务，必须依赖相应客户端App才能实现分享操作；有些分享服务则不依赖，客户端App不存在时调用WAP页面进行分享操作。
         * 具体情况如下：
         *                         <ul>
         *                             <li>微信 - 依赖微信客户端App</li>
         *                             <li>QQ - 依赖QQ客户端App</li>
         *                             <li>新浪微博 - 不依赖微博客户端App</li>
         *                         </ul>
         *                         注意：提交AppStore审核时没有安装相应的客户端App可能导致无法通过审核，此时需要判断相应的客户端App是否安装，如果没有安装则不显示对应的分享入口。
         *                     </p>
         *
         * 文档: [http://uniapp.dcloud.io/share.html](http://uniapp.dcloud.io/share.html)
         */
        isAppExist: boolean;
    }

    /**
     * JSON对象，获取的客户端标识信息
     *
     * 文档: [http://uniapp.dcloud.io/push.html](http://uniapp.dcloud.io/push.html)
     */
    interface PlusPushClientInfo {
        /**
         * 推送通道标识
         * 目前支持以下推送通道：
         *                             "igexin" - 表示个推推送；
         *                             "mipush" - 表示小米推送；
         *                             "unipush" - 表示DCloud UniPush。
         * - igexin: 个推推送
         * - mipush: 小米推送
         * - unipush: DCloud UniPush
         *
         * 文档: [http://uniapp.dcloud.io/push.html](http://uniapp.dcloud.io/push.html)
         */
        id: 'igexin' | 'mipush' | 'unipush';
        /**
         * 设备令牌（iOS设备唯一标识），用于APNS服务推送中标识设备的身份
         *
         * 文档: [http://uniapp.dcloud.io/push.html](http://uniapp.dcloud.io/push.html)
         */
        token: string;
        /**
         * 推送服务令牌（设备唯一标识），用于标识推送信息接收者身份
         * 第三方推送服务器管理的设备唯一标识，在iOS平台此值通常与token不同；在其它平台此值通常与token值一致。
         *                         此值与设备及应用都相关，即不同的apk/ipa安装到同一台设备上的值都不相同。
         *
         * 文档: [http://uniapp.dcloud.io/push.html](http://uniapp.dcloud.io/push.html)
         */
        clientid: string;
        /**
         * 第三方推送服务的应用标识
         * 第三方推送服务器管理的应用标识，通常需要在第三方推送服务器平台进行注册获取。
         *
         * 文档: [http://uniapp.dcloud.io/push.html](http://uniapp.dcloud.io/push.html)
         */
        appid: string;
        /**
         * 第三方推送服务器的应用键值
         * 第三方推送服务器管理的应用键值，通常需要在第三方推送服务器平台进行注册获取。
         *
         * 文档: [http://uniapp.dcloud.io/push.html](http://uniapp.dcloud.io/push.html)
         */
        appkey: string;
    }

    /**
     * 登录鉴权服务对象
     * AuthService对象用于表示登录鉴权服务，在JS中为对象，用于发起登录授权认证操作。
     *
     * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
     */
    interface PlusOauthAuthService {
        /**
         * 登录鉴权服务标识
         * <p>
         *                         用于表示登录鉴权服务标识：
         *                         <ul>
         *                             <li>"weixin" - 表示微信登录鉴权</li>
         *                             <li>"qq" - 表示QQ登录鉴权</li>
         *                             <li>"sinaweibo" - 表示新浪微博登录鉴权</li>
         *                             <li>"xiaomi" - 表示小米登录鉴权</li>
         *                             <li>"apple" - 表示苹果登录（仅iOS13+系统支持）</li>
         *                             <li>"univerify" - 表示一键登录（HBuilderX3.0.0+版本支持），详情参考<a href="https://ask.dcloud.net.cn/article/38009">一键登录使用指南</a></li>
         *                         </ul>
         *                     </p>
         * - weixin: 微信登录鉴权
         * - qq: QQ登录鉴权
         * - sinaweibo: 新浪微博登录鉴权
         * - xiaomi: 小米登录鉴权
         * - apple: 苹果登录（仅iOS13+系统支持）
         * - univerify: 一键登录（HBuilderX3.0.0+版本支持）
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        id: 'weixin' | 'qq' | 'sinaweibo' | 'xiaomi' | 'apple' | 'univerify';
        /**
         * 登录鉴权服务描述
         * <p>
         *                         用于描述登录鉴权服务的信息：
         *                         <ul>
         *                             <li>"微信" - 表示微信登录鉴权；</li>
         *                             <li>"QQ" - 表示QQ登录鉴权；</li>
         *                             <li>"新浪微博" - 表示新浪微博登录鉴权；</li>
         *                             <li>"小米" - 表示小米登录鉴权；</li>
         *                             <li>"Apple" - 表示苹果登录；</li>
         *                             <li>"一键登录" - 表示一键登录（HBuilderX3.0.0+版本支持），详情参考<a href="https://ask.dcloud.net.cn/article/38009">一键登录使用指南</a></li>
         *                         </ul>
         *                     </p>
         * - 微信: 微信登录鉴权
         * - QQ: QQ登录鉴权
         * - 新浪微博: 新浪微博登录鉴权
         * - 小米: 小米登录鉴权
         * - Apple: 苹果登录（仅iOS13+系统支持）
         * - 一键登录: 一键登录（HBuilderX3.0.0+版本支持）
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        description: '微信' | 'QQ' | '新浪微博' | '小米' | 'Apple' | '一键登录';
        /**
         * 授权登录依赖的客户端App是否已安装
         * <p>
         *                         对于某些登录鉴权服务，必须依赖相应客户端App才能实现授权操作；有些登录鉴权服务则无需客户端App，或者依赖的客户端App不存在时调用WAP页面进行授权操作。
         * 具体情况如下：
         *                         <ul>
         *                             <li>微信 - 依赖微信客户端App</li>
         *                             <li>QQ - 依赖QQ客户端App</li>
         *                             <li>新浪微博 - 不依赖微博客户端App，不存在是调用WAP页面登录授权操作</li>
         *                             <li>小米登录 - 无需客户端App</li>
         *                             <li>苹果登录 - 无需客户端App</li>
         *                             <li>一键登录 - 无需客户端App</li>
         *                         </ul>
         *                         注意：提交AppStore审核时没有安装相应的客户端App可能导致无法通过审核，此时需要判断相应的客户端App是否安装，如果没有安装则不显示对应的登录入口。
         * HBuilderX3.1.19及以上版本支持。
         *                     </p>
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        isAppExist: boolean;
        /**
         * 苹果登录认证数据
         * 调用login登录认证成功后保存的苹果认证信息。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        appleInfo: PlusOauthAppleInfo;
        /**
         * 登录认证数据
         * 调用login登录认证成功后保存的认证信息。
         *                         如果值为"undefined"则表示未进行登录认证或者登录认证失败。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        authResult: PlusOauthAuthInfo;
        /**
         * 登录用户信息
         * 调用用于保存登录授权认证获取的用户信息，如果值为"undefined"则表示未获取过用户信息。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        userInfo: PlusOauthUserInfo;
        /**
         * 登录授权认证扩展信息
         * 用于保存登录鉴权服务返回的扩展信息，具体内容由各登录平台决定，如果没有扩展信息则为undefined。
         *                         例如“微信”，则可保存以下数据：
         *                         state - 用于保持请求和回调的状态参数。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        extra: any;
    }

    /**
     * 支付通道对象
     * PaymentChannel对象表示特定的支付通道，用于向系统请求支付操作。
     *
     * 文档: [http://uniapp.dcloud.io/payment.html](http://uniapp.dcloud.io/payment.html)
     */
    interface PlusPaymentPaymentChannel {
        /**
         * 支付通道标识
         * 用于标识支付通道：
         *                             "alipay" - 表示支付宝；
         *                             "wxpay" - 表示微信支付；
         *                             "appleiap" - 表示苹果应用内支付；
         *                             "qhpay" - 表示360聚合支付（仅360手助流应用环境下支持）。
         * - alipay: 支付宝
         * - wxpay: 微信支付
         * - appleiap: 苹果应用内支付
         * - qhpay: 360聚合支付（仅360手助流应用环境下支持）
         *
         * 文档: [http://uniapp.dcloud.io/payment.html](http://uniapp.dcloud.io/payment.html)
         */
        id: 'alipay' | 'wxpay' | 'appleiap' | 'qhpay';
        /**
         * 支付通道描述
         * 支付通道的描述信息，如“支付宝”、“微信”、“In-App Purchase”。
         *
         * 文档: [http://uniapp.dcloud.io/payment.html](http://uniapp.dcloud.io/payment.html)
         */
        description: string;
        /**
         * 支付通道服务是否安装
         * 通常特定的支付通道依赖系统安装相关的服务，此属性用于标识其服务是否安装，如果没有安装则为false，否则为true。
         *                         若系统环境中没有安装相关的服务，则可能导致调用支付操作失败，这时可以调用installService方法进行安装。
         *                         注意：如果支付通道不需要依赖系统安装服务，则永远返回true。例如支付宝，如果设备上未安装支付宝客户端则调用Wap页面进行支付，因此值固定返回true；
         *                         而微信支付则依赖微信客户端，如果设备上未安装微信客户端则serviceReady值为false，此时应该提示用户安装微信客户端才能进行支付操作。
         *
         * 文档: [http://uniapp.dcloud.io/payment.html](http://uniapp.dcloud.io/payment.html)
         */
        isAppExist: boolean;
    }

    /**
     * 苹果登录认证信息
     * 此对象仅在使用苹果登录时有效，用于保存苹果登录返回的数据。
     *
     * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
     */
    interface PlusOauthAppleInfo {
        /**
         * 苹果用户唯一标识符
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        user: string;
        /**
         * 验证信息状态
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        state: string;
        /**
         * 用户共享的可选电子邮件
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        email: string;
        /**
         * 用户共享的可选全名
         * 可能包括以下属性：
         *                         namePrefix - String类型，名字前缀，头衔、敬称；
         *                         givenName - String类型，名字；
         *                         middleName - String类型，中间名；
         *                         familyName - String类型，姓；
         *                         nameSuffix - String类型，名字后缀，学位、荣誉；
         *                         nickName - String类型，昵称。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        fullName: any;
        /**
         * 验证数据
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        authorizationCode: string;
        /**
         * Web令牌(JWT)
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        identityToken: string;
        /**
         * 标识用户是否为真实的人
         * 0 - 当前平台不支持，忽略该值；
         *                         1 - 无法确认；
         *                         2 - 用户真实性非常高。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        realUserStatus: number;
    }

    /**
     * 登录授权认证信息
     * 此对象仅定义标准属性，登录授权认证服务可扩展自定义数据。
     *                 例如“微信”登录授权服务，则包括以下数据：
     *                 unionid - 用户统一标识，针对一个微信开放平台帐号下的应用，同一用户的unionid是唯一的。
     *
     * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
     */
    interface PlusOauthAuthInfo {
        /**
         * 登录授权的访问令牌
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        access_token: string;
        /**
         * 登录授权用户的唯一标识
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        openid: string;
        /**
         * 登录授权访问令牌过期时间
         * 单位为秒，如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        expires_in: string;
        /**
         * 登录授权的更新令牌
         * 用来获取下一次的访问令牌，如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        refresh_token: string;
        /**
         * 登录授权的权限范围
         * 如果存在多个权限，则以","符号分割。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        scope: string;
    }

    /**
     * 登录授权用户信息
     * <p>
     *                 用于保存登录授权用户的信息。
     *                 此对象仅定义标准属性，登录授权认证服务可扩展自定义数据。
     *                 例如“微信”登录授权服务，可能包括以下自定义数据：
     *                 <ul>
     *                     <li>privilege - 用户特权信息，json数组，如微信沃卡用户为（chinaunicom）</li>
     *                 </ul>
     *                 unionid - ，。
     *             </p>
     *
     * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
     */
    interface PlusOauthUserInfo {
        /**
         * 登录授权用户的唯一标识
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        openid: string;
        /**
         * 登录授权用户的头像图片地址
         * 要求为"http://"或"https://"开头的地址，如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        headimgurl: string;
        /**
         * 登录授权用户的昵称
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        nickname: string;
        /**
         * 登录授权用户的邮箱地址
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        email: string;
        /**
         * 登录授权用户的电话号码
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        phonenumber: string;
        /**
         * 登录授权用户的性别
         * 1为男性，2为女性。
         *                         如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        sex: string;
        /**
         * 登录授权用户注册的省份信息
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        province: string;
        /**
         * 登录授权用户注册的城市信息
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        city: string;
        /**
         * 登录授权用户注册的国家信息
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        country: string;
        /**
         * 用户统一标识
         * <p>
         *                         针对同一个登录授权服务平台帐号下的应用，同一用户的unionid是唯一的。
         * 如果登录授权服务不支持此属性，则返回"undefined"。
         * 注意：仅微信及QQ平台支持，QQ平台HBuilderX3.0.0+版本支持，需在QQ开放平台申请才能获取。
         *                     </p>
         *
         * 文档: [http://uniapp.dcloud.io/oauth.html](http://uniapp.dcloud.io/oauth.html)
         */
        unionid: string;
    }
}

/**
 * Uni 实例变量
 *
 * 文档: [http://uniapp.dcloud.io/api](http://uniapp.dcloud.io/api)
 */
declare const uni: UniNamespace.Uni;

interface Uni {
    env: {
      USER_DATA_PATH: string;
    },
    /**
     * 将 Base64 字符串转成 ArrayBuffer 对象
     *
     * 文档: [http://uniapp.dcloud.io/api/base64ToArrayBuffer?id=base64toarraybuffer](http://uniapp.dcloud.io/api/base64ToArrayBuffer?id=base64toarraybuffer)
     */
    base64ToArrayBuffer(base64: string): ArrayBuffer;
    /**
     * 将 ArrayBuffer 对象转成 Base64 字符串
     *
     * 文档: [http://uniapp.dcloud.io/api/arrayBufferToBase64?id=arraybuffertobase64](http://uniapp.dcloud.io/api/arrayBufferToBase64?id=arraybuffertobase64)
     */
    arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;
    /**
     * 监听自定义事件。事件可以由 uni.$emit 触发。回调函数会接收 uni.$emit 传递的参数。
     *
     * 文档: [http://uniapp.dcloud.io/api/window/communication?id=on](http://uniapp.dcloud.io/api/window/communication?id=on)
     */
    $on(eventName: string, callback: (result: any) => void): void;
    /**
     * 触发自定义事件，附加的参数会传递给事件监听器。
     *
     * 文档: [http://uniapp.dcloud.io/api/window/communication?id=emit](http://uniapp.dcloud.io/api/window/communication?id=emit)
     */
    $emit(eventName: string, param?: any): void;
    /**
     * 监听一个自定义事件。事件只触发一次，在第一次触发之后移除事件监听器。
     *
     * 文档: [http://uniapp.dcloud.io/api/window/communication?id=once](http://uniapp.dcloud.io/api/window/communication?id=once)
     */
    $once(eventName: string, callback: (result: any) => void): void;
    /**
     * 移除自定义事件监听器。如果没有指定事件名，则移除所有事件监听器。如果提供事件名，则移除该事件的所有监听器。如果提供了事件名和回调，则只移除这个回调的监听器。
     *
     * 文档: [http://uniapp.dcloud.io/api/window/communication?id=off](http://uniapp.dcloud.io/api/window/communication?id=off)
     */
    $off(eventName?: string | string[], callback?: (result: any) => void): void;
    /**
     * 通过id 获取 subNVues 原生子窗体的实例
     *
     * 文档: [http://uniapp.dcloud.io/api/window/subNVues?id=app-getsubnvuebyid](http://uniapp.dcloud.io/api/window/subNVues?id=app-getsubnvuebyid)
     */
    getSubNVueById(subNvueId: string): UniNamespace.SubNVue;
    /**
     * 获取当前 subNVues 原生子窗体的实例
     *
     * 文档: [http://uniapp.dcloud.io/api/window/subNVues?id=app-getsubnvuebyid](http://uniapp.dcloud.io/api/window/subNVues?id=app-getsubnvuebyid)
     */
    getCurrentSubNVue(): UniNamespace.SubNVue;
    /**
     * 上传文件
     *
     * 文档: [http://uniapp.dcloud.io/api/request/network-file?id=uploadfile](http://uniapp.dcloud.io/api/request/network-file?id=uploadfile)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.uploadFile({
     * 			url: 'http://192.168.12.106:8080/uploadFile', //仅为示例，非真实的接口地址
     * 			filePath: "/static/logo.png",
     * 			name: 'file',
     * 			formData: {
     * 				'user': 'test'
     * 			},
     * 			success: (uploadFileRes) => {
     * 				console.log(uploadFileRes.data);
     * 			}
     * 		});
     * ```
     */
    uploadFile(options: UniNamespace.UploadFileOption): UniNamespace.UploadTask;
    /**
     * 下载文件
     *
     * 文档: [http://uniapp.dcloud.io/api/request/network-file?id=downloadfile](http://uniapp.dcloud.io/api/request/network-file?id=downloadfile)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/network-file.html#downloadfile
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.downloadFile({
     * 				url: "http://192.168.12.106:8080/downloadfile",
     * 				success(e) {
     * 					console.log("success111 :", e);
     * 				}
     * 			});
     * ```
     */
    downloadFile(options: UniNamespace.DownloadFileOption): Promise<UniNamespace.DownloadSuccessData>;
    /**
     * 导入原生插件
     *
     * 文档: [http://uniapp.dcloud.io/plugin/native-plugin.html#requirenativeplugin](http://uniapp.dcloud.io/plugin/native-plugin.html#requirenativeplugin)
     */
    requireNativePlugin(moduleName: string): any;
    /**
     * upx 换算为 px
     *
     * 文档: [http://uniapp.dcloud.io/frame?id=upx2px](http://uniapp.dcloud.io/frame?id=upx2px)
     */
    upx2px(upx: number): number;
    /**
     * 配置自签名证书
     *
     * 文档: [http://uniapp.dcloud.io/api/request/request?id=configMTLS](http://uniapp.dcloud.io/api/request/request?id=configMTLS)
     */
    configMTLS(options: UniNamespace.ConfigMTLSOptions): void;
    /**
     * 创建一个 WebSocket 连接
     *
     * 文档: [http://uniapp.dcloud.io/api/request/websocket?id=connectsocket](http://uniapp.dcloud.io/api/request/websocket?id=connectsocket)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/websocket.html#connectsocket
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     *  uni.connectSocket({
     * 		url: "ws://192.168.12.106:8080/ws",
     * 		complete: (e) => {
     * 			console.log("socket :", e);
     * 		}
     * 	});
     * ```
     */
    connectSocket(options: UniNamespace.ConnectSocketOption): UniNamespace.SocketTask;
    /**
     * 监听WebSocket连接打开事件
     *
     * 文档: [http://uniapp.dcloud.io/api/request/websocket?id=onsocketopen](http://uniapp.dcloud.io/api/request/websocket?id=onsocketopen)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketopen
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.onSocketOpen(function (res) {
     *  console.log('WebSocket连接已打开！');
     * });
     * ```
     */
    onSocketOpen(options: (result: UniNamespace.OnSocketOpenCallbackResult) => void): void;
    /**
     * 监听WebSocket错误
     *
     * 文档: [http://uniapp.dcloud.io/api/request/websocket?id=onsocketerror](http://uniapp.dcloud.io/api/request/websocket?id=onsocketerror)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketerror
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.onSocketError(function (res) {
     * console.log('WebSocket连接打开失败，请检查！');
     * });
     * ```
     */
    onSocketError(callback: (result: UniNamespace.GeneralCallbackResult) => void): void;
    /**
     * 通过 WebSocket 连接发送数据
     *
     * 文档: [http://uniapp.dcloud.io/api/request/websocket?id=sendsocketmessage](http://uniapp.dcloud.io/api/request/websocket?id=sendsocketmessage)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/websocket.html#sendsocketmessage
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.sendSocketMessage({
     * data: msg
     * });
     * ```
     */
    sendSocketMessage(options: UniNamespace.SendSocketMessageOptions): void;
    /**
     * 监听WebSocket接受到服务器的消息事件
     *
     * 文档: [http://uniapp.dcloud.io/api/request/websocket?id=onsocketmessage](http://uniapp.dcloud.io/api/request/websocket?id=onsocketmessage)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketmessage
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.onSocketMessage(function (res) {
     * console.log('收到服务器内容：' + res.data);
     * });
     * ```
     */
    onSocketMessage<T = any>(callback: (result: UniNamespace.OnSocketMessageCallbackResult<T>) => void): void;
    /**
     * 关闭 WebSocket 连接
     *
     * 文档: [http://uniapp.dcloud.io/api/request/websocket?id=closesocket](http://uniapp.dcloud.io/api/request/websocket?id=closesocket)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/websocket.html#closesocket
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.closeSocket();
     * ```
     */
    closeSocket(options: UniNamespace.CloseSocketOptions): void;
    /**
     * 监听WebSocket关闭
     *
     * 文档: [http://uniapp.dcloud.io/api/request/websocket?id=onsocketclose](http://uniapp.dcloud.io/api/request/websocket?id=onsocketclose)
     * @tutorial https://uniapp.dcloud.net.cn/api/request/websocket.html#onsocketclose
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.onSocketClose(function (res) {
     * console.log('WebSocket 已关闭！');
     * });
     * ```
     */
    onSocketClose(callback: (result: UniNamespace.OnSocketCloseOptions) => void): void;
    /**
     * 从本地相册选择图片或使用相机拍照
     *
     * 文档: [http://uniapp.dcloud.io/api/media/image?id=chooseimage](http://uniapp.dcloud.io/api/media/image?id=chooseimage)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.chooseImage({
     * count:3,
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	}
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/image?id=chooseimage
     */
    chooseImage(options: UniNamespace.ChooseImageOptions): void;
    /**
     * 从本地选择文件（仅支持H5）
     *
     * 文档: [http://uniapp.dcloud.io/api/media/file?id=chooseFile](http://uniapp.dcloud.io/api/media/file?id=chooseFile)
     */
    chooseFile(options: UniNamespace.ChooseFileOptions): void;
    /**
     * 预览图片
     *
     * 文档: [http://uniapp.dcloud.io/api/media/image?id=previewimage](http://uniapp.dcloud.io/api/media/image?id=previewimage)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.previewImage({
     * urls:['/static/a.jpg','/static/b.jpg'],
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	}
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/image?id=previewimage
     */
    previewImage(options: UniNamespace.PreviewImageOptions): void;
    /**
     * 预览图片
     *
     * 文档: [http://uniapp.dcloud.io/api/media/image?id=closepreviewimage](http://uniapp.dcloud.io/api/media/image?id=closepreviewimage)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.closePreviewImage({
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	}
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/image?id=closepreviewimage
     */
    closePreviewImage(options: UniNamespace.CallBackOptions): void;
    /**
     * 预览图片
     *
     * 文档: [http://uniapp.dcloud.io/api/media/image?id=getimageinfo](http://uniapp.dcloud.io/api/media/image?id=getimageinfo)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getImageInfo({
     * src:'/static/a.jpg',
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	},
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/image?id=getimageinfo
     */
    getImageInfo(options: UniNamespace.GetImageInfoOptions): void;
    /**
     * 保存图片到系统相册
     *
     * 文档: [http://uniapp.dcloud.io/api/media/image?id=saveimagetophotosalbum](http://uniapp.dcloud.io/api/media/image?id=saveimagetophotosalbum)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.saveImageToPhotosAlbum({
     * filePath:'/static/a.jpg',
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	},
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/image?id=saveimagetophotosalbum
     */
    saveImageToPhotosAlbum(options: UniNamespace.SaveImageToPhotosAlbumOptions): void;
    /**
     * 压缩图片
     *
     * 文档: [http://uniapp.dcloud.io/api/media/image?id=compressimage](http://uniapp.dcloud.io/api/media/image?id=compressimage)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.compressImage({
     * src:'/static/a.jpg',
     * 	quality:80,
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	},
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/image?id=compressimage
     */
    compressImage(options: UniNamespace.CompressImageOptions): void;
    /**
     * 录音管理
     *
     * 文档: [http://uniapp.dcloud.io/api/media/record-manager?id=getrecordermanager](http://uniapp.dcloud.io/api/media/record-manager?id=getrecordermanager)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @tutorial http://uniapp.dcloud.io/api/media/record-manager?id=getrecordermanager
     * @example ```typescript
     * 	var manager = uni.getRecorderManager()
     * manager.start({
     * 	format:"mp3"
     * })
     * manager.onStop((e)=>{
     * 	console.log("录音结束")
     * })
     * ```
     */
    getRecorderManager(): UniNamespace.RecorderManager;
    /**
     * 获取全局唯一的背景音频管理器 backgroundAudioManager
     *
     * 文档: [http://uniapp.dcloud.io/api/media/background-audio-manager?id=getbackgroundaudiomanager](http://uniapp.dcloud.io/api/media/background-audio-manager?id=getbackgroundaudiomanager)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "√"
     * }
     * }
     * }
     * @return 背景音频对象
     * @tutorial http://uniapp.dcloud.io/api/media/background-audio-manager?id=getbackgroundaudiomanager
     */
    getBackgroundAudioManager(): UniNamespace.BackgroundAudioManager;
    /**
     * 创建并返回 audio 上下文 audioContext 对象
     *
     * 文档: [http://uniapp.dcloud.io/api/media/audio-context?id=createinneraudiocontext](http://uniapp.dcloud.io/api/media/audio-context?id=createinneraudiocontext)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "√"
     * }
     * }
     * }
     * @return 音频对象
     * @tutorial http://uniapp.dcloud.io/api/media/audio-context?id=createinneraudiocontext
     */
    createInnerAudioContext(): UniNamespace.InnerAudioContext;
    /**
     * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
     *
     * 文档: [http://uniapp.dcloud.io/api/media/video?id=choosevideo](http://uniapp.dcloud.io/api/media/video?id=choosevideo)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.chooseVideo({
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	},
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/video?id=choosevideo
     */
    chooseVideo(options: UniNamespace.ChooseVideoOptions): void;
    /**
     * 压缩视频
     *
     * 文档: [http://uniapp.dcloud.io/api/media/video?id=compressvideo](http://uniapp.dcloud.io/api/media/video?id=compressvideo)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.compressVideo({
     *  src:"/static/a.mp4",
     *  quality:"low",
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	},
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/video?id=compressvideo
     */
    compressVideo(options: UniNamespace.CompressVideoOptions): void;
    /**
     * 压缩视频
     *
     * 文档: [http://uniapp.dcloud.io/api/media/video?id=getvideoinfo](http://uniapp.dcloud.io/api/media/video?id=getvideoinfo)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.GetVideoInfo({
     *  src:"/static/a.mp4",
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	},
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/video?id=getvideoinfo
     */
    getVideoInfo(options: UniNamespace.GetVideoInfoOptions): void;
    /**
     * 打开视频编辑器
     *
     * 文档: [http://uniapp.dcloud.io/api/media/video?id=openvideoeditor](http://uniapp.dcloud.io/api/media/video?id=openvideoeditor)
     */
    openVideoEditor(options: UniNamespace.OpenVideoEditorOptions): void;
    /**
     * 保存视频到系统相册
     *
     * 文档: [http://uniapp.dcloud.io/api/media/video?id=savevideotophotosalbum](http://uniapp.dcloud.io/api/media/video?id=savevideotophotosalbum)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.saveVideoToPhotosAlbum({
     *  filePath:"/static/a.mp4",
     * success(e){
     * 	console.log(JSON.stringify(e))
     * 	},
     * })
     * ```
     * @tutorial http://uniapp.dcloud.io/api/media/video?id=savevideotophotosalbum
     */
    saveVideoToPhotosAlbum(options: UniNamespace.SaveVideoToPhotosAlbumOptions): void;
    /**
     * 创建并返回 video 上下文 videoContext 对象
     *
     * 文档: [http://uniapp.dcloud.io/api/media/video-context?id=createvideocontext](http://uniapp.dcloud.io/api/media/video-context?id=createvideocontext)
     */
    createVideoContext(videoId: string, componentInstance?: any): UniNamespace.VideoContext;
    /**
     * 创建并返回 camera 组件的上下文 cameraContext 对象
     *
     * 文档: [http://uniapp.dcloud.io/api/media/camera-context](http://uniapp.dcloud.io/api/media/camera-context)
     */
    createCameraContext(): UniNamespace.CameraContext;
    /**
     * 创建 live-pusher 上下文 livePusherContext 对象
     *
     * 文档: [http://uniapp.dcloud.io/api/media/camera-context](http://uniapp.dcloud.io/api/media/camera-context)
     */
    createLivePusherContext(livePusherId: string, componentInstance: any): UniNamespace.LivePusherContext;
    /**
     * 保存文件到本地
     *
     * 文档: [http://uniapp.dcloud.io/api/file/file?id=savefile](http://uniapp.dcloud.io/api/file/file?id=savefile)
     */
    saveFile(options: UniNamespace.SaveFileOptions): void;
    /** 获取文件信息 */
    getFileInfo(options: UniNamespace.GetFileInfoOptions): void;
    /**
     * 获取本地已保存的文件列表
     *
     * 文档: [http://uniapp.dcloud.io/api/file/file?id=getsavedfilelist](http://uniapp.dcloud.io/api/file/file?id=getsavedfilelist)
     */
    getSavedFileList(options: UniNamespace.GetSavedFileListOptions): void;
    /**
     * 获取本地文件的文件信息
     *
     * 文档: [http://uniapp.dcloud.io/api/file/file?id=getsavedfileinfo](http://uniapp.dcloud.io/api/file/file?id=getsavedfileinfo)
     */
    getSavedFileInfo(options: UniNamespace.GetSavedFileInfoOptions): void;
    /**
     * 删除本地存储的文件
     *
     * 文档: [http://uniapp.dcloud.io/api/file/file?id=removesavedfile](http://uniapp.dcloud.io/api/file/file?id=removesavedfile)
     */
    removeSavedFile(options: UniNamespace.RemoveSavedFileOptions): void;
    /**
     * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
     *
     * 文档: [http://uniapp.dcloud.io/api/file/file?id=opendocument](http://uniapp.dcloud.io/api/file/file?id=opendocument)
     */
    openDocument(options: UniNamespace.OpenDocumentOptions): Promise<any>;
    /**
     * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=setstorage](http://uniapp.dcloud.io/api/storage/storage?id=setstorage)
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#setstorage
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    setStorage(options: UniNamespace.SetStorageOptions): Promise<any>;
    /**
     * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=setstoragesync](http://uniapp.dcloud.io/api/storage/storage?id=setstoragesync)
     * @param 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#setstoragesync
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    setStorageSync(key: string, value: any): void;
    /**
     * 自定义统计上报数据
     *
     * 文档: [http://uniapp.dcloud.io/api/other/report?id=统计](http://uniapp.dcloud.io/api/other/report?id=统计)
     */
    report(eventName: string, options: any): void;
    /**
     * 从本地缓存中异步获取指定 key 对应的内容
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=getstorage](http://uniapp.dcloud.io/api/storage/storage?id=getstorage)
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#getstorage
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    getStorage<T = any>(options: UniNamespace.GetStorageOptions<T>): Promise<UniNamespace.GetStorageSuccess<T>>;
    /**
     * 从本地缓存中同步获取指定 key 对应的内容
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=getstoragesync](http://uniapp.dcloud.io/api/storage/storage?id=getstoragesync)
     * @param 本地缓存中的指定的 key
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#getstoragesync
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    getStorageSync<T = any>(key: string): T;
    /**
     * 异步获取当前 storage 的相关信息
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=getstorageinfo](http://uniapp.dcloud.io/api/storage/storage?id=getstorageinfo)
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#getstorageinfo
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    getStorageInfo(options: UniNamespace.GetStorageInfoOptions): void;
    /**
     * 同步获取当前 storage 的相关信息
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=getstorageinfosync](http://uniapp.dcloud.io/api/storage/storage?id=getstorageinfosync)
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#getstorageinfosync
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    getStorageInfoSync(): UniNamespace.GetStorageInfoSuccess;
    /**
     * 从本地缓存中异步移除指定 key
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=removestorage](http://uniapp.dcloud.io/api/storage/storage?id=removestorage)
     * @tutorial hhttps://uniapp.dcloud.net.cn/api/storage/storage.html#removestorage
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    removeStorage(options: UniNamespace.RemoveStorageOptions): void;
    /**
     * 从本地缓存中同步移除指定 key
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=removestoragesync](http://uniapp.dcloud.io/api/storage/storage?id=removestoragesync)
     * @param 本地缓存中的指定的 key
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#removestoragesync
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    removeStorageSync(key: string): void;
    /**
     * 清理本地数据缓存
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=clearstorage](http://uniapp.dcloud.io/api/storage/storage?id=clearstorage)
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#clearstorage
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    clearStorage(): void;
    /**
     * 同步清理本地数据缓存
     *
     * 文档: [http://uniapp.dcloud.io/api/storage/storage?id=clearstoragesync](http://uniapp.dcloud.io/api/storage/storage?id=clearstoragesync)
     * @tutorial https://uniapp.dcloud.net.cn/api/storage/storage.html#clearstoragesync
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "2.0.3",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    clearStorageSync(): void;
    /**
     * 获取当前的地理位置、速度
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location?id=getlocation](http://uniapp.dcloud.io/api/location/location?id=getlocation)
     * @tutorial http://uniapp.dcloud.io/api/location/location?id=getlocation
     */
    getLocation(options: UniNamespace.GetLocationOptions): void;
    /**
     * 打开地图选择位置。
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location?id=chooselocation](http://uniapp.dcloud.io/api/location/location?id=chooselocation)
     */
    chooseLocation(options: UniNamespace.ChooseLocationOptions): void;
    /**
     * 使用地图查看位置
     *
     * 文档: [http://uniapp.dcloud.io/api/location/open-location?id=openlocation](http://uniapp.dcloud.io/api/location/open-location?id=openlocation)
     */
    openLocation(options: UniNamespace.OpenLocationOptions): void;
    /**
     * 开启小程序进入前台时接收位置消息。
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location-change.html#startLocationUpdate](http://uniapp.dcloud.io/api/location/location-change.html#startLocationUpdate)
     */
    startLocationUpdate(options?: UniNamespace.StartLocationUpdateOption): any;
    /**
     * 监听实时地理位置变化事件，需结合 uni.startLocationUpdate 或 uni.startLocationUpdateBackground 使用。
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location-change.html#onLocationChange](http://uniapp.dcloud.io/api/location/location-change.html#onLocationChange)
     */
    onLocationChange(callback: (result: UniNamespace.OnLocationChangeCallbackResult) => void): any;
    /**
     * 关闭监听实时位置变化，前后台都停止消息接收。
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location-change.html#stopLocationUpdate](http://uniapp.dcloud.io/api/location/location-change.html#stopLocationUpdate)
     */
    stopLocationUpdate(options?: any): any;
    /**
     * 关闭监听实时位置变化，前后台都停止消息接收。
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location-change.html#offLocationChange](http://uniapp.dcloud.io/api/location/location-change.html#offLocationChange)
     */
    offLocationChange(callback: (result: UniNamespace.OnLocationChangeCallbackResult) => void): any;
    /**
     * 监听持续定位接口返回失败时触发。
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location-change.html#onLocationChangeError](http://uniapp.dcloud.io/api/location/location-change.html#onLocationChangeError)
     */
    onLocationChangeError(callback: (result: any) => void): any;
    /**
     * 取消注册位置更新错误回调。
     *
     * 文档: [http://uniapp.dcloud.io/api/location/location-change.html#offLocationChangeError](http://uniapp.dcloud.io/api/location/location-change.html#offLocationChangeError)
     */
    offLocationChangeError(callback: (result: any) => void): any;
    /**
     * 异步获取系统信息
     *
     * 文档: [http://uniapp.dcloud.io/api/system/info?id=getsysteminfo](http://uniapp.dcloud.io/api/system/info?id=getsysteminfo)
     * @tutorial http://uniapp.dcloud.io/api/system/info?id=getsysteminfo
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getSystemInfo({
     * success(e) {
     * 	console.log("success :",e);
     * },
     * complete(e) {
     * 	console.log("complete :",e);
     * }
     * })
     * ```
     */
    getSystemInfo(options?: UniNamespace.GetSystemInfoOptions): void;
    /**
     * 同步获取系统信息
     *
     * 文档: [http://uniapp.dcloud.io/api/system/info?id=getsysteminfosync](http://uniapp.dcloud.io/api/system/info?id=getsysteminfosync)
     * @tutorial http://uniapp.dcloud.io/api/system/info?id=getsysteminfosync
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getSystemInfoSync()
     * ```
     */
    getSystemInfoSync(): UniNamespace.GetSystemInfoResult;
    /**
     * 同步获取窗口信息
     *
     * 文档: [http://uniapp.dcloud.io/api/system/getWindowInfo.html](http://uniapp.dcloud.io/api/system/getWindowInfo.html)
     * @tutorial http://uniapp.dcloud.io/api/system/getWindowInfo.html
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getWindowInfo()
     * ```
     */
    getWindowInfo(): UniNamespace.GetWindowInfoResult;
    /**
     * 同步获取设备基础信息
     *
     * 文档: [http://uniapp.dcloud.io/api/system/getDeviceInfo.html](http://uniapp.dcloud.io/api/system/getDeviceInfo.html)
     * @tutorial https://uniapp.dcloud.net.cn/api/system/getDeviceInfo.html
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getDeviceInfo({
     * filter:[]
     * })
     * ```
     */
    getDeviceInfo(): UniNamespace.GetDeviceInfoResult;
    /**
     * 同步获取设备基础信息
     *
     * 文档: [http://uniapp.dcloud.io/api/system/info?id=getappbaseinfo](http://uniapp.dcloud.io/api/system/info?id=getappbaseinfo)
     * @tutorial https://uniapp.dcloud.net.cn/api/system/getAppBaseInfo.html
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getAppBaseInfo({
     * filter:[]
     * })
     * ```
     */
    getAppBaseInfo(): UniNamespace.GetAppBaseInfoResult;
    /**
     * 判断uni-app的API，回调，参数，组件等是否在当前版本可用
     *
     * 文档: [http://uniapp.dcloud.io/api/caniuse.html](http://uniapp.dcloud.io/api/caniuse.html)
     */
    canIUse(schema: keyof Uni | string): boolean;
    /**
     * 获取网络类型
     *
     * 文档: [http://uniapp.dcloud.io/api/system/network?id=getnetworktype](http://uniapp.dcloud.io/api/system/network?id=getnetworktype)
     * @tutorial http://uniapp.dcloud.io/api/system/network?id=getnetworktype
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getNetworkType({
     * 	success(res){
     * 		console.log(res);
     * 	}
     * });
     * ```
     */
    getNetworkType(options: UniNamespace.GetNetworkTypeOptions): void;
    /**
     * 监听网络状态变化
     *
     * 文档: [http://uniapp.dcloud.io/api/system/network?id=onnetworkstatuschange](http://uniapp.dcloud.io/api/system/network?id=onnetworkstatuschange)
     */
    onNetworkStatusChange(callback: (result: UniNamespace.OnNetworkStatusChangeSuccess) => void): void;
    /**
     * 取消监听网络状态变化
     *
     * 文档: [http://uniapp.dcloud.io/api/system/compass?id=offnetworkstatuschange](http://uniapp.dcloud.io/api/system/compass?id=offnetworkstatuschange)
     */
    offNetworkStatusChange(callback: (result: any) => void): void;
    /**
     * 监听加速度数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/accelerometer?id=onaccelerometerchange](http://uniapp.dcloud.io/api/system/accelerometer?id=onaccelerometerchange)
     */
    onAccelerometerChange(callback: (result: UniNamespace.OnAccelerometerChangeSuccess) => void): void;
    /**
     * 取消监听加速度数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/accelerometer?id=offaccelerometerchange](http://uniapp.dcloud.io/api/system/accelerometer?id=offaccelerometerchange)
     */
    offAccelerometerChange(callback: (result: any) => void): void;
    /**
     * 开始监听加速度数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/accelerometer?id=startaccelerometer](http://uniapp.dcloud.io/api/system/accelerometer?id=startaccelerometer)
     */
    startAccelerometer(options?: UniNamespace.StartAccelerometerOptions): void;
    /**
     * 停止监听加速度数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/accelerometer?id=stopaccelerometer](http://uniapp.dcloud.io/api/system/accelerometer?id=stopaccelerometer)
     */
    stopAccelerometer(options?: UniNamespace.StopAccelerometerOptions): void;
    /**
     * 监听罗盘数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/compass?id=oncompasschange](http://uniapp.dcloud.io/api/system/compass?id=oncompasschange)
     */
    onCompassChange(callback: (result: UniNamespace.OnCompassChangeSuccess) => void): void;
    /**
     * 取消监听罗盘数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/compass?id=offcompasschange](http://uniapp.dcloud.io/api/system/compass?id=offcompasschange)
     */
    offCompassChange(callback: (result: any) => void): void;
    /**
     * 开始监听罗盘数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/compass?id=startcompass](http://uniapp.dcloud.io/api/system/compass?id=startcompass)
     */
    startCompass(options?: UniNamespace.StartCompassOptions): void;
    /**
     * 停止监听罗盘数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/compass?id=stopcompass](http://uniapp.dcloud.io/api/system/compass?id=stopcompass)
     */
    stopCompass(options?: UniNamespace.StopCompassOptions): void;
    /**
     * 拨打电话
     *
     * 文档: [http://uniapp.dcloud.io/api/system/phone?id=makephonecall](http://uniapp.dcloud.io/api/system/phone?id=makephonecall)
     */
    makePhoneCall(options: UniNamespace.MakePhoneCallOptions): void;
    /**
     * 调用扫码界面，扫码成功后返回对应的结果
     *
     * 文档: [http://uniapp.dcloud.io/api/system/barcode?id=scancode](http://uniapp.dcloud.io/api/system/barcode?id=scancode)
     */
    scanCode(options: UniNamespace.ScanCodeOptions): void;
    /**
     * 设置系统剪贴板的内容
     *
     * 文档: [http://uniapp.dcloud.io/api/system/clipboard?id=setclipboarddata](http://uniapp.dcloud.io/api/system/clipboard?id=setclipboarddata)
     */
    setClipboardData(options: UniNamespace.SetClipboardDataOptions): Promise<{
        errMsg: "setClipboardData:ok" | string;
    }>;
    /**
     * 获得系统剪贴板的内容
     *
     * 文档: [http://uniapp.dcloud.io/api/system/clipboard?id=getclipboarddata](http://uniapp.dcloud.io/api/system/clipboard?id=getclipboarddata)
     */
    getClipboardData(options: UniNamespace.GetClipboardDataOptions): void;
    /**
     * 获取 APP 授权设置
     *
     * 文档: [http://uniapp.dcloud.io/api/system/getappauthorizesetting](http://uniapp.dcloud.io/api/system/getappauthorizesetting)
     * @tutorial http://uniapp.dcloud.io/api/system/getappauthorizesetting
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getAppAuthorizeSetting()
     * ```
     */
    getAppAuthorizeSetting(): UniNamespace.GetAppAuthorizeSettingResult;
    /**
     * 获取设备设置
     *
     * 文档: [http://uniapp.dcloud.io/api/system/getsystemsetting](http://uniapp.dcloud.io/api/system/getsystemsetting)
     * @tutorial https://uniapp.dcloud.net.cn/api/system/getsystemsetting.html
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.getSystemSetting()
     * ```
     */
    getSystemSetting(): UniNamespace.GetsystemsettingResult;
    /**
     * 跳转系统授权管理页
     *
     * 文档: [http://uniapp.dcloud.io/api/system/openappauthorizesetting](http://uniapp.dcloud.io/api/system/openappauthorizesetting)
     * @tutorial http://uniapp.dcloud.io/api/system/openappauthorizesetting
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     * @example ```typescript
     * uni.openAppAuthorizeSetting({});
     * ```
     */
    openAppAuthorizeSetting(options: UniNamespace.CallBackOptions): void;
    /**
     * 弹出软键盘
     *
     * 文档: [http://uniapp.dcloud.io/api/key?id=showkeyboard](http://uniapp.dcloud.io/api/key?id=showkeyboard)
     */
    showKeyboard(): void;
    /**
     * 隐藏软键盘
     *
     * 文档: [http://uniapp.dcloud.io/api/key?id=hidekeyboard](http://uniapp.dcloud.io/api/key?id=hidekeyboard)
     */
    hideKeyboard(): void;
    /**
     * 监听键盘高度变化
     *
     * 文档: [http://uniapp.dcloud.io/api/key?id=onkeyboardheightchange](http://uniapp.dcloud.io/api/key?id=onkeyboardheightchange)
     */
    onKeyboardHeightChange(callback: (result: UniNamespace.OnKeyboardHeightChangeResult) => void): void;
    /**
     * 取消监听键盘高度变化事件
     *
     * 文档: [http://uniapp.dcloud.io/api/key?id=offkeyboardheightchange](http://uniapp.dcloud.io/api/key?id=offkeyboardheightchange)
     */
    offKeyboardHeightChange(callback?: (result: any) => void): void;
    /**
     * 获取输入框的光标位置
     *
     * 文档: [http://uniapp.dcloud.io/api/key?id=getselectedtextrange](http://uniapp.dcloud.io/api/key?id=getselectedtextrange)
     */
    getSelectedTextRange(options: UniNamespace.GetSelectedTextRangeOptions): void;
    /**
     * 设置屏幕亮度
     *
     * 文档: [http://uniapp.dcloud.io/api/system/brightness?id=setscreenbrightness](http://uniapp.dcloud.io/api/system/brightness?id=setscreenbrightness)
     */
    setScreenBrightness(options: UniNamespace.SetScreenBrightnessOptions): void;
    /**
     * 获取屏幕亮度
     *
     * 文档: [http://uniapp.dcloud.io/api/system/brightness?id=getscreenbrightness](http://uniapp.dcloud.io/api/system/brightness?id=getscreenbrightness)
     */
    getScreenBrightness(options: UniNamespace.GetScreenBrightnessOptions): void;
    /**
     * 设置是否保持常亮状态
     *
     * 文档: [http://uniapp.dcloud.io/api/system/brightness?id=setkeepscreenon](http://uniapp.dcloud.io/api/system/brightness?id=setkeepscreenon)
     */
    setKeepScreenOn(options: UniNamespace.SetKeepScreenOnOptions): void;
    /**
     * 使手机发生振动
     *
     * 文档: [https://uniapp.dcloud.net.cn/api/system/vibrate.html#vibrate](https://uniapp.dcloud.net.cn/api/system/vibrate.html#vibrate)
     */
    vibrate(options: UniNamespace.VibrateOptions): void;
    /**
     * 使手机发生较长时间的振动（400ms）
     *
     * 文档: [http://uniapp.dcloud.io/api/system/vibrate?id=vibratelong](http://uniapp.dcloud.io/api/system/vibrate?id=vibratelong)
     */
    vibrateLong(options: UniNamespace.VibrateLongOptions): void;
    /**
     * 使手机发生较短时间的振动（15ms）
     *
     * 文档: [http://uniapp.dcloud.io/api/system/vibrate?id=vibrateshort](http://uniapp.dcloud.io/api/system/vibrate?id=vibrateshort)
     */
    vibrateShort(options: UniNamespace.VibrateShortOptions): void;
    /**
     * 手机通讯录联系人和联系方式的增加
     *
     * 文档: [http://uniapp.dcloud.io/api/system/contact?id=addphonecontact](http://uniapp.dcloud.io/api/system/contact?id=addphonecontact)
     */
    addPhoneContact(options: UniNamespace.AddPhoneContactOptions): void;
    /**
     * 获取已搜索到的iBeacon设备
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ibeacon?id=getbeacons](http://uniapp.dcloud.io/api/system/ibeacon?id=getbeacons)
     */
    getBeacons(options: UniNamespace.GetBeaconsOptions): void;
    /**
     * 开始搜索附近的iBeacon设备
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ibeacon?id=startbeacondiscovery](http://uniapp.dcloud.io/api/system/ibeacon?id=startbeacondiscovery)
     */
    startBeaconDiscovery(options: UniNamespace.StartBeaconDiscoveryOptions): void;
    /**
     * 停止搜索附近的iBeacon设备
     *
     * 文档: [http://uniapp.dcloud.io//api/system/ibeacon?id=stopbeacondiscovery](http://uniapp.dcloud.io//api/system/ibeacon?id=stopbeacondiscovery)
     */
    stopBeaconDiscovery(options: UniNamespace.StopBeaconDiscoveryOptions): void;
    /**
     * 监听iBeacon设备更新
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ibeacon?id=onbeaconupdate](http://uniapp.dcloud.io/api/system/ibeacon?id=onbeaconupdate)
     */
    onBeaconUpdate(callback: (result: UniNamespace.GetBeaconsRes) => void): void;
    /**
     * 监听iBeacon服务状态变化
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ibeacon?id=onbeaconservicechange](http://uniapp.dcloud.io/api/system/ibeacon?id=onbeaconservicechange)
     */
    onBeaconServiceChange(callback: (result: UniNamespace.BeaconService) => void): void;
    /**
     * 关闭蓝牙模块
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=closebluetoothadapter](http://uniapp.dcloud.io/api/system/bluetooth?id=closebluetoothadapter)
     */
    closeBluetoothAdapter(options: UniNamespace.CloseBluetoothAdapterOptions): void;
    /**
     * 获取本机蓝牙适配器状态
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=getbluetoothadapterstate](http://uniapp.dcloud.io/api/system/bluetooth?id=getbluetoothadapterstate)
     */
    getBluetoothAdapterState(options: UniNamespace.GetBluetoothAdapterStateOptions): void;
    /**
     * 获取已搜索到的蓝牙设备
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=getbluetoothdevices](http://uniapp.dcloud.io/api/system/bluetooth?id=getbluetoothdevices)
     */
    getBluetoothDevices(options: UniNamespace.GetBluetoothDevicesOptions): void;
    /**
     * 根据uuid获取处于已连接的设备
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=getconnectedbluetoothdevices](http://uniapp.dcloud.io/api/system/bluetooth?id=getconnectedbluetoothdevices)
     */
    getConnectedBluetoothDevices(options: UniNamespace.GetConnectedBluetoothDevicesOptions): void;
    /**
     * 监听蓝牙适配器状态变化事件
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=onbluetoothadapterstatechange](http://uniapp.dcloud.io/api/system/bluetooth?id=onbluetoothadapterstatechange)
     */
    onBluetoothAdapterStateChange(callback: (result: UniNamespace.OnBluetoothAdapterStateChangeResult) => void): void;
    /**
     * 监听搜索到新设备的事件
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=onbluetoothdevicefound](http://uniapp.dcloud.io/api/system/bluetooth?id=onbluetoothdevicefound)
     */
    onBluetoothDeviceFound(callback: (result: UniNamespace.OnBluetoothDeviceFoundResult) => void): void;
    /**
     * 初始化蓝牙模块
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=openbluetoothadapter](http://uniapp.dcloud.io/api/system/bluetooth?id=openbluetoothadapter)
     */
    openBluetoothAdapter(options: UniNamespace.OpenBluetoothAdapterOptions): void;
    /**
     * 开始搜索附近的蓝牙设备
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=startbluetoothdevicesdiscovery](http://uniapp.dcloud.io/api/system/bluetooth?id=startbluetoothdevicesdiscovery)
     */
    startBluetoothDevicesDiscovery(options: UniNamespace.StartBluetoothDevicesDiscoveryOptions): void;
    /**
     * 停止搜寻附近的蓝牙外围设备
     *
     * 文档: [http://uniapp.dcloud.io/api/system/bluetooth?id=stopbluetoothdevicesdiscovery](http://uniapp.dcloud.io/api/system/bluetooth?id=stopbluetoothdevicesdiscovery)
     */
    stopBluetoothDevicesDiscovery(options: UniNamespace.StopBluetoothDevicesDiscoveryOptions): void;
    /**
     * 断开与低功耗蓝牙设备的连接
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=closebleconnection](http://uniapp.dcloud.io/api/system/ble?id=closebleconnection)
     */
    closeBLEConnection(options: UniNamespace.CloseBLEConnectionOptions): void;
    /**
     * 连接低功耗蓝牙设备
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=createbleconnection](http://uniapp.dcloud.io/api/system/ble?id=createbleconnection)
     */
    createBLEConnection(options: UniNamespace.CreateBLEConnectionOptions): void;
    /**
     * 获取蓝牙设备指定服务中所有特征值
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=getbledevicecharacteristics](http://uniapp.dcloud.io/api/system/ble?id=getbledevicecharacteristics)
     */
    getBLEDeviceCharacteristics(options: UniNamespace.GetBLEDeviceCharacteristicsOptions): void;
    /**
     * 获取蓝牙设备的所有服务
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=getbledeviceservices](http://uniapp.dcloud.io/api/system/ble?id=getbledeviceservices)
     */
    getBLEDeviceServices(options: UniNamespace.GetBLEDeviceServicesOptions): void;
    /**
     * 启用低功耗蓝牙设备特征值变化时的notify功能，订阅特征值
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=notifyblecharacteristicvaluechange](http://uniapp.dcloud.io/api/system/ble?id=notifyblecharacteristicvaluechange)
     */
    notifyBLECharacteristicValueChange(options: UniNamespace.NotifyBLECharacteristicValueChangeOptions): void;
    /**
     * 监听低功耗蓝牙设备的特征值变化事件
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=onblecharacteristicvaluechange](http://uniapp.dcloud.io/api/system/ble?id=onblecharacteristicvaluechange)
     */
    onBLECharacteristicValueChange(callback: (result: UniNamespace.OnBLECharacteristicValueChangeSuccess) => void): void;
    /**
     * 监听低功耗蓝牙设备连接状态变化事件
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=onbleconnectionstatechange](http://uniapp.dcloud.io/api/system/ble?id=onbleconnectionstatechange)
     */
    onBLEConnectionStateChange(callback: (result: UniNamespace.OnBLEConnectionStateChangeSuccess) => void): void;
    /**
     * 读取低功耗蓝牙设备指定特征值的二进制数据值
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=readblecharacteristicvalue](http://uniapp.dcloud.io/api/system/ble?id=readblecharacteristicvalue)
     */
    readBLECharacteristicValue(options: UniNamespace.ReadBLECharacteristicValueOptions): void;
    /**
     * 向低功耗蓝牙设备指定特征值写入二进制数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=writeblecharacteristicvalue](http://uniapp.dcloud.io/api/system/ble?id=writeblecharacteristicvalue)
     */
    writeBLECharacteristicValue(options: UniNamespace.WriteBLECharacteristicValueOptions): void;
    /**
     * 设置蓝牙最大传输单元。需在 uni.createBLEConnection调用成功后调用，mtu 设置范围 (22,512)。安卓5.1以上有效。
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=setBLEMTU](http://uniapp.dcloud.io/api/system/ble?id=setBLEMTU)
     */
    setBLEMTU(options: UniNamespace.SetBLEMTUOptions): void;
    /**
     * 获取蓝牙设备的信号强度。
     *
     * 文档: [http://uniapp.dcloud.io/api/system/ble?id=getBLEDeviceRSSI](http://uniapp.dcloud.io/api/system/ble?id=getBLEDeviceRSSI)
     */
    getBLEDeviceRSSI(options: UniNamespace.GetBLEDeviceRSSIOptions): void;
    /**
     * 显示消息提示框
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/prompt?id=showtoast](http://uniapp.dcloud.io/api/ui/prompt?id=showtoast)
     * @example ```typescript
     *    uni.showToast({
     *        title: '标题',
     *        duration: 2000
     *    });
     * ```
     * @tutorial [](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showtoast)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    showToast(options: UniNamespace.ShowToastOptions): void;
    /**
     * 显示 loading 提示框
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/prompt?id=showloading](http://uniapp.dcloud.io/api/ui/prompt?id=showloading)
     * @example ```typescript
     * uni.showLoading({
     * 	title: '加载中'
     * });
     * ```
     * @tutorial [](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showloading)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    showLoading(options: UniNamespace.ShowLoadingOptions): void;
    /**
     * 隐藏消息提示框
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/prompt?id=hidetoast](http://uniapp.dcloud.io/api/ui/prompt?id=hidetoast)
     * @example ```typescript
     *    uni.hideToast();
     * ```
     * @tutorial [](https://uniapp.dcloud.net.cn/api/ui/prompt.html#hidetoast)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    hideToast(): void;
    /**
     * 隐藏 loading 提示框
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/prompt?id=hideloading](http://uniapp.dcloud.io/api/ui/prompt?id=hideloading)
     * @example ```typescript
     * uni.showLoading({
     * 	title: '加载中'
     * });
     *
     * setTimeout(function () {
     * 	uni.hideLoading();
     * }, 2000);
     *
     * ```
     * @tutorial [](https://uniapp.dcloud.net.cn/api/ui/prompt.html#hideloading)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    hideLoading(): void;
    /**
     * 显示模态弹窗
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/prompt?id=showmodal](http://uniapp.dcloud.io/api/ui/prompt?id=showmodal)
     * @example ```typescript
     * uni.showModal({
     * 	title: '提示',
     * 	content: '这是一个模态弹窗',
     * 	success: function (res) {
     * 		if (res.confirm) {
     * 			console.log('用户点击确定');
     * 		} else if (res.cancel) {
     * 			console.log('用户点击取消');
     * 		}
     * 	}
     * });
     * ```
     * @tutorial [](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showmodal)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    showModal(options: UniNamespace.ShowModalOptions): Promise<UniNamespace.ShowModalRes>;
    /**
     * 显示操作菜单
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/prompt?id=showactionsheet](http://uniapp.dcloud.io/api/ui/prompt?id=showactionsheet)
     * @example ```typescript
     * uni.showActionSheet({
     * 	itemList: ['A', 'B', 'C'],
     * 	success: function (res) {
     * 		console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
     * 	},
     * 	fail: function (res) {
     * 		console.log(res.errMsg);
     * 	}
     * });
     * ```
     * @tutorial [](https://uniapp.dcloud.net.cn/api/ui/prompt.html#showactionsheet)
     * @uniPlatform {
     * "app": {
     * "android": {
     * "osVer": "4.4.4",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * },
     * "ios": {
     * "osVer": "9.0",
     * "uniVer": "√",
     * "unixVer": "3.9.0"
     * }
     * }
     * }
     */
    showActionSheet(options: UniNamespace.ShowActionSheetOptions): void;
    /**
     * 动态设置当前页面的标题
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbartitle](http://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbartitle)
     */
    setNavigationBarTitle(options: UniNamespace.SetNavigationBarTitleOptions): void;
    /**
     * 在当前页面显示导航条加载动画
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/navigationbar?id=shownavigationbarloading](http://uniapp.dcloud.io/api/ui/navigationbar?id=shownavigationbarloading)
     */
    showNavigationBarLoading(): void;
    /**
     * 隐藏导航条加载动画
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/navigationbar?id=hidenavigationbarloading](http://uniapp.dcloud.io/api/ui/navigationbar?id=hidenavigationbarloading)
     */
    hideNavigationBarLoading(): void;
    /**
     * 隐藏返回首页按钮
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/navigationbar?id=hidehomebutton](http://uniapp.dcloud.io/api/ui/navigationbar?id=hidehomebutton)
     */
    hideHomeButton(): void;
    /**
     * 设置导航条颜色
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbarcolor](http://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbarcolor)
     */
    setNavigationBarColor(options: UniNamespace.SetNavigationbarColorOptions): void;
    /**
     * 动态设置 tabBar 某一项的内容
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=settabbaritem](http://uniapp.dcloud.io/api/ui/tabbar?id=settabbaritem)
     */
    setTabBarItem(options: UniNamespace.SetTabBarItemOptions): void;
    /**
     * 动态设置 tabBar 的整体样式
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=settabbarstyle](http://uniapp.dcloud.io/api/ui/tabbar?id=settabbarstyle)
     */
    setTabBarStyle(options: UniNamespace.SetTabBarStyleOptions): void;
    /**
     * 隐藏 tabBar
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=hidetabbar](http://uniapp.dcloud.io/api/ui/tabbar?id=hidetabbar)
     */
    hideTabBar(options?: UniNamespace.HideTabBarOptions): void;
    /**
     * 显示 tabBar
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=showtabbar](http://uniapp.dcloud.io/api/ui/tabbar?id=showtabbar)
     */
    showTabBar(options?: UniNamespace.ShowTabBarOptions): void;
    /**
     * 为 tabBar 某一项的右上角添加文本
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=settabbarbadge](http://uniapp.dcloud.io/api/ui/tabbar?id=settabbarbadge)
     */
    setTabBarBadge(options: UniNamespace.SetTabBarBadgeOptions): void;
    /**
     * 移除 tabBar 某一项右上角的文本
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=removetabbarbadge](http://uniapp.dcloud.io/api/ui/tabbar?id=removetabbarbadge)
     */
    removeTabBarBadge(options: UniNamespace.RemoveTabBarBadgeOptions): void;
    /**
     * 显示 tabBar 某一项的右上角的红点
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=showtabbarreddot](http://uniapp.dcloud.io/api/ui/tabbar?id=showtabbarreddot)
     */
    showTabBarRedDot(options: UniNamespace.ShowTabBarRedDotOptions): void;
    /**
     * 隐藏 tabBar 某一项的右上角的红点
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=hidetabbarreddot](http://uniapp.dcloud.io/api/ui/tabbar?id=hidetabbarreddot)
     */
    hideTabBarRedDot(options: UniNamespace.HideTabBarRedDotOptions): void;
    /**
     * 监听中间按钮的点击事件
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/tabbar?id=ontabbarmidbuttontap](http://uniapp.dcloud.io/api/ui/tabbar?id=ontabbarmidbuttontap)
     */
    onTabBarMidButtonTap(callback: (result: any) => void): void;
    /**
     * 保留当前页面，跳转到应用内的某个页面
     *
     * 文档: [http://uniapp.dcloud.io/api/router?id=navigateto](http://uniapp.dcloud.io/api/router?id=navigateto)
     */
    navigateTo(options: UniNamespace.NavigateToOptions): Promise<UniNamespace.NavigateToSuccessOptions>;
    /**
     * 关闭当前页面，跳转到应用内的某个页面
     *
     * 文档: [http://uniapp.dcloud.io/api/router?id=redirectto](http://uniapp.dcloud.io/api/router?id=redirectto)
     */
    redirectTo(options: UniNamespace.RedirectToOptions): void;
    /**
     * 关闭所有页面，打开到应用内的某个页面
     *
     * 文档: [http://uniapp.dcloud.io/api/router?id=relaunch](http://uniapp.dcloud.io/api/router?id=relaunch)
     */
    reLaunch(options: UniNamespace.ReLaunchOptions): Promise<any>;
    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     *
     * 文档: [http://uniapp.dcloud.io/api/router?id=switchtab](http://uniapp.dcloud.io/api/router?id=switchtab)
     */
    switchTab(options: UniNamespace.SwitchTabOptions): Promise<any>;
    /**
     * 关闭当前页面，返回上一页面或多级页面
     *
     * 文档: [http://uniapp.dcloud.io/api/router?id=navigateback](http://uniapp.dcloud.io/api/router?id=navigateback)
     */
    navigateBack(options?: UniNamespace.NavigateBackOptions): Promise<any>;
    /**
     * 预加载页面
     *
     * 文档: [http://uniapp.dcloud.io/api/preload-page?id=preloadpage](http://uniapp.dcloud.io/api/preload-page?id=preloadpage)
     */
    preloadPage(options: UniNamespace.PreloadPageOptions): void;
    /**
     * 取消页面预加载
     *
     * 文档: [http://uniapp.dcloud.io/api/preload-page?id=unpreloadpage](http://uniapp.dcloud.io/api/preload-page?id=unpreloadpage)
     */
    unPreloadPage(options: UniNamespace.UnPreloadPageOptions): void;
    /**
     * 创建一个动画实例
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/animation?id=createanimation](http://uniapp.dcloud.io/api/ui/animation?id=createanimation)
     */
    createAnimation(options?: UniNamespace.CreateAnimationOptions): UniNamespace.Animation;
    /**
     * 将页面滚动到目标位置
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/scroll?id=pagescrollto](http://uniapp.dcloud.io/api/ui/scroll?id=pagescrollto)
     */
    pageScrollTo(options: UniNamespace.PageScrollToOptions): void;
    /**
     * 开始下拉刷新
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/pulldown?id=startpulldownrefresh](http://uniapp.dcloud.io/api/ui/pulldown?id=startpulldownrefresh)
     */
    startPullDownRefresh(options: UniNamespace.StartPullDownRefreshOptions): void;
    /**
     * 停止当前页面下拉刷新
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/pulldown?id=stoppulldownrefresh](http://uniapp.dcloud.io/api/ui/pulldown?id=stoppulldownrefresh)
     */
    stopPullDownRefresh(): void;
    /**
     * 返回一个SelectorQuery对象实例
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/nodes-info?id=createselectorquery](http://uniapp.dcloud.io/api/ui/nodes-info?id=createselectorquery)
     */
    createSelectorQuery(): UniNamespace.SelectorQuery;
    /**
     * 创建并返回一个 IntersectionObserver 对象实例
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/intersection-observer?id=createintersectionobserver](http://uniapp.dcloud.io/api/ui/intersection-observer?id=createintersectionobserver)
     */
    createIntersectionObserver(component: any, options?: UniNamespace.CreateIntersectionObserverOptions): UniNamespace.IntersectionObserver;
    /**
     * 创建并返回一个 MediaQueryObserver 对象实例。context: 自定义组件实例。小程序端不支持此参数，传入仅为抹平写法差异
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/media-query-observer?id=createmediaqueryobserver](http://uniapp.dcloud.io/api/ui/media-query-observer?id=createmediaqueryobserver)
     */
    createMediaQueryObserver(context?: any): UniNamespace.MediaQueryObserver;
    /**
     * 获取本次启动时的参数。返回值与App.onLaunch的回调参数一致
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/getLaunchOptionsSync](http://uniapp.dcloud.io/api/plugins/getLaunchOptionsSync)
     */
    getLaunchOptionsSync(): UniNamespace.GetLaunchOptionsSyncOptions;
    /**
     * 获取本次启动时的参数。返回值与App.onLaunch的回调参数一致
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/getEnterOptionsSync](http://uniapp.dcloud.io/api/plugins/getEnterOptionsSync)
     */
    getEnterOptionsSync(): UniNamespace.GetLaunchOptionsSyncOptions;
    /**
     * 创建 canvas 绘图上下文
     *
     * 文档: [http://uniapp.dcloud.io/api/canvas/createCanvasContext?id=createcanvascontext](http://uniapp.dcloud.io/api/canvas/createCanvasContext?id=createcanvascontext)
     */
    createCanvasContext(canvasId: string, componentInstance?: any): UniNamespace.CanvasContext;
    /**
     * 把当前画布指定区域的内容导出生成指定大小的图片
     *
     * 文档: [http://uniapp.dcloud.io/api/canvas/canvasToTempFilePath?id=canvastotempfilepath](http://uniapp.dcloud.io/api/canvas/canvasToTempFilePath?id=canvastotempfilepath)
     */
    canvasToTempFilePath(options: UniNamespace.CanvasToTempFilePathOptions, componentInstance?: any): void;
    /**
     * 描述 canvas 区域隐含的像素数据
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/canvas?id=canvasgetimagedata](http://uniapp.dcloud.io/api/ui/canvas?id=canvasgetimagedata)
     */
    canvasGetImageData(options: UniNamespace.CanvasGetImageDataOptions, componentInstance?: any): void;
    /**
     * 将像素数据绘制到画布
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/canvas?id=canvasputimagedata](http://uniapp.dcloud.io/api/ui/canvas?id=canvasputimagedata)
     */
    canvasPutImageData(options: UniNamespace.CanvasPutImageDataOptions, componentInstance?: any): void;
    /**
     * 监听窗口尺寸变化事件
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/window?id=onwindowresize](http://uniapp.dcloud.io/api/ui/window?id=onwindowresize)
     */
    onWindowResize(callback: (result: UniNamespace.WindowResizeResult) => void): void;
    /**
     * 取消监听窗口尺寸变化事件
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/window?id=offwindowresize](http://uniapp.dcloud.io/api/ui/window?id=offwindowresize)
     */
    offWindowResize(callback: (result: any) => void): void;
    /**
     * 显示 topWindow 窗体
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=showTopWindow](http://uniapp.dcloud.io/api/ui/adapt?id=showTopWindow)
     */
    showTopWindow(options: UniNamespace.CommonOptions): void;
    /**
     * 隐藏 topWindow 窗体
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=hideTopWindow](http://uniapp.dcloud.io/api/ui/adapt?id=hideTopWindow)
     */
    hideTopWindow(options: UniNamespace.CommonOptions): void;
    /**
     * 显示 leftWindow 窗体
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=showLeftWindow](http://uniapp.dcloud.io/api/ui/adapt?id=showLeftWindow)
     */
    showLeftWindow(options: UniNamespace.CommonOptions): void;
    /**
     * 隐藏 leftWindow 窗体
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=hideLeftWindow](http://uniapp.dcloud.io/api/ui/adapt?id=hideLeftWindow)
     */
    hideLeftWindow(options: UniNamespace.CommonOptions): void;
    /**
     * 显示 rightWindow 窗体
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=showRightWindow](http://uniapp.dcloud.io/api/ui/adapt?id=showRightWindow)
     */
    showRightWindow(options: UniNamespace.CommonOptions): void;
    /**
     * 隐藏 rightWindow 窗体
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=hideRightWindow](http://uniapp.dcloud.io/api/ui/adapt?id=hideRightWindow)
     */
    hideRightWindow(options: UniNamespace.CommonOptions): void;
    /**
     * 获取leftWindow窗体样式
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=getLeftWindowStyle](http://uniapp.dcloud.io/api/ui/adapt?id=getLeftWindowStyle)
     */
    getLeftWindowStyle(): any;
    /**
     * 获取rightWindow窗体样式
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=getRightWindowStyle](http://uniapp.dcloud.io/api/ui/adapt?id=getRightWindowStyle)
     */
    getRightWindowStyle(): any;
    /**
     * 获取topWindow窗体样式
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=getTopWindowStyle](http://uniapp.dcloud.io/api/ui/adapt?id=getTopWindowStyle)
     */
    getTopWindowStyle(): any;
    /**
     * 设置leftWindow窗体样式
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=setLeftWindowStyle](http://uniapp.dcloud.io/api/ui/adapt?id=setLeftWindowStyle)
     */
    setLeftWindowStyle(options: Partial<CSSStyleDeclaration> | string.CSSURIString): void;
    /**
     * 设置rightWindow窗体样式
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=setRightWindowStyle](http://uniapp.dcloud.io/api/ui/adapt?id=setRightWindowStyle)
     */
    setRightWindowStyle(options: Partial<CSSStyleDeclaration> | string.CSSURIString): void;
    /**
     * 设置topWindow窗体样式
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/adapt?id=setTopWindowStyle](http://uniapp.dcloud.io/api/ui/adapt?id=setTopWindowStyle)
     */
    setTopWindowStyle(options: Partial<CSSStyleDeclaration> | string.CSSURIString): void;
    /**
     * 获取服务供应商
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/provider?id=getprovider](http://uniapp.dcloud.io/api/plugins/provider?id=getprovider)
     */
    getProvider(options: UniNamespace.GetProviderOptions): Promise<UniNamespace.GetProviderRes>;
    /**
     * 登录
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=login](http://uniapp.dcloud.io/api/plugins/login?id=login)
     */
    login(options: UniNamespace.LoginOptions): Promise<UniNamespace.LoginRes>;
    /**
     * 登录
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=unichecksession](http://uniapp.dcloud.io/api/plugins/login?id=unichecksession)
     */
    checkSession(options: UniNamespace.CheckSessionOptions): void;
    /**
     * 获取用户信息
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=getuserinfo](http://uniapp.dcloud.io/api/plugins/login?id=getuserinfo)
     */
    getUserInfo(options: UniNamespace.GetUserInfoOptions): void;
    /**
     * 获取用户信息
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=getUserProfile](http://uniapp.dcloud.io/api/plugins/login?id=getUserProfile)
     */
    getUserProfile(options: UniNamespace.GetUserProfileOptions): void;
    /**
     * 预登录
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=prelogin](http://uniapp.dcloud.io/api/plugins/login?id=prelogin)
     */
    preLogin(options: UniNamespace.PreLoginOptions): void;
    /**
     * 关闭一键登陆页面
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=closeauthview](http://uniapp.dcloud.io/api/plugins/login?id=closeauthview)
     */
    closeAuthView(): void;
    /**
     * 获取一键登录条款勾选框状态
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=getCheckBoxState](http://uniapp.dcloud.io/api/plugins/login?id=getCheckBoxState)
     */
    getCheckBoxState(options: UniNamespace.GetCheckBoxStateOptions): void;
    /**
     * 获取全局唯一的一键登录管理器 UniverifyManager
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/login?id=getUniverifyManager](http://uniapp.dcloud.io/api/plugins/login?id=getUniverifyManager)
     */
    getUniverifyManager(): UniNamespace.UniverifyManager;
    /**
     * 分享
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/share?id=share](http://uniapp.dcloud.io/api/plugins/share?id=share)
     */
    share(options: UniNamespace.ShareOptions): void;
    /**
     * 调用系统分享
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/share?id=sharewithsystem](http://uniapp.dcloud.io/api/plugins/share?id=sharewithsystem)
     */
    shareWithSystem(options: UniNamespace.ShareWithSystemOptions): void;
    /**
     * 创建本地通知栏消息
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/push.html#createpushmessage](http://uniapp.dcloud.io/api/plugins/push.html#createpushmessage)
     */
    createPushMessage(options: UniNamespace.CreatePushMessageOptions): void;
    /**
     * 获取通知渠道管理器，Android 8系统以上才可以设置通知渠道，Android 8系统以下返回null。
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/push.html#getChannelManager](http://uniapp.dcloud.io/api/plugins/push.html#getChannelManager)
     */
    getChannelManager(): UniNamespace.ChannelManager;
    /**
     * 获取客户端唯一的推送标识
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/push.html#getpushclientid](http://uniapp.dcloud.io/api/plugins/push.html#getpushclientid)
     */
    getPushClientId(options: UniNamespace.GetPushClientIdOptions): void;
    /**
     * 启动监听推送消息事件
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/push.html#onpushmessage](http://uniapp.dcloud.io/api/plugins/push.html#onpushmessage)
     */
    onPushMessage(callback?: (result: UniNamespace.OnPushMessageCallbackOptions) => void): void;
    /**
     * 关闭推送消息监听事件
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/push.html#offpushmessage](http://uniapp.dcloud.io/api/plugins/push.html#offpushmessage)
     */
    offPushMessage(callback?: (result: any) => void): void;
    /**
     * 支付
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/payment?id=requestpayment](http://uniapp.dcloud.io/api/plugins/payment?id=requestpayment)
     */
    requestPayment(options: UniNamespace.RequestPaymentOptions): Promise<{
        errMsg: "requestPayment:fail cancel" | "requestPayment:ok";
    }>;
    /**
     * 提前向用户发起授权请求
     *
     * 文档: [http://uniapp.dcloud.io/api/other/authorize?id=authorize](http://uniapp.dcloud.io/api/other/authorize?id=authorize)
     */
    authorize(options: UniNamespace.AuthorizeOptions): void;
    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果
     *
     * 文档: [http://uniapp.dcloud.io/api/other/authorize?id=opensetting](http://uniapp.dcloud.io/api/other/authorize?id=opensetting)
     */
    openSetting(options?: UniNamespace.OpenSettingOptions): void;
    /**
     * 获取用户的当前设置
     *
     * 文档: [http://uniapp.dcloud.io/api/other/setting?id=getsetting](http://uniapp.dcloud.io/api/other/setting?id=getsetting)
     */
    getSetting(options: UniNamespace.GetSettingOptions): void;
    /**
     * 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址，需要用户授权 scope.address
     *
     * 文档: [http://uniapp.dcloud.io/api/other/choose-address?id=chooseaddress](http://uniapp.dcloud.io/api/other/choose-address?id=chooseaddress)
     */
    chooseAddress(options: UniNamespace.ChooseAddressOptions): void;
    /**
     * 选择用户的发票抬头，需要用户授权 scope.invoiceTitle
     *
     * 文档: [http://uniapp.dcloud.io/api/other/invoice-title?id=chooseinvoicetitle](http://uniapp.dcloud.io/api/other/invoice-title?id=chooseinvoicetitle)
     */
    chooseInvoiceTitle(options: UniNamespace.ChooseInvoiceTitleOptions): void;
    /**
     *
     * 需要基础库： `2.10.0`
     *
     * 在插件中使用：需要基础库 `2.11.1`
     *
     * 拍摄或从手机相册中选择图片或视频。
     *
     *
     * 文档: [https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseMedia.html)
     */
    chooseMedia(option: UniNamespace.ChooseMediaOption): Promise<UniNamespace.ChooseMediaSuccessCallbackResult>;
    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果
     *
     * 文档: [http://uniapp.dcloud.io/api/other/open-miniprogram?id=navigatetominiprogram](http://uniapp.dcloud.io/api/other/open-miniprogram?id=navigatetominiprogram)
     */
    navigateToMiniProgram(options: UniNamespace.NavigateToMiniProgramOptions): void;
    /**
     * 跳转回上一个小程序，只有当另一个小程序跳转到当前小程序时才会能调用成功
     *
     * 文档: [http://uniapp.dcloud.io/api/other/open-miniprogram?id=navigatebackminiprogram](http://uniapp.dcloud.io/api/other/open-miniprogram?id=navigatebackminiprogram)
     */
    navigateBackMiniProgram(options: UniNamespace.NavigateBackMiniProgramOptions): void;
    /**
     * 返回全局唯一的版本更新管理器对象： updateManager，用于管理小程序更新
     *
     * 文档: [http://uniapp.dcloud.io/api/other/update?id=getupdatemanager](http://uniapp.dcloud.io/api/other/update?id=getupdatemanager)
     */
    getUpdateManager(): UniNamespace.UpdateManager;
    /**
     * 设置是否打开调试开关。此开关对正式版也能生效
     *
     * 文档: [http://uniapp.dcloud.io/api/other/set-enable-debug?id=setenabledebug](http://uniapp.dcloud.io/api/other/set-enable-debug?id=setenabledebug)
     */
    setEnableDebug(options: UniNamespace.SetEnableDebugOptions): void;
    /**
     * 获取第三方平台自定义的数据字段
     *
     * 文档: [http://uniapp.dcloud.io/api/other/get-extconfig?id=getextconfig](http://uniapp.dcloud.io/api/other/get-extconfig?id=getextconfig)
     */
    getExtConfig(options: UniNamespace.GetExtConfigOptions): void;
    /**
     * uni.getExtConfig() 的同步版本
     *
     * 文档: [http://uniapp.dcloud.io/api/other/get-extconfig?id=getextconfigsync](http://uniapp.dcloud.io/api/other/get-extconfig?id=getextconfigsync)
     */
    getExtConfigSync(): any;
    /**
     * 显示分享按钮
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/share?id=showsharemenu](http://uniapp.dcloud.io/api/plugins/share?id=showsharemenu)
     */
    showShareMenu(options: UniNamespace.ShowShareMenuOptions): void;
    /**
     * 隐藏分享按钮
     *
     * 文档: [http://uniapp.dcloud.io/api/plugins/share?id=hidesharemenu](http://uniapp.dcloud.io/api/plugins/share?id=hidesharemenu)
     */
    hideShareMenu(options: UniNamespace.HideShareMenuOptions): void;
    /**
     * 动态设置窗口的背景色
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/bgcolor?id=setbackgroundcolor](http://uniapp.dcloud.io/api/ui/bgcolor?id=setbackgroundcolor)
     */
    setBackgroundColor(options: UniNamespace.SetBackgroundColorOptions): void;
    /**
     * 动态设置窗口的背景色
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/bgcolor?id=setbackgroundtextstyle](http://uniapp.dcloud.io/api/ui/bgcolor?id=setbackgroundtextstyle)
     */
    setBackgroundTextStyle(options: UniNamespace.SetBackgroundTextStyleOptions): void;
    /**
     * 动态设置页面根节点样式和字体大小
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/setpagemeta](http://uniapp.dcloud.io/api/ui/setpagemeta)
     */
    setPageMeta(options: UniNamespace.StatusBarStyle): void;
    /**
     * 监听陀螺仪数据变化事件
     *
     * 文档: [http://uniapp.dcloud.io/api/system/gyroscope?id=ongyroscopechange](http://uniapp.dcloud.io/api/system/gyroscope?id=ongyroscopechange)
     */
    onGyroscopeChange(callback: (result: UniNamespace.OnGyroscopeChangeSuccess) => void): void;
    /**
     * 开始监听陀螺仪数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/gyroscope?id=startgyroscope](http://uniapp.dcloud.io/api/system/gyroscope?id=startgyroscope)
     */
    startGyroscope(options: UniNamespace.StartGyroscopeOptions): void;
    /**
     * 停止监听陀螺仪数据
     *
     * 文档: [http://uniapp.dcloud.io/api/system/gyroscope?id=stopgyroscope](http://uniapp.dcloud.io/api/system/gyroscope?id=stopgyroscope)
     */
    stopGyroscope(options: UniNamespace.StopGyroscopeOptions): void;
    /**
     * 动态加载网络字体
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/font?id=loadfontface](http://uniapp.dcloud.io/api/ui/font?id=loadfontface)
     */
    loadFontFace(options: UniNamespace.LoadFontFaceOptions): void;
    /**
     * 获取小程序下该菜单按钮的布局位置信息
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/menuButton?id=getmenubuttonboundingclientrect](http://uniapp.dcloud.io/api/ui/menuButton?id=getmenubuttonboundingclientrect)
     */
    getMenuButtonBoundingClientRect(): UniNamespace.GetMenuButtonBoundingClientRectRes;
    /**
     * 开始 SOTER 生物认证
     *
     * 文档: [http://uniapp.dcloud.io/api/system/authentication?id=startsoterauthentication](http://uniapp.dcloud.io/api/system/authentication?id=startsoterauthentication)
     */
    startSoterAuthentication(options: UniNamespace.StartSoterAuthenticationOptions): void;
    /**
     * 获取本机支持的 SOTER 生物认证方式
     *
     * 文档: [http://uniapp.dcloud.io/api/system/authentication?id=checkissupportsoterauthentication](http://uniapp.dcloud.io/api/system/authentication?id=checkissupportsoterauthentication)
     */
    checkIsSupportSoterAuthentication(options: UniNamespace.CheckIsSupportSoterAuthenticationOptions): void;
    /**
     * 获取设备内是否录入如指纹等生物信息
     *
     * 文档: [http://uniapp.dcloud.io/api/system/authentication?id=checkissoterenrolledindevice](http://uniapp.dcloud.io/api/system/authentication?id=checkissoterenrolledindevice)
     */
    checkIsSoterEnrolledInDevice(options: UniNamespace.CheckIsSoterEnrolledInDeviceOptions): void;
    /**
     * 创建激励视频广告组件
     *
     * 文档: [http://uniapp.dcloud.io/api/a-d/rewarded-video](http://uniapp.dcloud.io/api/a-d/rewarded-video)
     */
    createRewardedVideoAd(options: UniNamespace.RewardedVideoAdOptions): UniNamespace.RewardedVideoAdContext;
    /**
     * 创建全屏视频广告组件
     *
     * 文档: [http://uniapp.dcloud.io/api/a-d/full-screen-video](http://uniapp.dcloud.io/api/a-d/full-screen-video)
     */
    createFullScreenVideoAd(options: UniNamespace.FullScreenVideoAdOptions): UniNamespace.FullScreenVideoAdContext;
    /**
     * 创建插屏广告组件
     *
     * 文档: [http://uniapp.dcloud.io/api/a-d/interstitial](http://uniapp.dcloud.io/api/a-d/interstitial)
     */
    createInterstitialAd(options: UniNamespace.InterstitialAdOptions): UniNamespace.InterstitialAdContext;
    /**
     * 创建互动广告组件
     *
     * 文档: [http://uniapp.dcloud.io/api/a-d/interactive](http://uniapp.dcloud.io/api/a-d/interactive)
     */
    createInteractiveAd(options: UniNamespace.InteractiveAdOptions): UniNamespace.InteractiveAdContext;
    /**
     * 添加拦截器
     *
     * 文档: [http://uniapp.dcloud.io/api/interceptor](http://uniapp.dcloud.io/api/interceptor)
     */
    addInterceptor(name: string, options: UniNamespace.InterceptorOptions): void;
    addInterceptor(options: UniNamespace.InterceptorOptions): void;
    /**
     * 删除拦截器
     *
     * 文档: [http://uniapp.dcloud.io/api/interceptor](http://uniapp.dcloud.io/api/interceptor)
     */
    removeInterceptor(name: string): void;
    /**
     * 获取当前设置的语言
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/language?id=getlocale](http://uniapp.dcloud.io/api/ui/language?id=getlocale)
     */
    getLocale(): string;
    /**
     * 设置当前语言
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/language?id=setlocale](http://uniapp.dcloud.io/api/ui/language?id=setlocale)
     */
    setLocale(locale: string): void;
    /**
     * 设置当前语言
     *
     * 文档: [http://uniapp.dcloud.io/api/ui/language?id=setlocale](http://uniapp.dcloud.io/api/ui/language?id=setlocale)
     */
    onLocaleChange(callback: (result: UniNamespace.OnLocaleChangeCallbackResult) => void): void;
}

type UniInterface = Uni;
// import UniApp = UniNamespace;
