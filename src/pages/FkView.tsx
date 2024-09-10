import bg from '@/assets/bg.png'
import { useAccountStote } from '@/core/services/account.service'
import { ScanCodeSerivce, ScanConfigType } from '@/core/services/scanCode.service'
import { Match } from '@/shared/components/control/Match'
import { Show } from '@/shared/components/control/Show'
import { Switch } from '@/shared/components/control/Switch'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Button, Form, Input, Picker, PickerRef } from 'antd-mobile'
import { RefObject, useEffect, useState } from 'react'
import { QrCodeView } from './QrCodeView'

function getCode() {
    //@ts-ignore
    const reg = new RegExp('(^|&)' + 'scenCode' + '=([^&]*)(&|$)', 'i')
    return window.location.search.substr(1).match(reg)
}

const ShowValue = (props: { value?: string }) => {
    return <div>{props.value || '请选择'}</div>
}
export const FkView = () => {
    const scanCodeService = useDependency(ScanCodeSerivce)
    const [config, setConfig] = useState<Partial<ScanConfigType>>({})
    const { state: userInfo } = useAccountStote()

    const [formElements, setFormElements] = useState<any[]>([])
    const [form] = Form.useForm()
    const qrCodeModal = useModal(QrCodeView)

    const initForm = (c: ScanConfigType) => {
        if (c.formElements && c.formElements.value) {
            let arr = JSON.parse(c.formElements.value) as any[]
            if (Array.isArray(arr)) {
                arr = arr.map((item) => {
                    if (item.type === 'select') {
                        item.options = item.options.map((option: any) => {
                            return {
                                text: option,
                                value: option
                            }
                        })
                    }

                    return item
                })
                setFormElements(arr || [])
            }
        }
    }

    useEffect(() => {
        const code = getCode()
        let scenCode = code ? code[2] : ''

        scanCodeService.getConfig(scenCode || 'kfq-glwyh').subscribe((res) => {
            if (res.data) {
                setConfig(res.data)
                form.setFieldsValue({
                    username: userInfo.personInfo?.realName,
                    idnum: userInfo.personInfo?.idCard,
                    mobile: userInfo.personInfo?.mobile,
                    ...res.data
                })
                if (res.ret == 1 && !res.data.accessControlType) {
                } else {
                    initForm(res.data)
                }
            }
        })
    }, [])

    const quickSubmit = () => {}
    const onSubmit = () => {
        form.validateFields().then((value) => {
            const data = {
                ...value,
                postType: 0, // 1表示代填，0表示当前用户
                // sceneCode: accountStore.userInFo.value?.sceneCode, //'ld-hz'
                sceneCode: config?.sceneCode,
                idnum: userInfo?.idnum, // "3****************X"
                mobile: userInfo?.mobile, // "155******67"
                username: userInfo?.username //"**阳"
            }

            scanCodeService.postSubmit(data).subscribe((res) => {
                qrCodeModal.show({ value: res.data.acsCode, config: config }).then((res) => {})
            })
        })
    }

    return (
        <NiceModal.Provider>
            <img src={bg} />
            <Form form={form} layout="horizontal">
                <Form.Item name={'sceneName'} label="登记点">
                    <Input readOnly />
                </Form.Item>
                <Form.Item name={'username'} label="姓名">
                    <Input readOnly />
                </Form.Item>
                <Form.Item name={'idnum'} label="身份证">
                    <Input readOnly />
                </Form.Item>
                <Form.Item name={'mobile'} label="联系电话">
                    <Input readOnly />
                </Form.Item>

                <div className="divider h-20px bg-#eee" />

                <Show when={formElements.length > 0}>
                    {formElements.map((item) => (
                        <Switch key={item.key}>
                            <Match when={item.online && item.type == 'select'}>
                                <Form.Item
                                    label={item.label}
                                    rules={[
                                        {
                                            required: item.required,
                                            message: item.placeholder
                                        }
                                    ]}
                                    name={item.key}
                                    onClick={async (e, pickerRef: RefObject<PickerRef>) => {
                                        const v = await Picker.prompt({
                                            columns: [
                                                item.options &&
                                                    item.options.map((v: any) => ({
                                                        value: v.value,
                                                        label: v.text
                                                    }))
                                            ],
                                            defaultValue: form.getFieldValue([item.key])
                                        })
                                        if (v) {
                                            form.setFieldValue(item.key, v[0])
                                            form.validateFields()
                                        }
                                    }}
                                >
                                    <ShowValue />
                                </Form.Item>
                            </Match>

                            <Match when={item.online && item.type.indexOf('text') != -1}>
                                <Form.Item
                                    name={item.key}
                                    label={item.label}
                                    rules={[
                                        {
                                            required: item.required,
                                            message: item.placeholder
                                        }
                                    ]}
                                >
                                    <Input placeholder={item.placeholder} />
                                </Form.Item>
                            </Match>
                        </Switch>
                    ))}
                </Show>
            </Form>
            <div className="m-16px">
                <Button block color="primary" onClick={onSubmit}>
                    提交
                </Button>
            </div>
        </NiceModal.Provider>
    )
}
