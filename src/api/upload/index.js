import { apiClient, fetcher } from '../apiClient';

export const UPLOAD_NETWORK_ERROR = "NetWorkError"

class UploadService {
    uploadWithProgress = async (file, { onProgress, directory }) => {
        const formData = new FormData()
        formData.append("file", file)
        console.log("file",file)
        console.log("formData",formData)
        if (directory) {
            formData.append("directory", directory)
        }

        let startTime = Date.now()

        try {
            const response = await apiClient.post("/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: progressEvent => {
                    if (progressEvent.total) {
                        const progress = Number(
                            ((progressEvent.loaded / progressEvent.total) * 100).toFixed(1)
                        )
                        const speedInByte =
                            progressEvent.loaded / ((Date.now() - startTime) / 1000)

                        onProgress?.("uploading", {
                            // if the progress is 100, it means the file is uploaded
                            // but the server is still processing it
                            // so make it as 99.9 and let users think it's still uploading
                            progress: progress === 100 ? 99.9 : progress,
                            restTime:
                                (progressEvent.total - progressEvent.loaded) / speedInByte,
                            speed: speedInByte
                        })
                    }
                }
            })

            const result = response.data.data

            onProgress?.("success", {
                progress: 100,
                restTime: 0,
                speed: file.size / ((Date.now() - startTime) / 1000)
            })

            return result
        } catch (error) {
            if (apiClient.isAxiosError(error) && !error.response) {
                throw UPLOAD_NETWORK_ERROR
            }
            throw error
        }
    }

    // /**
    //  * 获取预签名URL用于直接上传到对象存储
    //  */
    // getSignedUploadUrl = async (file, directory) => {
    //     const filename = `${uuid()}.${file.name.split(".").at(-1)}`
    //     const date = (Date.now() / 1000 / 60 / 60).toFixed(0)
    //     const dirname = `${directory || fileEnv.NEXT_PUBLIC_S3_FILE_PATH}/${date}`
    //     const pathname = `${dirname}/${filename}`
    //
    //     try {
    //         const response = await axios.post("/api/upload/presign", {
    //             pathname,
    //             contentType: file.type
    //         })
    //
    //         return {
    //             date,
    //             dirname,
    //             filename,
    //             path: pathname,
    //             preSignUrl: response.data.preSignUrl
    //         }
    //     } catch (error) {
    //         if (axios.isAxiosError(error) && !error.response) {
    //             throw UPLOAD_NETWORK_ERROR
    //         }
    //         throw error
    //     }
    // }
    //
    // /**
    //  * 使用预签名URL上传文件到存储
    //  */
    // uploadWithPreSignedUrl = async (file, preSignUrl, metadata, onProgress) => {
    //     const startTime = Date.now()
    //
    //     try {
    //         await axios.put(preSignUrl, file, {
    //             headers: {
    //                 "Content-Type": file.type
    //             },
    //             onUploadProgress: progressEvent => {
    //                 if (progressEvent.total) {
    //                     const progress = Number(
    //                         ((progressEvent.loaded / progressEvent.total) * 100).toFixed(1)
    //                     )
    //                     const speedInByte =
    //                         progressEvent.loaded / ((Date.now() - startTime) / 1000)
    //
    //                     onProgress?.("uploading", {
    //                         progress: progress === 100 ? 99.9 : progress,
    //                         restTime:
    //                             (progressEvent.total - progressEvent.loaded) / speedInByte,
    //                         speed: speedInByte
    //                     })
    //                 }
    //             }
    //         })
    //
    //         onProgress?.("success", {
    //             progress: 100,
    //             restTime: 0,
    //             speed: file.size / ((Date.now() - startTime) / 1000)
    //         })
    //
    //         return metadata
    //     } catch (error) {
    //         if (axios.isAxiosError(error) && !error.response) {
    //             throw UPLOAD_NETWORK_ERROR
    //         }
    //         throw error
    //     }
    // }

}

export const uploadService = new UploadService()
