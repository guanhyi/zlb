import { environment } from '@/environments/environment'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Button, Dialog, Space, Toast } from 'antd-mobile'
import { FileOutline } from 'antd-mobile-icons'
import { useRef, useState } from 'react'
import { NgHttp } from '../http/client'
import { lastValueFrom } from 'rxjs'

interface FileItem {
    url: string
    name: string
    size: number
    response?: any // 添加接口返回数据字段
}

interface FileUploadProps {
    value?: FileItem[]
    onChange?: (files: FileItem[], response?: any) => void // 修改回调函数类型
    maxCount?: number
    accept?: string
    multiple?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
    value = [],
    onChange,
    maxCount = 9,
    accept = '*',
    multiple = true
}) => {
    const [fileList, setFileList] = useState<FileItem[]>(value)
    const inputRef = useRef<HTMLInputElement>(null)
    const e = environment
    const http = useDependency(NgHttp)
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (file.size > 10 * 1024 * 1024) {
                Toast.show('文件大小不能超过10M')
                continue
            }

            try {
                const formData = new FormData()
                formData.append('file', file)

                const response = await lastValueFrom(
                    http.post<RemoteResultDTO<{ url: string }>>(`/file/`, formData)
                )

                const data = response
                // const data = await response.json()

                if (data.code === (200 as any)) {
                    const newFile: FileItem = {
                        url: data.data.url,
                        name: file.name,
                        size: file.size,
                        response: data.data // 保存完整的接口返回数据
                    }

                    setFileList((prev) => {
                        const newList = [...prev, newFile]
                        onChange?.(newList, data.data) // 传递文件列表和当前上传的响应数据
                        return newList
                    })
                } else {
                    Toast.show(data.msg || '上传失败')
                }
            } catch (error) {
                Toast.show('上传失败')
            }
        }
        // 清空 input 值，允许重复选择同一文件
        event.target.value = ''
    }

    const handleDelete = async (index: number) => {
        const result = await Dialog.confirm({
            content: '是否确认删除？'
        })

        if (result) {
            setFileList((prev) => {
                const newList = prev.filter((_, i) => i !== index)
                onChange?.(newList)
                return newList
            })
        }
    }

    const triggerUpload = () => {
        inputRef.current?.click()
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleUpload}
                style={{ display: 'none' }}
                disabled={fileList.length >= maxCount}
            />
            <Space direction="vertical" style={{ width: '100%' }}>
                {fileList.map((file, index) => (
                    <div key={index} className="flex">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div className="flex">
                                <FileOutline />
                                <div className="flex">
                                    <span className="text-sm truncate w-220px">{file.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(2)}KB
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            size="mini"
                            onClick={() => handleDelete(index)}
                            className="!px-3 !text-[#ff4d4f] border-[#ff4d4f] whitespace-nowrap "
                            fill="outline"
                        >
                            删除
                        </Button>
                    </div>
                ))}
                {fileList.length < maxCount && (
                    <Button block color="primary" onClick={triggerUpload}>
                        上传文件
                    </Button>
                )}
            </Space>
        </div>
    )
}
